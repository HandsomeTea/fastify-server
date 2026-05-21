import { Type } from '@sinclair/typebox';

// 定义注册接口的入参规约
export const TestQuerySchema = {
    query: Type.Object({
        test: Type.Number(),
        aa: Type.Boolean(),
        bb: Type.String()
    }),
    response: {
        '2xx': Type.Object({
            user: Type.String()
        })
    }
};

export const TestBodySchema = {
    body: Type.Object({
        test: Type.Number(),
    }),
    response: {
        '2xx': Type.Object({
            success: Type.Boolean(),
            userId: Type.String()
        })
    }
};

// 🌟 顺便直接推导出 TS 类型，连 DTO(Data Transfer Object) 都不用写了！
export type TestQueryType = typeof TestQuerySchema.query;
export type TestBodyType = typeof TestBodySchema.body;
