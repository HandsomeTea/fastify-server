import type { FastifyInstance } from 'fastify';
import { ErrorCode } from '../configs/errorCode.js';

export const errorHandler: FastifyInstance['errorHandler'] = (error, _request, reply) => {
	let exception = new Exception(`${error}`);

	if (error instanceof Exception) {
		exception = error;
		// @ts-ignore
	} else if (error.validation) {
		const e = error as Error & { validation: Array<unknown> }

		exception = new Exception(e.message, ErrorCode.INVALID_ARGUMENTS);
		// @ts-ignore
	} else if (error.serialization) {
		const e = error as Error & { serialization: { url: string, method: string } }

		exception = new Exception(`response ${e.message}`);
	}
	const { code, message, status, reason, source } = exception;

	reply.status(status);
	return { code, message, reason, source };
};
