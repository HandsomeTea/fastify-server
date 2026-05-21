import 'fastify';

declare module 'fastify' {
    interface FastifyReply {
        responseBody?: string;
    }
}
