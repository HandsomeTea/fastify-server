import { generateTraceId } from '../configs/logger.js';
import { contextStorage, type RequestContext } from './context.js';
import fp from 'fastify-plugin';

export const requestHookPlugin = fp(async (fastify) => {
	fastify.addHook('preValidation', (request, _reply, done) => {
		const context: RequestContext = {
			userId: request.headers['x-user-id']?.toString() || '',
			traceId: request.headers['x-b3-traceid']?.toString() || generateTraceId(),
			spanId: request.headers['x-b3-spanid']?.toString() || generateTraceId(),
			parentSpanId: request.headers['x-b3-parentspanid']?.toString() || ''
		};

		contextStorage.run(context, () => {
			done();
		});
	});
});
