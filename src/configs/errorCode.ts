export const HttpErrorType = {
	URL_NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	BAD_REQUEST: 400,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INVALID_ARGUMENTS: 400,
	UNAUTHORIZED: 401,
	BE_LOGOUT: 401,
	REQUEST_TIMEOUT: 408,
	TOO_MANY_REQUESTS: 429,
	PACKAGE_NOT_FOUND: 404,
	JOB_NOT_FOUND: 404
} as const;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ErrorCode: { [K in keyof typeof HttpErrorType]: K } = {} as const;

for (const key in HttpErrorType) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	ErrorCode[key] = key;
}


/**
 * @api {Error} 接口报错返回示例如下 接口报错返回格式
 * @apiName error_response_example
 * @apiGroup 报错相关
 * @apiVersion 1.0.0
 * @apiErrorExample Error-Response:
 * {
 *   "status": 500,
 *   "code": "INTERNAL_SERVER_ERROR",
 *   "message": "user (name: %s) is invalid",
 *   "reason": ["admin"],
 *   "source": ["cpp_build"]
 * }
 * @apiError {number} [status] http状态码
 * @apiError {string} code 错误类型/错误码
 * @apiError {string} message 错误提示信息
 * @apiError {array} [reason] 错误信息中的变量(如有)信息
 * @apiError {array} source 错误源追踪信息
 */


/**
 * @api {Error} 错误码解释如下 api错误码
 * @apiName error_code
 * @apiGroup 报错相关
 * @apiVersion 1.0.0
 * @apiParam {string} e1000001 示例错误吗，可表示服务器内部错误
 * @apiParam {string} INTERNAL_SERVER_ERROR 示例错误吗，可表示服务器内部错误
 */
