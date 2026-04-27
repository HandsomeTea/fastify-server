import './startup/index.js';
import { getEnv, logger, systemLogger } from './src/configs/index.js';

process.on('unhandledRejection', reason => {
    systemLogger.fatal(reason);
    // audit('SYSTEM').fatal(reason);
});

process.on('uncaughtException', reason => {
    systemLogger.fatal(reason);
    // audit('SYSTEM').fatal(reason);
});

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('exit', async () => {
    logger.info('server connection will stop normally.');
});

import { app } from './src/app.js';


import './src/hooks/index.js';
import './src/routes/index.js';

import { isHealth } from './startup/healthy.js';
import packageData from './package.json' with { type: 'json' };

app.listen({
    port: getEnv('PORT'),
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

        systemLogger.info(`${packageData.name} running at ${address}.`);
    }, 1000);
});
