import { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncRequestHandler<T extends Request> = (req: T, res: Response, next: NextFunction) => Promise<void | Response>;

export function handleAsync<T extends Request>(fn: AsyncRequestHandler<T>): RequestHandler {
	return function wrap(req: Request, res: Response, next: NextFunction) {
		return Promise.resolve(fn(req as T, res, next)).catch(next);
	};
}
