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
					...request.headers,
					...(request.headers.cookie ? { cookie: '******' } : {})
				},
				query: request.query || {},
				body: request.body || {}
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
