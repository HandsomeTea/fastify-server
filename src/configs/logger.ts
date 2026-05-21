import { randomBytes } from 'node:crypto';
import pino from 'pino';
import packageData from '../../package.json' with { type: 'json' };
import { getEnv } from './env.js';

const serverName = packageData.name;
const auditLogger = pino(
	{
		level: getEnv('LOG_LEVEL') || 'info',
		base: { app: serverName.toUpperCase() },
		timestamp: pino.stdTimeFunctions.isoTime
	},
	pino.transport({
		targets: [
			{
				target: 'pino-roll',
				level: 'info',
				options: {
					file: 'public/logs/audit.log',
					frequency: 'daily',
					mkdir: true,
					translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o'
				}
			}
		]
	})
);
// 打印在控制台终端的Logger
export const terminalLogger = pino(
	{
		level: getEnv('LOG_LEVEL') || 'info',
		base: { app: serverName.toUpperCase() },
		timestamp: pino.stdTimeFunctions.isoTime
	},
	pino.transport({
		targets: [
			{
				target: 'pino-pretty',
				level: getEnv('LOG_LEVEL') || 'debug',
				options: { colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o' }
			}
		]
	})
);

// 3. 封装类似原来的 API 接口
export const log = (module = 'HTTP_REQUEST') => terminalLogger.child({ module: module.toUpperCase() });

export const system = (module: string) => terminalLogger.child({ module: `SYSTEM:${module.toUpperCase()}` });

export const audit = (module = 'AUDIT') => auditLogger.child({ module: module.toUpperCase(), type: 'audit' });

export const trace = (
	data: {
		traceId: string;
		spanId: string;
		parentSpanId: string;
		query?: unknown
		body?: unknown
		params?: unknown
		header?: Record<string, unknown>;
		response?: unknown;
	},
	module = serverName
) => {
	return terminalLogger.child({
		module: (module || 'default').toUpperCase(),
		...data
	});
};

export const generateTraceId = (): string => randomBytes(8).toString('hex');
