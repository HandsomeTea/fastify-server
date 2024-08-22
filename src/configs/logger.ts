import pino from 'pino';
import pinoPretty, { PrettyOptions } from 'pino-pretty';
import { name } from '../../package.json';
import { getENV } from '@/configs';

interface MessageFormatLog {
    level: number
    time: number
    pid: number
    hostname: string
    msg: string
}

// export const traceLogger = pino({
//     name: `${name}:api`,
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
	messageFormat: ((log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${name}] ${message}\n`;
	}) as PrettyOptions['messageFormat'],
	ignore: 'pid,hostname'
}));

traceLogger.level = getENV('TRACE_LOG_LEVEL') || getENV('LOG_LEVEL') || 'silent';

// export const logger = pino({
//     name: `${name}:develop`,
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
	messageFormat: ((log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${name}] [develop:${data.pid}] ${message}\n`;
	}) as PrettyOptions['messageFormat'],
	ignore: 'pid,hostname'
}));

logger.level = getENV('DEV_LOG_LEVEL') || getENV('LOG_LEVEL') || 'silent';

// export const systemLogger = pino({
//     name,
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
	messageFormat: ((log: Record<string, unknown>, messageKey: string) => {
		const data = log as unknown as MessageFormatLog;
		const message = data[messageKey as 'msg'];

		return `[${name}] [system:${data.hostname}] ${message}\n`;
	}) as PrettyOptions['messageFormat'],
	ignore: 'pid,hostname'
}));

systemLogger.level = 'trace';
