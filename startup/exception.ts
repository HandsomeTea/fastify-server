import { HttpErrorType } from '@/configs/errorCode';
import { name } from '../package.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.Exception = class Exception extends Error {
	public message: string;
	public code!: string;
	public status!: number;
	public reason?: Record<string, unknown>;
	public source: Array<string> = [];

	constructor(error?: string | ExceptionInstance | Error, code?: string, reason?: Record<string, unknown>) {
		super();

		// message
		if (typeof error === 'string') {
			this.message = error;
		} else {
			this.message = error?.message || 'inner server error!';
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.code = error.code;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.status = error.status;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.reason = error.reason;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.source = Array.from(error.source || '');
		}

		// code
		if (code && !this.code) {
			this.code = code;
		}

		if (!this.code) {
			this.code = 'INTERNAL_SERVER_ERROR';
		}

		// status
		if (!this.status) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.status = HttpErrorType[this.code];

			if (!this.status) {
				this.status = 500;
			}
		}

		// reason
		if (!this.reason) {
			this.reason = {};
		}
		if (reason && Object.keys(reason).length > 0) {
			this.reason = {
				...this.reason,
				...reason
			};
		}

		// source
		if (name && !this.source.includes(name)) {
			this.source.push(name);
		}
	}

	toString() {
		return JSON.stringify({
			message: this.message,
			code: this.code,
			status: this.status,
			reason: this.reason,
			source: this.source
		});
	}
};
