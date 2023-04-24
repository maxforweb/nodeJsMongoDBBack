import { Response } from "express";

export class ResponseService {
	static success(res: Response) {
		return res.sendStatus(200);
	}

	static json(res: Response, data: object = {}) {
		return res.status(200).json({
			ok: true,
			...data,
		});
	}

	static jsonWithCode(res: Response, code: number, data: object = {}): Response {
		return res.status(code).json({
			ok: true,
			...data,
		});
	}

	static redirect(res: Response, redirectUri: string) {
		return res.status(301).redirect(redirectUri);
	}
}
