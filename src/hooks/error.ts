import { log } from '../configs/logger.js';
import type { onErrorAsyncHookHandler } from 'fastify';

export const errorHook: onErrorAsyncHookHandler = async (_request, reply, error) => {

	// @ts-ignore
	reply.e = error;
	log('HTTP-ERROR').error(error);
};
