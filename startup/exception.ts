import { HttpErrorType } from '../src/configs/errorCode.js';
import packageData from '../package.json' with { type: 'json' };

 
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
			 
			// @ts-ignore
			this.code = error.code;
			 
			// @ts-ignore
			this.status = error.status;
			 
			// @ts-ignore
			this.reason = error.reason;
			 
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
		if (packageData.name && !this.source.includes(packageData.name)) {
			this.source.push(packageData.name);
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
