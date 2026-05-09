import Fastify from 'fastify';

/**
 * 禁用默认日志，使用自定义日志配置
 */
export const app = Fastify({ logger: false });

import { errorHook, requestHookPlugin, responseHook, userLoginCheck } from '../hooks/index.js';

app.register(userLoginCheck);
app.addHook('onError', errorHook);
app.addHook('preHandler', async (request, reply) => await app.userLoginRequired(request, reply));
app.register(requestHookPlugin);
app.addHook('onSend', responseHook);

import v1 from './v1/index.js';
import healthyCheck from './healthy.js';

app.register(healthyCheck);
app.register(v1, { prefix: '/api/usermanager/v1' });
