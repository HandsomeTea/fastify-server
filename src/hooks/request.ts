import { app } from '@/app';
import { traceLogger } from '@/configs';

const traceId = (): string => {
	const digits = '0123456789abcdef';

	let _trace = '';

	for (let i = 0; i < 16; i += 1) {
		const rand = Math.floor(Math.random() * digits.length);

		_trace += digits[rand];
	}
	return _trace;
};

app.setGenReqId((request) => {
	if (!request.headers['x-b3-spanid']) {
		request.headers['x-b3-spanid'] = traceId();
	}
	return (request.headers['x-request-id'] || request.headers['x-b3-spanid']) as string;
});

app.addHook('onRequest', async request => {
	if (!request.headers['x-b3-traceid']) {
		request.headers['x-b3-traceid'] = traceId();
	}
	if (!request.headers['x-b3-parentspanid']) {
		request.headers['x-b3-parentspanid'] = '';
	}
	if (!request.headers['x-b3-spanid']) {
		request.headers['x-b3-spanid'] = traceId();
	}
	traceLogger.info(`[http-request] ${request.method}:${request.url}\n${JSON.stringify({
		reqId: request.id,
		headers: request.headers,
		query: request.query,
		body: request.body,
		params: request.params
	}, null, '   ')}`);
});
