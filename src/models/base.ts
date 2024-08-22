import { SchemaDefinition, FilterQuery, UpdateQuery, QueryOptions, UpdateWithAggregationPipeline, SchemaDefinitionType, Model, SortOrder } from 'mongoose';
import mongodb from '@/tools/mongodb';

export default class MongoBase<CM> {
	protected collectionName: string;
	private schemaModel: SchemaDefinition<SchemaDefinitionType<CM>>;

	constructor(collectionName: string, model: SchemaDefinition<SchemaDefinitionType<CM>>) {
		this.collectionName = collectionName;
		this.schemaModel = model;
	}

	private get model(): Model<CM> {
		const schema = new mongodb.schema(this.schemaModel, { versionKey: false, timestamps: true });

		return mongodb.server.model<CM>(this.collectionName, schema, this.collectionName);
	}

	async insertOne(data: Omit<CM, '_id' | 'createdAt' | 'updatedAt'>): Promise<CM> {
		return await new this.model(data).save() as unknown as CM;
	}

	async insertMany(data: Array<Omit<CM, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Array<CM>> {
		return await this.model.insertMany(data) as unknown as Array<CM>;
	}

	async removeOne(query: FilterQuery<CM>): Promise<{ deletedCount: number }> {
		return await this.model.deleteOne(query);
	}

	async removeMany(query: FilterQuery<CM>): Promise<{ deletedCount: number }> {
		return await this.model.deleteMany(query);
	}

	async updateOne(query: FilterQuery<CM>, update: UpdateQuery<CM> | UpdateWithAggregationPipeline) {
		return await this.model.updateOne(query, update);
	}

	async updateMany(query: FilterQuery<CM>, update: UpdateQuery<CM> | UpdateWithAggregationPipeline) {
		return await this.model.updateMany(query, update);
	}

	async find(query?: FilterQuery<CM>, options?: QueryOptions<CM>) {
		return await this.model.find(query || {}, null, options).lean();
	}

	async findOne(query: FilterQuery<CM>, options?: QueryOptions<CM>) {
		return await this.model.findOne(query, null, options).lean();
	}

	async findById(_id: string, options?: QueryOptions<CM>) {
		return await this.model.findById(_id, null, options).lean();
	}

	async findOneAndUpdate(query: FilterQuery<CM>, update: UpdateQuery<CM>, options?: QueryOptions<CM>) {
		return await this.model.findOneAndUpdate(query, update, { ...options, new: true }).lean();
	}

	async paging<K extends keyof CM>(query: FilterQuery<CM>, limit: number, skip: number, sort?: Record<K, 'asc' | 'desc' | 'ascending' | 'descending'>, options?: QueryOptions<CM>) {
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			list: await this.model.find(query, null, options).sort((() => {
				const obj: { [key: string]: SortOrder } = {};

				if (sort) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					Object.keys(sort).filter(a => !!sort[a]).map(b => obj[b] = sort[b]);
				}
				return obj;
			})()).skip(skip || 0).limit(limit).lean(),
			total: await this.count(query)
		};
	}

	async count(query?: FilterQuery<CM>): Promise<number> {
		if (Object.keys(query || {}).length > 0) {
			return await this.model.countDocuments(query || {});
		} else {
			return await this.model.estimatedDocumentCount();
		}
	}
}
