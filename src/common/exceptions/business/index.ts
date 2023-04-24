import { BaseException } from '../base_exception';
import { HttpStatus } from '../../enums/httpStatuses';
import { ExceptionInterface, ExceptionTypes } from '../types';
import { BusinessExceptionMessages } from './messages';
import { BusinessExceptionDescriptions } from './descriptions';

/**
 * The BusinessException is thrown to indicate conditions that the server might want to catch.
 * It includes request validation, expected errors, etc.
 */
export class BusinessException extends BaseException {
	constructor({ code, type, message, description = '' }: ExceptionInterface) {
		super({ code, type, message, description });
	}
}

export class UserEmailMissingException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_EMAIL_MISSING
		})
	}
}

export class UserNotFoundByEmailException extends BusinessException {
	constructor(email: string) {
		super({
			code: HttpStatus.NOT_FOUND,
			type: ExceptionTypes.NOT_FOUND,
			message: BusinessExceptionMessages.USER_NOT_FOUND_BY_EMIAL,
			description: BusinessExceptionDescriptions.USER_NOT_FOUND_BY_EMAIL(email)
		})
	}
}

export class UsersNotFoundException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.NOT_FOUND,
			type: ExceptionTypes.NOT_FOUND,
			message: BusinessExceptionMessages.USERS_NOT_FOUND
		})
	}
}

export class UserAlreadyExistException extends BusinessException {
	constructor(email: string) {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_ALREADY_EXIST,
			description: BusinessExceptionDescriptions.USER_ALREADY_EXIST(email)
		})
	}
}

export class UserConfirmLinkMissingException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_ALREADY_EXIST
		})
	}
}

export class UserPasswordMissingException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_PASSWORD_MISSING
		})
	}
}

export class UserPasswordWrongException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_PASSWORD_WRONG
		})
	}
}

export class UserUuidMiisingException extends BusinessException {
	constructor() {
		super({
			code: HttpStatus.BAD_REQUEST,
			type: ExceptionTypes.BAD_REQUEST,
			message: BusinessExceptionMessages.USER_UUID_MISSING
		})
	}
}