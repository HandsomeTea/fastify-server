import Fastify from 'fastify';

export const app = Fastify({ logger: false });

/**
 * 禁用默认日志，因为格式不好，数据不全
 */
