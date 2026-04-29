import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('userLoginRequired', async (request: FastifyRequest, _reply: FastifyReply) => {
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new Exception('No token provided');
        }

        // 这里替换为你真实的验证逻辑（如 JWT 验证）
        // const decoded = await fastify.jwt.verify(token);
    });
};

export default fp(authPlugin);
