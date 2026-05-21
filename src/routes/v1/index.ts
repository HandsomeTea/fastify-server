import type { FastifyInstance/*, RegisterOptions*/ } from 'fastify';
import { TestBodySchema, TestQuerySchema, type TestBodyType, type TestQueryType } from './user.schema.js';


// opts是外部register时的RegisterOptions的透传，不限于RegisterOptions的字段，可外部自定义字段，自定义的字段可以在opts中获取
export default async (fastify: FastifyInstance/*, opts: RegisterOptions*/) => {
	fastify.get<{ Querystring: TestQueryType }>('/user', { schema: TestQuerySchema }, async _req => {
		return { user: 'user' };
	});

	fastify.post<{ Body: TestBodyType }>('/user', { schema: TestBodySchema }, async _req => {
		return { user: 'user' };
	});
};
