import { app } from '@/app';
import { traceLogger } from '@/configs';

app.addHook('onSend', async (request, reply, payload) => {
	let errPyload = null;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (reply.e) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { code, message, status, reason, source } = reply.e as ExceptionInstance;

		reply.status(status);
		errPyload = { code, message, reason, source };
	}

	traceLogger.info(`[http-response] ${request.method}:${request.url} =>\n${JSON.stringify({
		reqId: request.id,
		headers: request.headers,
		query: request.query,
		body: request.body,
		params: request.params,
		response: errPyload || JSON.parse(payload as string)
	}, null, '   ')}`);

	if (errPyload) {
		return JSON.stringify(errPyload);
	}
	return payload;
});
