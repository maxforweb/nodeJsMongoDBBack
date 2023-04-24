export enum ExceptionTypes {
	BAD_REQUEST = 'bad_request',
	UNAUTHORIZED = 'unauthorized',
	AUTHENTICATION_REQUIRED = 'authentication_required', // Front expect such error type for re-authentication feature
	FORBIDDEN = 'forbidden',
	NOT_FOUND = 'not_found',
	REQUEST_TIMEOUT = 'request_timeout',
	TOO_MANY_REQUESTS = 'too_many_requests',
	INTERNAL_SERVER_ERROR = 'internal_server_error',
	REQUEST_VALIDATION = 'bad_request',
	REQUEST_MESSAGE_TOO_LONG = 'bad_request',
	NO_CONTENT = 'no_content',
}

export interface ExceptionInterface {
    code: number,
    type: string,
    message: string, 
    description?: string
}