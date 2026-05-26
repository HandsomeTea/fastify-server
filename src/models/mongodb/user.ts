import BaseDb from './base.js';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const UserSchema = z.object({
	_id: z.instanceof(ObjectId).default(() => new ObjectId()),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
	name: z.string().min(2).max(50),
	account: z.object({
		email: z.email().min(5).max(50).optional(),
		username: z.string().min(3).max(30).optional()
	}),
	service: z.object({
		password: z.object({
			hash: z.string(),
			updateAt: z.date(),
			lockTo: z.date().optional(),
			tries: z.number().min(0).max(5).default(0)
		}).optional(),
		token: z.array(z.object({
			hash: z.string(),
			date: z.date()
		})).optional()
	}).optional(),
	firstLogin: z.date().optional(),
	tenantIds: z.array(z.string()),
	roles: z.enum(['ops', 'user']),
});

export type UserModel = z.infer<typeof UserSchema>;
export const Users = new class User extends BaseDb<UserModel> {
	constructor() {
		super('mongodb_user', UserSchema);
	}
};
