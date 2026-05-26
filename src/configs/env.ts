import type { Level } from 'pino';

interface EnvConfigType {
	NODE_ENV: 'development' | 'production' | 'test'
	PORT: number
	LOG_LEVEL?: Level
	AUDIT_LOG_LEVEL?: Level
	MONGO_URL: string
}
const developConfig: EnvConfigType = {
	NODE_ENV: 'development',
	PORT: 3333,
	LOG_LEVEL: 'trace',
	AUDIT_LOG_LEVEL: 'trace',
	MONGO_URL: 'mongodb://admin:admin@localhost:27017/test?authSource=admin'
};

export const getEnv = <K extends keyof EnvConfigType>(env: K): EnvConfigType[K] => process.env[env] as EnvConfigType[K] | undefined || developConfig[env];
