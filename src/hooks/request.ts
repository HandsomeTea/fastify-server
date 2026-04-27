import { randomBytes } from 'node:crypto';
import { app } from '../routes/app.js';
import { traceLogger } from '../configs/index.js';

const traceId = (): string => randomBytes(8).toString('hex');

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
