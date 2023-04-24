import { NextFunction, Request, Response } from 'express';
import { ResponseService } from '../../services/responseService';

export function errorHandlingMiddleware(error: Error & { code: number; type: string; description: string }, _req: Request, res: Response, next: NextFunction): Response {
	return ResponseService.jsonWithCode(res, error.code || 500, {
		ok: false,
		type: error.type,
		code: error.code,
		message: error.message, // the user-friendly error message
		description: error.description, // the actual error message
	});
}