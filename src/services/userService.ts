import { UserDto } from '../dtos';
import { MailHelper } from '../helpers';
import TokenService, { Tokens } from './TokenService';
import { UserModel } from '../models';
import bcrypt, { hash } from 'bcrypt';
import { UserGeneralDbFields, UserModelInterface, UserSchema } from '../types/User';
import { InternalServerErrorException, SystemException } from '../common/exceptions/system';

export class UserService {
	public async findByEmail(email: string): Promise<UserModelInterface | null> {
		try {
			const user = await UserModel.findOne({ email });
			return user;
		} catch (err) {
			throw new InternalServerErrorException('Error fetching user by email from MongoDB');
		}
	};

	public async findAll(): Promise<UserSchema[]> {
		try {
			const users = await UserModel.find({});
			return users;
		} catch (err) {
			throw new InternalServerErrorException('Error fetching users from MongoDB');
		}
	};

	public async create(userData: UserSchema): Promise<UserModelInterface> {
		try {
			const user = new UserModel(userData);
			await user.save();
			return user;
		} catch (err) {
			console.log(err);
			throw new InternalServerErrorException('Error saving new user to MongoDB');
		}
	};

	public async findAndUpdate(findFilter: UserGeneralDbFields, update: UserGeneralDbFields): Promise<UserModelInterface | null>{
		try {
			const user = await UserModel.findOneAndUpdate(findFilter, update, { new: true });
			return user;
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('Error updating user in MongoDB');
		}
	};

	public async deleteOne(data: UserGeneralDbFields): Promise<void> {
		try{
			await UserModel.findOneAndRemove(data);
		} catch (err) {
			throw new InternalServerErrorException('Error deleting user from MongoDB');
		}
	}

	public generateDto(user: UserModelInterface): UserDto {
		const userDto = new UserDto(user);

		return userDto;
	};

	public async generateTokens(user: UserDto): Promise<Tokens> {
		try {
			const tokens = TokenService.generateToken({ ...user });
			await TokenService.saveToken(user.id, tokens.refreshToken);
			
			return tokens;
		} catch (err) {
			throw new InternalServerErrorException('Error saving Tokens to DB');
		}
	};
}
