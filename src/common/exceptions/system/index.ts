import { BaseException } from '../base_exception';
import { HttpStatus } from '../../enums/httpStatuses';
import { ExceptionInterface, ExceptionTypes } from '../types';
import { ExceptionMessages } from '../messages';

export class SystemException extends BaseException {
	constructor({ code, type, message, description = '' }: ExceptionInterface) {
		super({ code, type, message, description });
	}
}

export class InternalServerErrorException extends SystemException {
	constructor(description = '') {
		super({
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			type: ExceptionTypes.INTERNAL_SERVER_ERROR,
			message: ExceptionMessages.INTERNAL_SERVER_ERROR,
			description: description,
		});
	}
}