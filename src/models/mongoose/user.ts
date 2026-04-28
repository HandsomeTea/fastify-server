import type { SchemaDefinition } from 'mongoose';
import BaseDb from './base.js';

export type UserModel = {
	user: string
	status: 'active' | 'failed'
} & MongoField

export const Users = new class Test extends BaseDb<UserModel> {
	constructor() {
		const model: SchemaDefinition = {
			user: { type: String, required: true },
			status: { type: String, enum: ['active', 'failed'], required: true, default: 'active' }
		};

		super('mongoose_user', model);
	}
};
