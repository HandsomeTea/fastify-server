// import mongodb from '../tools/mongose.js';
import mongodb from '../tools/mongodb.js';
import { system } from '../configs/logger.js';

/**
 * 健康检查
*/
export const isHealth = async () => {
	const result: Array<{ target: string, status: 'ok' }> = [];

	if (!mongodb.isOK) {
		return system('mongodb').error('mongodb connection is unusual');
	}
	result.push({
		target: 'mongodb',
		status: 'ok'
	});

	system('health').debug('health check: system is normal.');

	return result;
};
