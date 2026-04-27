import pino from 'pino';
import pinoPretty from 'pino-pretty';
import packageData from '../../package.json' with { type: 'json' };
import getENV from './env.js';

interface MessageFormatLog {
	level: number
	time: number
	pid: number
	hostname: string
	msg: string
}

// export const traceLogger = pino({
//     name: `${packageData.name}:api`,
//     level: getENV('TRACE_LOG_LEVEL') || getENV('LOG_LEVEL') || 'silent',
//     transport: {
//         target: 'pino-pretty',
//         options: {
//             colorize: true,
//             translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
//             ignore: 'pid,hostname'
//         }
//     }
// });

export const traceLogger = pino(pinoPretty({
	colorize: true,
	translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
	messageFormat: (log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${packageData.name}] ${message}\n`;
	},
	ignore: 'pid,hostname'
}));

traceLogger.level = getENV('LOG_LEVEL') || 'silent';

// export const logger = pino({
//     name: `${packageData.name}:develop`,
//     level: getENV('DEV_LOG_LEVEL') || getENV('LOG_LEVEL') || 'silent',
//     transport: {
//         target: 'pino-pretty',
//         options: {
//             colorize: true,
//             translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
//             ignore: 'hostname'
//         }
//     }
// });

export const logger = pino(pinoPretty({
	colorize: true,
	translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
	messageFormat: (log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${packageData.name}] [develop:${data.pid}] ${message}\n`;
	},
	ignore: 'pid,hostname'
}));

logger.level = getENV('LOG_LEVEL') || 'silent';

// export const systemLogger = pino({
//     name: `${packageData.name}:system`,
//     level: 'trace',
//     transport: {
//         target: 'pino-pretty',
//         options: {
//             colorize: true,
//             translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
//             ignore: 'pid'
//         }
//     }
// });

export const systemLogger = pino(pinoPretty({
	colorize: true,
	translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
	messageFormat: (log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${packageData.name}] [system:${data.hostname}] ${message}\n`;
	},
	ignore: 'pid,hostname'
}));

systemLogger.level = 'trace';
