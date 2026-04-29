import { generateTraceId, trace } from '../configs/index.js';
import { contextStorage, getContext, type RequestContext } from './context.js';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const contextPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.addHook('onRequest', (request, reply, done) => {
		if (!request.headers['x-b3-traceid']) {
			request.headers['x-b3-traceid'] = generateTraceId();
		}
		if (!request.headers['x-b3-parentspanid']) {
			request.headers['x-b3-parentspanid'] = '';
		}
		if (!request.headers['x-b3-spanid']) {
			request.headers['x-b3-spanid'] = generateTraceId();
		}
		const context: RequestContext = {
			userId: request.headers['x-user-id']?.toString() || '',
			traceId: request.headers['x-b3-traceid'].toString() || generateTraceId(),
			spanId: request.headers['x-b3-spanid'].toString() || generateTraceId(),
			parentSpanId: request.headers['x-b3-parentspanid'].toString() || ''
		};

		contextStorage.run(context, () => {
			const ctx = getContext();

			if (ctx) {
				trace(
					{
						traceId: ctx.traceId,
						spanId: ctx.spanId,
						parentSpanId: ctx.parentSpanId,
						header: {
							...request.headers,
							...(request.headers.cookie ? { cookie: '******' } : {})
						},
						query: request.query || {},
						body: request.body || {}
					},
					'HTTP-REQUEST'
				).info(`[${request.method}] ${request.url}`);
			}
			done();
		});
	});
};

export default fp(contextPlugin);
