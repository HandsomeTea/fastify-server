import { Type } from '@sinclair/typebox';

export const PageSchema = {
    query: Type.Object({
        skip: Type.Number(),
        limit: Type.Number(),
        keyword: Type.String()
    }),
    response: {
        '2xx': Type.Object({
            total: Type.Number(),
            list: Type.Array(Type.Any())
        })
    }
};

export type PageQueryType = typeof PageSchema.query;
