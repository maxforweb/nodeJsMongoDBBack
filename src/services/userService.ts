import { UserDto } from "../dtos";
import { MailHelper, TokenHelper } from "../helpers";
import { Tokens } from "../helpers/TokenHelper";
import { UserModel } from "../models";
import { IUser, IUserModel } from "../models/User";
import bcrypt, { hash } from 'bcrypt';


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

    public async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await UserModel.find();
            
            return users;
        } catch (err) {
            throw err;
        }
    }

    public async registrate(userData: IUser): Promise<{userDto: UserDto, tokens: Tokens}> {
        const user = await UserService.findUserByEmail(userData.email);
        if ( user ) {
            throw new Error('User already exists');
        }
        userData.password = bcrypt.hashSync(userData.password, 3);

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

    public async login(userData: {email: string, password: string}): Promise<{userDto: UserDto, tokens: Tokens}> {
        const {email, password} = userData;
        let user:IUserModel | null;

        try {
            user = await UserModel.findOne({email});
            if (!user) {
                throw {status: 400, message: `User with email - ${email} doesn't exists`};
            }
        } catch (err) {
            throw err;
        }

        try {
            const existPass: boolean = await bcrypt.compare( password, password );

            if ( !existPass ) {
                throw {status: 400, message: 'Wrong password'}
            }
        } catch (err) {
            throw err;
        }

        try {
            const {userDto, tokens} = await this.generateDtoAndTokens(user);

            return {userDto, tokens};
        } catch (err) {
            throw err;
        }
    }

    private async generateDtoAndTokens(user: IUserModel): Promise<{userDto: UserDto, tokens: Tokens}> {
        const userDto = new UserDto( user );
        const tokens = TokenHelper.generateToken( {...userDto} );
        await TokenHelper.saveToken( userDto.id, tokens.refreshToken );
        
        return {userDto, tokens};
    }
}