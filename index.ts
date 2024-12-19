// import './startup';

// import {  getENV } from '@/configs';

// process.on('unhandledRejection', reason => {
// 	// log('SYSTEM').fatal(reason);
// 	// audit('SYSTEM').fatal(reason);
// });

// process.on('uncaughtException', reason => {
// 	// log('SYSTEM').fatal(reason);
// 	// audit('SYSTEM').fatal(reason);
// });

// const port = getENV('PORT') || 3000;

// // import http from 'http';
// // import app from '@/routes/app';

// // app.set('port', port);
// // const server = http.createServer(app);

// import mongodb from '@/tools/mongodb';

// /**
//  * 健康检查
//  */
// // const isHeal

// // /** 健康检查机制 */
// // import { createTerminus } from '@godaddy/terminus';

// // createTerminus(server, {
// // 	signal: 'SIGINT',
// // 	healthChecks: {
// // 		'/healthcheck': async () => {
// // 			if (!await isHealth()) {
// // 				throw new Error();
// // 			}
// // 		}
// // 	}
// // });

// process.on('SIGINT', () => {
// 	process.exit(0);
// });

// process.on('exit', async () => {
// 	await mongodb.close();
// 	await mysql.close();
// 	log('SYSREM_STOP_CLEAN').info('server connection will stop normally.');
// });
import { app } from './src/app';
import './startup';

import '@/hooks';
import '@/routes';

import { getENV, systemLogger } from '@/configs';
import { isHealth } from './startup/healthy';

app.listen({
	port: getENV('PORT'),
	host: '0.0.0.0'
}, (err, address) => {
	if (err) {
		return systemLogger.error(err);
	}
	let check: NodeJS.Timeout | null = setInterval(async () => {
		if (!await isHealth()) {
			return;
		}
		global.isServerRunning = true;

		if (process.send) {
			process.send('ready');
		}
		if (check) {
			clearInterval(check);
			check = null;
		}

		systemLogger.info(`api document running at ${address}.`);
	}, 1000);
});
