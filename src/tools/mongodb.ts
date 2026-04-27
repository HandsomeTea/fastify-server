import mongoose from 'mongoose';
import { getEnv, systemLogger } from '../configs/index.js';
import { protectedUrl } from '../utils/index.js';

const RECONNET_TIME = 5000;
const mongoconnect = async () => {
	const mongodbAddress = getEnv('MONGO_URL');

	if (!mongodbAddress) {
		return systemLogger.error(`mongodb connect address is required but get "${mongodbAddress}"`);
	}
	try {
		await mongoose.connect(mongodbAddress);
	} catch (error) {
		if (error) {
			systemLogger.error(error);
			setTimeout(mongoconnect, RECONNET_TIME);
		}
	}
};

export default new (class MongoDb {
	constructor() {
		if (!this.isUseful) {
			return;
		}

		this.init();
	}

	private async init() {
		// 初始化操作
		this.server.once('connected', () => {
			// 连接成功
			systemLogger.info(`mongodb connected on ${protectedUrl(getEnv('MONGO_URL'))} success and ready to use.`);
		});

		this.server.on('disconnected', () => {
			// 连接失败或中断
			systemLogger.fatal(
				`disconnected! connection is break off. it will be retried in ${RECONNET_TIME} ms after every reconnect until success unless process exit.`
			);
		});

		this.server.on('reconnected', () => {
			// 重新连接成功
			systemLogger.info(`reconnect on ${protectedUrl(getEnv('MONGO_URL'))} success and ready to use.`);
		});
		return await mongoconnect();
	}

	/**
	 * 系统是否采用mongodb作为数据库
	 * @readonly
	 * @private
	 */
	private get isUseful() {
		return !!getEnv('MONGO_URL');
	}

	public get server() {
		if (!this.isUseful) {
			systemLogger.warn('mongodb is not available!');
		}
		return mongoose.connection;
	}

	public get schema() {
		return mongoose.Schema;
	}

	public get isOK() {
		return !this.isUseful || (this.isUseful && this.server.readyState === 1);
	}

	public async close(): Promise<void> {
		if (this.isUseful) {
			await this.server.close();
		}
	}
})();
