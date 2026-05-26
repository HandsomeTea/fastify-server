import type { FastifyInstance } from 'fastify';
import { ErrorCode } from '../configs/errorCode.js';

type ValidationError = Error & { validation: Array<unknown> };
type SerializationError = Error & { serialization: Array<unknown> };

export const errorHandler: FastifyInstance['errorHandler'] = (error, _request, reply) => {
	let exception = new Exception(`${error}`);

	if (error instanceof Exception) {
		exception = error;
	} else if ((error as ValidationError).validation) {
		const e = error as ValidationError;

		exception = new Exception(e.message, ErrorCode.INVALID_ARGUMENTS);
	} else if ((error as SerializationError).serialization) {
		const e = error as SerializationError;

		exception = new Exception(`response ${e.message}`);
	}
	const { code, message, status, reason, source } = exception;

	reply.status(status);
	return { code, message, reason, source };
};
