
declare interface ExceptionInstance {
    message: string;
    source: Array<string>;
    code: string;
    status: number;
    reason?: Array<string>;
}

declare interface ExceptionConstructor {
    new(messageOrErrorOrException: string | ExceptionInstance | Error, code?: string, reason?: Array<string>): ExceptionInstance;
    readonly prototype: ExceptionInstance;
}

declare const Exception: ExceptionConstructor;
