type LogLevel = 'silent' | 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

interface EnvConfigType {
	NODE_ENV: 'development' | 'production' | 'test'
	SERVER_NAME: string
	PORT: number
	LOG_LEVEL?: LogLevel
	TRACE_LOG_LEVEL?: LogLevel
	DEV_LOG_LEVEL?: LogLevel
	AUDIT_LOG_LEVEL?: LogLevel
	MONGO_URL: string
}
const developConfig: EnvConfigType = {
	NODE_ENV: 'development',
	SERVER_NAME: 'cppbuild server',
	PORT: 3333,
	LOG_LEVEL: 'trace',
	TRACE_LOG_LEVEL: 'trace',
	DEV_LOG_LEVEL: 'trace',
	AUDIT_LOG_LEVEL: 'trace',
	MONGO_URL: 'mongodb://admin:admin@10.4.48.13:27017/fastify-server?authSource=admin'
};

export default <K extends keyof EnvConfigType>(env: K): EnvConfigType[K] => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return process.env[env] || developConfig[env];
};
