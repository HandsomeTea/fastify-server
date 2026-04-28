import { app } from '../routes/app.js';
import { log } from '../configs/index.js';

app.addHook('onError', async (_request, reply, error) => {

	// @ts-ignore
	reply.e = error;
	log('HTTP-ERROR').error(error);
});
