import { ObjectId, type Db, type Filter, type FindOneAndUpdateOptions, type FindOneOptions, type FindOptions, type UpdateFilter } from 'mongodb';
import mongodb from '../../tools/mongodb.js';
import type { ZodObject } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class MongoBase<CM extends Record<string, any>> {
	protected collectionName: string;
	protected schema: ZodObject<CM>;

	constructor(collectionName: string, schema: typeof this.schema) {
		this.collectionName = collectionName;
		this.schema = schema;
	}

	private get collection() {
		return (mongodb.server as Db).collection<CM>(this.collectionName);
	}

	async insertOne(data: Omit<CM, '_id' | 'createdAt' | 'updatedAt'>) {
		const validatedData = this.schema.parse(data);

		// @ts-ignore
		return await this.collection.insertOne(validatedData);
	}

	async insertMany(data: Array<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>) {
		const validatedData = data.map((item) => this.schema.parse(item));

		// @ts-ignore
		return await this.collection.insertMany(validatedData);
	}

	async removeOne(query: Filter<CM>) {
		return await this.collection.deleteOne(query);
	}

	async removeMany(query: Filter<CM>) {
		return await this.collection.deleteMany(query);
	}

	async updateOne(query: Filter<CM>, update: UpdateFilter<CM>) {
		return await this.collection.updateOne(query, update);
	}

	async updateMany(query: Filter<CM>, update: UpdateFilter<CM>) {
		return await this.collection.updateMany(query, update);
	}

	async find(query?: Filter<CM>, options?: FindOptions) {
		return await this.collection.find(query || {}, options);
	}

	async findOne(query: Filter<CM>, options?: Omit<FindOneOptions, 'timeoutMode'>) {
		return await this.collection.findOne(query, options);
	}

	async findById(_id: string, options?: Omit<FindOneOptions, 'timeoutMode'>) {
		// @ts-ignore
		return await this.findOne({ _id: new ObjectId(_id) }, options);
	}

	async findOneAndUpdate(query: Filter<CM>, update: UpdateFilter<CM>, options?: FindOneAndUpdateOptions) {
		return await this.collection.findOneAndUpdate(query, update, { ...options, returnDocument: 'after' });
	}

	async paging<K extends keyof CM>(query: Filter<CM>, limit: number, skip: number, sort?: Record<K, 'asc' | 'desc' | 'ascending' | 'descending'>, options?: Record<K, 1 | 0>) {
		return {
			list: await this.find(query, {
				...sort ? { sort } : {},
				skip,
				limit,
				...options ? { projection: options } : {}
			}),
			total: await this.count(query)
		};
	}

	async count(query?: Filter<CM>) {
		if (Object.keys(query || {}).length > 0) {
			return await this.collection.countDocuments(query || {});
		} else {
			return await this.collection.estimatedDocumentCount();
		}
	}
}
