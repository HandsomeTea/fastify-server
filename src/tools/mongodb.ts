import { MongoClient, Db } from 'mongodb';
import { getEnv, system } from '../configs/index.js';
import { protectedUrl } from '../utils/index.js';

const RECONNET_TIME = 5000;

const mongoconnect = async (client: MongoClient): Promise<void> => {
    const mongodbAddress = getEnv('MONGO_URL');

    if (!mongodbAddress) {
        return system('MONGODB').error(`mongodb connect address is required but get "${mongodbAddress}"`);
    }
    try {
        await client.connect();
    } catch (error) {
        if (error) {
            system('MONGODB').error(error);
            setTimeout(() => mongoconnect(client), RECONNET_TIME);
        }
    }
};

export default new (class MongoDb {
    private isConnected = false;
    private _server: Db | null = null;
    constructor() {
        if (!this.isUseful) {
            throw new Error('MongoDB is not configured.');
        }

        this.init();
    }

    private async init() {
        const client = new MongoClient(getEnv('MONGO_URL'));

        client.on('open', () => {
            this.isConnected = true;
            this._server = client.db();
            system('MONGODB').info(`mongodb connected on ${protectedUrl(getEnv('MONGO_URL'))} success and ready to use.`);
        }).on('connectionPoolCleared', () => {
            this.isConnected = false;
            this._server = null;
            system('MONGODB').fatal(
                `disconnected! connection is break off. it will be retried in ${RECONNET_TIME} ms after every reconnect until success unless process exit.`
            );
        }).on('topologyClosed', () => {
            this.isConnected = false;
            this._server = null;
            system('MONGODB').info('mongodb client fully closed');
        });
        return await mongoconnect(client);
    }

    private get isUseful() {
        return !!getEnv('MONGO_URL');
    }

    public get server() {
        if (!this.isUseful) {
            system('MONGODB').warn('mongodb is not available!');
        }
        return this._server;
    }

    public get isOK() {
        return this.isConnected;
    }

    public async close(): Promise<void> {
        if (this.isUseful) {
            await this._server?.client.close();
        }
    }
})();
