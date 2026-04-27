import mongodb from '../src/tools/mongodb.js';
import { systemLogger } from '../src/configs/index.js';

/**
 * 健康检查
*/
export const isHealth = async () => {
	const result: Array<{ target: string, status: 'ok' }> = [];

	if (!mongodb.isOK) {
		return systemLogger.error('mongodb connection is unusual');
	}
	result.push({
		target: 'mongodb',
		status: 'ok'
	});

	systemLogger.debug('health check: system is normal.');

	return result;
};
