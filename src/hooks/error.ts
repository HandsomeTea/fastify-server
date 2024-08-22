import { app } from '@/app';
import { logger } from '@/configs';

app.addHook('onError', async (_request, reply, error) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	reply.e = error;
	logger.error(error);
});
