import Fastify from 'fastify';

/**
 * 禁用默认日志，使用自定义日志配置
 */
export const app = Fastify({ logger: false });

import { errorHandler, requestHookPlugin, sendHook, responseHook, userLoginCheck } from '../hooks/index.js';

/** 保存基础context */
app.register(requestHookPlugin);
/** 鉴权 */
app.addHook('preHandler', userLoginCheck);
/** 错误处理 */
app.setErrorHandler(errorHandler);
/** 传递发送给客户端的数据用于日志记录 */
app.addHook('onSend', sendHook);
/** 情亲和响应日志记录 */
app.addHook('onResponse', responseHook);

import healthyCheck from './healthy.js';
import v1 from './v1/index.js';

/** 健康检查接口 */
app.register(healthyCheck);
/** 接口定义 */
app.register(v1, { prefix: '/api/usermanager/v1' });
