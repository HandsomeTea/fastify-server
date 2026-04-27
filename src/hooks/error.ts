import { app } from '../app.js';
import { logger } from '../configs/index.js';

app.addHook('onError', async (_request, reply, error) => {
	 
	// @ts-ignore
	reply.e = error;
	logger.error(error);
});
