export const ExceptionMessages = {
	BAD_REQUEST: 'The request is malformed or illegal. Please modify the request.',
	UNAUTHORIZED: 'The request is unauthorized. Please authenticate.',
	AUTHENTICATION_REQUIRED: 'The request is unauthorized. Please re-authenticate.',
	FORBIDDEN: 'The request is forbidden. Please modify access rights.',
	NOT_FOUND: 'The server cannot find the requested resource. Please check the url.',
	REQUEST_TIMEOUT: 'The request connection is timed out.',
	TOO_MANY_REQUESTS: 'Too many requests sent in a given amount of time. Please consider the rate limit.',
	INTERNAL_SERVER_ERROR: 'The server encountered an unexpected error. Please try again a little later.',
	REQUEST_VALIDATION: 'Unable to reply - The request is malformed or illegal. Please modify the request.',
	REQUEST_MESSAGE_TOO_LONG: 'Unable to reply - message length must be less than 160 characters.',
};
