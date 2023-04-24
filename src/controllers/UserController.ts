import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import { v4 } from 'uuid';
import fileUpload from 'express-fileupload';
import fs from 'fs';

import { UserDto } from '../dtos';
import { UserModel } from '../models';
import { MailHelper, TokenService } from '../helpers';
import { UserSchema, UserByEmailRequest, UserModelInterface, UserConfirmLinkRequest } from '../types/User';
import { Model } from 'mongoose';
import { UserService } from '../services';
import { resolveSoa } from 'dns';
import { UserAlreadyExistException, UserConfirmLinkMissingException, UserEmailMissingException, UserNotFoundByEmailException, UserPasswordMissingException, UserPasswordWrongException, UsersNotFoundException, UserUuidMiisingException } from '../common/exceptions/business';
import { Tokens } from '../services/TokenService';
import { getSecret } from '../config';

class UserController {
	private readonly userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	public async getUserByEmail(req: Request<unknown, unknown, unknown, UserByEmailRequest>): Promise<UserDto | null> {
		const {email} = req.query;

		if (!email) {
			throw new UserEmailMissingException();
		}

		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new UserNotFoundByEmailException(email);
		}

		const userDto = this.userService.generateDto(user);

		return userDto
	}

	public async getAll(req: Request): Promise<UserSchema[]> {
		const users = await this.userService.findAll();
		if (!users) {
			throw new UsersNotFoundException();
		}
		return users;
	}

	public async registrateUser(req: Request): Promise<{userDto: UserDto, tokens: Tokens}> {
		const { body } = req;
		
		const currentUser = await this.userService.findByEmail(body.email);
		
		if (currentUser) {
			throw new UserAlreadyExistException(body.email);
		}

		const confirm_hash = v4();
		const postData: UserSchema = {
			email: body.email,
			fullName: body.name,
			phone: body.phone,
			lastName: body.lastName,
			password: body.password,
			confirm_hash,
			confirmed: false,
		};
		postData.password = bcrypt.hashSync(postData.password, 3);

		const user = await this.userService.create(postData);
		const userDto = this.userService.generateDto(user);
		const tokens = await this.userService.generateTokens(userDto);

		await MailHelper.sendActivationMail(userDto.email, `http://localhost:3000/user/activate/${postData.confirm_hash}`);
		return {userDto, tokens};
	}

	public async loginUser(req: Request): Promise<{userDto: UserDto, tokens: Tokens}> {
		const { email, password } = req.body;

		if (!email) {
			throw new UserEmailMissingException();
		}

		if (!password) {
			throw new UserPasswordMissingException();
		}

		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new UserNotFoundByEmailException(email);
		}

		const existPass: boolean = await bcrypt.compare(password, user.password);

		if (!existPass) {
			throw new UserPasswordWrongException();
		}

		const userDto = this.userService.generateDto(user);
		const tokens = await this.userService.generateTokens(userDto);
		
		return { userDto, tokens };
	}

	public async logout(req: Request) {
		const { refreshToken } = req.cookies;
		const token = await TokenService.deleteToken(refreshToken);
	}

	public async delete(req: Request): Promise<void> {
		const { uuid } = req.params;

		if (!uuid) {
			throw new UserUuidMiisingException();
		}

		await this.userService.deleteOne({ _id: uuid });
	}

	public async activateUser(req: Request<unknown, unknown, unknown, UserConfirmLinkRequest>): Promise<string> {
		const { link } = req.query;
		if (!link) {
			throw new UserConfirmLinkMissingException();
		}

		await this.userService.findAndUpdate({confirm_hash: link}, {confirmed: true});
		
		const redirectLink = getSecret('frontHostname');
		return redirectLink;
	}

	// public async refreshToken(req: Request, res: Response) {
	// 	// const { refreshToken } = req.cookies;

	// 	// if (!refreshToken) {
	// 	// 	return res.status(401).json({
	// 	// 		status: 401,
	// 	// 		message: 'user not authenticated',
	// 	// 	});
	// 	// }

	// 	// const userData: any = TokenHelper.validateRefreshToken(refreshToken);
	// 	// const tokenFromDB = await TokenHelper.findToken(refreshToken);

	// 	// if (!userData || !tokenFromDB) {
	// 	// 	return res.json({
	// 	// 		status: 403,
	// 	// 		message: 'user not authenticated',
	// 	// 	});
	// 	// }

	// 	// const user = await UserModel.findById(userData.id);
	// 	// if (!user) {
	// 	// 	return res.json({
	// 	// 		status: 404,
	// 	// 		message: 'user not found',
	// 	// 	});
	// 	// }
	// 	// const userDto = new UserDto(user);
	// 	// const tokens = TokenHelper.generateToken({ ...userDto });

	// 	// TokenHelper.saveToken(user._id, tokens.refreshToken);

	// 	// res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

	// 	// return res.json({
	// 	// 	tokens,
	// 	// 	user: userDto,
	// 	// });
	// }

	// public async updateUser(req: Request, res: Response) {
	// 	const userId = req.body.id;

	// 	if (!userId) {
	// 		return res.json({
	// 			sattus: 401,
	// 			message: 'Auth error',
	// 		});
	// 	}

	// 	const updateData = {
	// 		email: req.body.email,
	// 		fullName: req.body.name,
	// 		lastName: req.body.lastName,
	// 		phone: req.body.phone,
	// 	};

	// 	const options = {
	// 		new: true,
	// 		upsert: true,
	// 	};

	// 	const model = UserModel;

	// 	model
	// 		.findByIdAndUpdate(userId, { $set: updateData }, options)
	// 		.then((user) => {
	// 			if (user) {
	// 				const userDto = new UserDto(user);

	// 				res.json({
	// 					status: 200,
	// 					user: userDto,
	// 					message: 'User sucesfully updated',
	// 				});
	// 			} else {
	// 				res.json({
	// 					status: 400,
	// 					message: 'Something went wrong',
	// 				});
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			res.json(error);
	// 		});
	// }

	// public async changeUserPassword(req: Request, res: Response) {
	// 	const { id, oldPass, password } = req.body;
	// 	if (!id) {
	// 		return res.json({
	// 			status: 403,
	// 			message: 'User is not authenticated',
	// 		});
	// 	}

	// 	const user = await UserModel.findById(id);

	// 	if (!user) {
	// 		return res.json({
	// 			status: 404,
	// 			message: "User doesn't exist",
	// 		});
	// 	}

	// 	const existPass = await bcrypt.compare(oldPass, user.password);

	// 	if (!existPass) {
	// 		return res.json({
	// 			status: 400,
	// 			message: 'Password is wrong',
	// 		});
	// 	}

	// 	const hashPassword = bcrypt.hashSync(password, 3);

	// 	const options: object = {
	// 		new: true,
	// 	};

	// 	const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { password: hashPassword }, options });

	// 	if (!updatedUser) {
	// 		return res.json({
	// 			status: 500,
	// 			message: updatedUser,
	// 		});
	// 	}

	// 	const userDto = new UserDto(updatedUser);

	// 	res.json({
	// 		status: 200,
	// 		user: userDto,
	// 		message: 'User sucesfully updated',
	// 	});
	// }

	// public async uploadAvatar(req: Request, res: Response) {
	// 	const files: fileUpload.FileArray | undefined = req.files;
	// 	const { refreshToken } = req.cookies;

	// 	if (!refreshToken) {
	// 		return res.json({
	// 			status: 403,
	// 			message: 'User is not authorized',
	// 		});
	// 	}

	// 	const userData = TokenHelper.validateRefreshToken(refreshToken);

	// 	if (!userData) {
	// 		return res.status(403).json({
	// 			status: 403,
	// 			message: 'User is not authorized',
	// 		});
	// 	}

	// 	if (!files) {
	// 		return res.json({
	// 			status: 400,
	// 			message: 'Files was not uploaded',
	// 		});
	// 	}

	// 	const user = await UserModel.findById(userData.id);

	// 	if (!user) {
	// 		return res.status(400).json({
	// 			status: 400,
	// 			message: "User doesn't exist",
	// 		});
	// 	}

	// 	if (user.avatar) {
	// 		fs.unlinkSync('/Users/mkapustian/Projets/GoCleanBack/src/static/' + user.avatar);
	// 	}

	// 	const avatarName: string = v4() + '.jpg';
	// 	const file: any = files.file;

	// 	file.mv('/Users/mkapustian/Projets/GoCleanBack/src/static/' + avatarName);

	// 	user.avatar = avatarName;
	// 	await user.save();

	// 	const userDto = new UserDto(user);

	// 	return res.json({
	// 		status: 200,
	// 		user: userDto,
	// 		message: 'Avatar upload successfully',
	// 	});
	// }

	// public async resetPassword(req: Request, res: Response) {
	// 	const email = req.body.email ? req.body.email : '';
	// 	const link = req.params.link ? req.params.link : '';
	// 	const password = req.body.password ? bcrypt.hashSync(req.body.password, 3) : '';

	// 	const model = UserModel;

	// 	if (email) {
	// 		const resetLink = v4();

	// 		model.findOneAndUpdate({ email: email }, { reset_hash: resetLink }, { new: true }).exec((err, user) => {
	// 			if (!user) {
	// 				return res.json({
	// 					status: 404,
	// 					message: "User doesn't exist",
	// 				});
	// 			} else if (err) {
	// 				return res.json({ err: err });
	// 			}
	// 		});

	// 		MailHelper.sendResetPasswordEmail(email, 'http://localhost:3000/api/resetLink/' + resetLink);

	// 		res.cookie('reset_hash', resetLink, { maxAge: 60 * 60 * 1000, httpOnly: true });

	// 		return res.json({
	// 			status: 200,
	// 			message: 'success',
	// 		});
	// 	}

	// 	if (link) {
	// 		model.findOne({ reset_hash: link }).exec((err, user) => {
	// 			if (err) {
	// 				return res.json(err);
	// 			}

	// 			return res.redirect('http://localhost:8080/forgot-password/step2');
	// 		});
	// 	}

	// 	if (req.cookies.reset_hash && password) {
	// 		model
	// 			.findOneAndUpdate({ reset_hash: req.cookies.reset_hash }, { password: password, reset_hash: '' }, { new: true })
	// 			.then((user) => {
	// 				return res.json({
	// 					status: 200,
	// 					message: 'Password has changed successfully',
	// 				});
	// 			})
	// 			.catch((e) => {
	// 				return res.json(e);
	// 			});
	// 	}

	// 	return res.json({ err: 'Error' });
	// }
}

export default UserController;
