import { ExceptionInterface } from "./types";

export class BaseException extends Error {
	code: number;
	type: string;
	description: string;

	constructor({ code, type, message, 	description }: ExceptionInterface) {
		super(message);
		this.code = code;
		this.type = type;
		this.description = description ? description : '';
	}
}
