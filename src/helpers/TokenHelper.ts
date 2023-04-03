import { TokenModel } from "../models";
import jwt from 'jsonwebtoken';
import { UserDto } from "../dtos";
import { getSecret } from "../config";

export interface Tokens {
    accessToken: string,
    refreshToken: string
}
class TokenHelper {

    generateToken ( payload: UserDto ): Tokens {

        const accessToken = jwt.sign( payload,  getSecret('JWT_ACCESS_TOKEN'), {expiresIn: '30m'} );
        const refreshToken = jwt.sign( payload, getSecret('JWT_REFRESH_ACCESS_TOKEN'), {expiresIn: '30d'} );

        return {
            accessToken,
            refreshToken
        }

    }

    validateAccessToken ( accessToken: string): any {
        try {
            const userData = jwt.verify( accessToken, getSecret('JWT_ACCESS_TOKEN') );
            return userData;
        } catch (error) {
            return error;
        }
    }

    validateRefreshToken ( refreshToken: string ): any {
        try {
            const userData: string | jwt.JwtPayload = jwt.verify( refreshToken, getSecret('JWT_REFRESH_ACCESS_TOKEN') );
            return userData;
        } catch (error) {
            return error
        }
    }

    async saveToken (userId: string, refreshToken: string ) {

        const tokenData = await TokenModel.findOne( {user: userId} );
 
        if ( tokenData ) {

            const token =  await TokenModel
                    .findOneAndUpdate( {user: userId}, { token: refreshToken } )
                    .exec();  

            return token;

        } 
        

        const token = new TokenModel({user: userId, token: refreshToken});

        token
            .save()
            .then( (obj: any) => {
                return obj;
            })

        return token; 

    }

    
    async findToken ( refreshToken: string ) {

        const token = await TokenModel.findOne({token: refreshToken});
    
        return token;
    }

    async deleteToken ( refreshToken: string ) {

        const token = await TokenModel.findOneAndDelete({token: refreshToken});
    
        return token;
    }

}

export default new TokenHelper;