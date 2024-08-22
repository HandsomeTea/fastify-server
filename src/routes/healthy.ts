import { FastifyInstance } from 'fastify';
import { isHealth } from '../../startup/healthy';

export default async (fastify: FastifyInstance) => {
	fastify.get('/health', async () => {
		return await isHealth();
	});
};
