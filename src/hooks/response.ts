import { trace } from '../configs/index.js';
import { getContext } from './context.js';
import type { onSendAsyncHookHandler } from 'fastify';


export const responseHook: onSendAsyncHookHandler = async (request, reply, payload) => {
	let errPyload = null;


	// @ts-ignore
	if (reply.e) {

		// @ts-ignore
		const { code, message, status, reason, source } = reply.e as ExceptionInstance;

		reply.status(status);
		errPyload = { code, message, reason, source };
	}

	const ctx = getContext();

	if (ctx) {
		trace(
			{
				traceId: ctx.traceId,
				spanId: ctx.spanId,
				parentSpanId: ctx.parentSpanId,
				response: errPyload || JSON.parse(payload as string)
			},
			'HTTP-RESPONSE'
		).info(`[${request.method}] ${request.url} =>`);
	}

	if (errPyload) {
		return JSON.stringify(errPyload);
	}
	return payload;
};
