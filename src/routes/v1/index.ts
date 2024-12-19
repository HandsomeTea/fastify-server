import { FastifyInstance/*, RegisterOptions*/ } from 'fastify';


// opts是外部register时的RegisterOptions的透传，不限于RegisterOptions的字段，可外部自定义字段，自定义的字段可以在opts中获取
export default async (fastify: FastifyInstance/*, opts: RegisterOptions*/) => {
	fastify.get('/user', async (/*req, reply*/) => {
		return { user: 'user' };
	});
};
