import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        userLoginRequired: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
