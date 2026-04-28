import { AsyncLocalStorage } from 'node:async_hooks';

// 定义你想要存储的数据结构
export interface RequestContext {
    userId: string;
    traceId: string;
    spanId: string;
    parentSpanId: string;
}

// 创建一个全局唯一的存储实例
export const contextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * 工具函数：在任何地方获取当前上下文
 */
export const getContext = () => contextStorage.getStore();
