import { Type } from '@sinclair/typebox';

export const PageSchema = {
    query: Type.Object({
        skip: Type.Number(),
        limit: Type.Boolean(),
        keyword: Type.String()
    }),
    response: {
        '2xx': Type.Object({
            total: Type.Number(),
            items: Type.Array(Type.Any())
        })
    }
};

export type PageQueryType = typeof PageSchema.query;
