declare global {
    var isServerRunning: boolean;
    type ExceptionInstance = Error & {
        code?: string;
        status?: number;
        reason?: Record<string, unknown>;
        source?: Array<string>;
    };

    var Exception: {
        new(error?: string | ExceptionInstance | Error, code?: string, reason?: Record<string, unknown>): ExceptionInstance;
    };
}

export { };
