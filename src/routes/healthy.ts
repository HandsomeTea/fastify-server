import type { FastifyInstance } from 'fastify';
import { isHealth } from '../../startup/healthy.js';

export default async (fastify: FastifyInstance) => {
	fastify.get('/health', async () => {
		return await isHealth();
	});
};
