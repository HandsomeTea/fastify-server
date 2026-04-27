import './startup/index.js';
import { getEnv, logger, systemLogger } from './configs/index.js';

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

import { app } from './routes/app.js';
import v1 from './routes/v1/index.js';
import healthyCheck from './routes/healthy.js';

app.register(healthyCheck);
app.register(v1, { prefix: '/api/v1'/*, foo: 'foo-str'*/ });


import './hooks/index.js';

import { isHealth } from './startup/healthy.js';
import packageData from '../package.json' with { type: 'json' };

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
