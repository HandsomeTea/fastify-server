import BaseDb from './base.js';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const UserSchema = z.object({
	_id: z.instanceof(ObjectId).default(() => new ObjectId()),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
	name: z.string().min(2).max(50)
});

export type UserModel = z.infer<typeof UserSchema>;
export const Users = new class User extends BaseDb<UserModel> {
	constructor() {
		// @ts-ignore
		super('mongodb_user', UserSchema);
	}
};
