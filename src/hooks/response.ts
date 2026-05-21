import { trace } from '../configs/logger.js';
import { getContext } from './context.js';
import type { onResponseAsyncHookHandler, onSendAsyncHookHandler } from 'fastify';

export const sendHook: onSendAsyncHookHandler = async (_request, reply, payload) => {
	reply.responseBody = payload as string;
}

export const responseHook: onResponseAsyncHookHandler = async (request, reply) => {
	const ctx = getContext();

	if (ctx) {
		trace(
			{
				traceId: ctx.traceId,
				spanId: ctx.spanId,
				parentSpanId: ctx.parentSpanId,
				header: {
					host: request.headers.host,
					'content-type': request.headers['content-type'],
					'content-length': request.headers['content-length'],
					'x-b3-traceid': request.headers['x-b3-traceid'],
					'x-b3-spanid': request.headers['x-b3-spanid'],
					'x-b3-parentspanid': request.headers['x-b3-parentspanid'],
					...request.headers['authorization'] ? { authorization: request.headers['authorization'] } : {},
					...request.headers['x-user-id'] ? { 'x-user-id': request.headers['x-user-id'] } : {},
					...request.headers['x-user-token'] ? { 'x-user-token': request.headers['x-user-token'] } : {}
				},
				query: request.query || {},
				body: request.body || {},
				params: request.params || {}
			},
			'HTTP-REQUEST'
		).info(`[${request.method}] ${request.url}`);
		trace(
			{
				traceId: ctx.traceId,
				spanId: ctx.spanId,
				parentSpanId: ctx.parentSpanId,
				response: JSON.parse(reply.responseBody as string)
			},
			'HTTP-RESPONSE'
		).info(`[${request.method}] ${request.url} =>`);
	}
};
