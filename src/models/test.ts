import { SchemaDefinition } from 'mongoose';
import BaseDb from './base';

export default new class Test extends BaseDb<TestModel> {
	constructor() {
		const model: SchemaDefinition = {
			user: { type: String, required: true },
			status: { type: String, enum: ['active', 'failed'], required: true, default: 'active' }
		};

		super('test', model);
	}
};
