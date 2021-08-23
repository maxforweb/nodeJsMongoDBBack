import { TokenModel } from "../models";
import jwt from 'jsonwebtoken';

class TokenHelper {

    generateToken ( payload: any ) {

        const accessToken = jwt.sign( payload,  'jwt-access-onehanded-pirate', {expiresIn: '30m'} );
        const refreshToken = jwt.sign( payload, 'jwt-resfresh-onehanded-pirate', {expiresIn: '30d'} );

        return {
            accessToken,
            refreshToken
        }

    }

    async saveToken (userId: any, refreshToken: string ) {

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

    async deleteToken ( refreshToken: string ) {

        const token = await TokenModel.findOneAndDelete({token: refreshToken});
    
        return token;
    }

}

export default new TokenHelper;