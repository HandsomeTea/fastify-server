import crypto from 'node:crypto';

process.env.INSTANCEID = crypto.randomBytes(24).toString('hex').substring(0, 24);
global.isServerRunning = false;
import './startup/index.js';
import { getEnv } from './configs/env.js';
import { system } from './configs/logger.js';

process.on('unhandledRejection', reason => {
    system('Rejection').fatal(reason);
    // audit('SYSTEM').fatal(reason);
});

process.on('uncaughtException', reason => {
    system('Exception').fatal(reason);
    // audit('SYSTEM').fatal(reason);
});

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('exit', async () => {
    system('exit').info('server connection will stop normally.');
});

import { app } from './routes/app.js';
import { isHealth } from './startup/healthy.js';
import packageData from '../package.json' with { type: 'json' };

app.listen({
    port: getEnv('PORT'),
    host: '0.0.0.0'
}, (err, address) => {
    if (err) {
        return system('startup').error(err);
    }
    let check: NodeJS.Timeout | null = setInterval(async () => {
        if (!await isHealth()) {
            return;
        }

        if (process.send) {
            process.send('ready');
        }
        if (check) {
            clearInterval(check);
            check = null;
        }
        global.isServerRunning = true;
        system('startup').info(`${packageData.name} running at ${address}.`);
    }, 1000);
});
