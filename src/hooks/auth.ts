import type { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorCode } from '../configs/errorCode.js';

export const userLoginCheck = async (request: FastifyRequest, _reply: FastifyReply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        throw new Exception('No token provided', ErrorCode.UNAUTHORIZED);
    }

    // 这里替换为你真实的验证逻辑（如 JWT 验证）
    // const decoded = await fastify.jwt.verify(token);
}
