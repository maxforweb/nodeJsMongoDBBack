import { Query } from 'express-serve-static-core';
import { ObjectId, Document } from 'mongoose';

export interface UserSchema {
	email: string;
	fullName: string;
	lastName: string;
	password: string;
	confirmed: boolean;
	phone?: string;
	avatar?: string;
	confirm_hash?: string;
	last_seen?: Date;
	reset_hash?: string;
}

export interface UserModelInterface extends UserSchema, Document {}


export interface UserByEmailRequest extends Query{
    email: string
}

export interface UserConfirmLinkRequest extends Query{
    link: string
}

export interface CreateUserBody {
	email: string;
	fullName: string;
	lastName: string;
	password: string;
	phone?: string;
	avatar?: string;
}

export interface LoginUser {
	email: string,
	password: string
}

export interface UserGeneralDbFields {
	[key: string]: string |
				   number |
				   ObjectId |
				   boolean
}