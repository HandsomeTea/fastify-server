import { ObjectId, Users } from '../models/mongodb/index.js';
import type { UserModel } from '../models/mongodb/index.js';

import { ErrorCode } from '../configs/errorCode.js';
import { passwordEncrypted, randomString, sha256 } from '../utils/index.js';


interface LoginUserInfo {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    account: {
        email?: string;
        username?: string;
    };
    tenantIds: Array<string>;
    roles: "ops" | "user";
    service: {
        password?: {
            updateAt: Date;
        }
        token: string;
    };
    firstLogin?: Date;
}

export const UserService = new class UserService {
    private readonly PASSWORD_ERROR_MAX_TRIES = 5;
    private readonly TOKEN_EXPIRE_TIME = 3 * 24 * 60 * 60 * 1000;
    private readonly TOKEN_MAX_COUNT = 3;
    private readonly LOCK_DURATION = 30 * 60 * 1000;

    constructor() {
        setInterval(() => {
            void this.clearExpiredTokens();
        }, 2 * 24 * 60 * 60 * 1000);
    }

    private async clearExpiredTokens() {
        const expiredTimestamp = Date.now() - this.TOKEN_EXPIRE_TIME;
        await Users.updateMany(
            { 'service.token': { $exists: true, $ne: [] } },
            { $pull: { 'service.token': { date: { $lte: new Date(expiredTimestamp) } } } }
        );
    }

    private buildLoginUserInfo(user: UserModel, token: string): LoginUserInfo {
        return {
            _id: user._id.toString(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            name: user.name,
            account: user.account,
            tenantIds: user.tenantIds,
            roles: user.roles,
            service: {
                ...user.service?.password ? {
                    password: {
                        updateAt: user.service.password.updateAt
                    }
                } : {},
                token
            },
            firstLogin: user.firstLogin
        };
    }

    async getUser(option: { id?: string, token?: string }) {
        const { id, token } = option;

        if (!id && !token) {
            throw new Exception('user id or token is required', ErrorCode.FORBIDDEN);
        }
        if (id && !ObjectId.isValid(id)) {
            throw new Exception('invalid user id', ErrorCode.INVALID_ARGUMENTS);
        }

        const user = await Users.findOne({
            ...id ? { _id: new ObjectId(id) } : {},
            ...token ? { 'service.token.hash': sha256(token) } : {}
        });

        if (!user) {
            throw new Exception('user not found', ErrorCode.NOT_FOUND);
        }
        return user;
    }

    async loginByPassword(account: string, password: string): Promise<LoginUserInfo> {
        const user = await Users.findOne({
            $or: [
                { 'account.email': account },
                { 'account.username': account }
            ]
        });

        if (!user) {
            throw new Exception('invalid account or password', ErrorCode.UNAUTHORIZED);
        }
        if (!user.service?.password) {
            throw new Exception('invalid account or password', ErrorCode.UNAUTHORIZED);
        }
        if (user.service.password.lockTo && user.service.password.lockTo > new Date()) {
            throw new Exception('account has been locked, please try again later', ErrorCode.UNAUTHORIZED);
        }
        const passwordHashed = passwordEncrypted(password);

        if (user.service.password.hash !== passwordHashed) {
            if (user.service.password.tries === this.PASSWORD_ERROR_MAX_TRIES - 1) {
                await Users.updateOne({ _id: user._id }, {
                    $set: {
                        'service.password.tries': this.PASSWORD_ERROR_MAX_TRIES,
                        'service.password.lockTo': new Date(Date.now() + this.LOCK_DURATION)
                    }
                });
                throw new Exception('invalid account or password, account has been locked', ErrorCode.UNAUTHORIZED);
            }
            await Users.updateOne({ _id: user._id }, {
                $inc: { 'service.password.tries': 1 }
            });
            throw new Exception('invalid account or password', ErrorCode.UNAUTHORIZED);
        }

        await Users.updateOne({ _id: user._id }, {
            $set: { 'service.password.tries': 0 },
            $unset: { 'service.password.lockTo': '' }
        });

        const token = randomString();
        const hashedToken = sha256(token);
        const now = new Date(Date.now());
        const existingTokens = [...(user.service.token ?? [])];

        if (existingTokens.length >= this.TOKEN_MAX_COUNT) {
            const rotatedTokens = existingTokens
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(1)
                .concat({
                    hash: hashedToken,
                    date: now
                });

            await Users.updateOne({ _id: user._id }, {
                $set: {
                    'service.token': rotatedTokens
                }
            });
        } else {
            await Users.updateOne({ _id: user._id }, {
                $push: {
                    'service.token': {
                        hash: hashedToken,
                        date: now
                    }
                }
            });
        }

        return this.buildLoginUserInfo(user, token);
    }

    async loginByToken(token: string): Promise<LoginUserInfo> {
        const hashedToken = sha256(token);
        const user = await Users.findOne({
            'service.token.hash': hashedToken
        });

        if (!user) {
            throw new Exception('invalid token', ErrorCode.UNAUTHORIZED);
        }

        const tokenItem = user.service?.token?.find((item) => item.hash === hashedToken);

        if (!tokenItem) {
            throw new Exception('invalid token', ErrorCode.UNAUTHORIZED);
        }

        const expiredDate = tokenItem.date.getTime() + this.TOKEN_EXPIRE_TIME;
        if (expiredDate < Date.now()) {
            throw new Exception('token expired', ErrorCode.UNAUTHORIZED);
        }

        return this.buildLoginUserInfo(user, token);
    }
};
