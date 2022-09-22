import { UserDto } from "../dtos";
import { MailHelper, TokenHelper } from "../helpers";
import { Tokens } from "../helpers/TokenHelper";
import { UserModel } from "../models";
import { IUser, IUserModel } from "../models/User";

export class UserService {
    public static async findUserByEmail(email: string): Promise<IUser | null > {
        try {
            const user = await UserModel.findOne({ email : email });
            return user;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    public static async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await UserModel.find();
            
            return users;
        } catch (err) {
            throw err;
        }
    }

    public static async registrateUser(userData: IUser): Promise<{userDto: UserDto, tokens: Tokens}> {
        const user = await UserService.findUserByEmail(userData.email);
        if ( user ) {
            throw  new Error('User already exists');
        }
        
        const newUser =  new UserModel(userData);
        const {userDto, tokens} = await this.generateDtoAndTokens(newUser);

        await MailHelper.sendActivationMail(userDto.email, `http://localhost:3000/api/activate/${userData.confirm_hash}`);

        try {
            await newUser.save();
        } catch (err) {
            console.log(err);
            throw err;
        }

        return {userDto, tokens};
    }

    private static async generateDtoAndTokens(user: IUserModel): Promise<{userDto: UserDto, tokens: Tokens}> {
        const userDto = new UserDto( user );
        const tokens = TokenHelper.generateToken( {...userDto} );
        await TokenHelper.saveToken( userDto.id, tokens.refreshToken );
        
        return {userDto, tokens};
    }
}