import mongoose from 'mongoose';
import { getENV, systemLogger } from '@/configs';

const RECONNET_TIME = 5000;
const mongoconnect = async () => {
	const mongodbAddress = getENV('MONGO_URL');

	if (!mongodbAddress) {
		return systemLogger.error(`mongodb connect address is required but get ${mongodbAddress}`);
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

export default new class MongoDB {
	constructor() {
		if (!this.isUseful) {
			return;
		}

		this.init();
	}

	private async init() {
		this.server.once('connected', () => {
			systemLogger.info(`mongodb connected on ${getENV('MONGO_URL')} success and ready to use.`);
		});

		this.server.on('disconnected', () => {
			systemLogger.fatal(`disconnected! connection is break off. it will be retried in ${RECONNET_TIME} ms after every reconnect until success unless process exit.`);
		});

		this.server.on('reconnected', () => {
			systemLogger.info(`reconnect on ${getENV('MONGO_URL')} success and ready to use.`);
		});
		return await mongoconnect();
	}

	private get isUseful() {
		return !!getENV('MONGO_URL');
	}

	public get server() {
		if (!this.isUseful) {
			systemLogger.warn(`require to use ${getENV('MONGO_URL')}, but call mongodb! mongodb is not available!`);
		}
		return mongoose.connection;
	}

	public get schema() {
		return mongoose.Schema;
	}

	public get isOK() {
		return !this.isUseful || this.isUseful && this.server.readyState === 1;
	}

	public async close(): Promise<void> {
		if (this.isUseful) {
			await this.server.close();
		}
	}
};
