import express from 'express'
import bcrypt, { hash } from 'bcrypt';
import {v4} from 'uuid';

import { UserDto } from '../dtos';

import {UserModel} from '../models';

import {MailHelper, TokenHelper} from '../helpers';

class UserController {

    findUserByEmail ( req: express.Request, res: express.Response) {
        const email: string = req.params.email;

        UserModel.findOne( {email : email}, (err, user) => {
            if( err ) {
                return res.status(404).json({
                    message: "Not found"
                })
            }
            res.json(user);
        })
    }

    getAll( req: express.Request, res: express.Response ) {
        UserModel.find()
        .exec( function (err, users) {
            if ( err ) return res.json({
                message: 'error'
            })


            if ( !users ) {
                return res.json({
                    message: 'empty'
                })
            }

            res.json(users)
        })
    }

    async registrateUser (req: express.Request, res: express.Response) {
  
        const hashPassword = bcrypt.hashSync(req.body.password, 3);
        
        const activationLink = v4();

        const postData = { 

            email: req.body.email,
            fullName: req.body.name,
            phone: req.body.phone,
            lastName: req.body.lastName,
            password: hashPassword,
            confirm_hash: activationLink,

        }

        const model = UserModel;
        const user = await model.findOne({ email: postData.email  });
        
        if ( user ) {
            return res.status(400).json({
                message: "Такой пользователь уже существует"
            });
        }

        const newUser =  new UserModel(postData);
        const userDto = new UserDto( newUser );
        
        const tokens = TokenHelper.generateToken( {...userDto} );

        TokenHelper.saveToken( userDto.id, tokens.refreshToken );
        
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} );
        
        MailHelper.sendActivationMail(userDto.emial, "http://localhost:3000/api/activate/" + activationLink);
        
        newUser.save()
            .then( (obj: any) => {

                res.json({ 
                    tokens,
                    user: userDto
                });

            })
            .catch( (err: any) => {
            res.json(err)
            } );
            
    }

    async loginUser ( req: express.Request, res: express.Response ) {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({email: email});

        if ( !user ) {
            return res.status(404).json({
                status: 404,
                message: "User doesn't exist"
            })
        }

        const existPass = await bcrypt.compare( password, user.password );

        if ( !existPass ) {
            return res.status(400).json( {
                status: 400,
                message: "Wrong password"
            } )
        }

        const userDto = new UserDto( user );
        const tokens = TokenHelper.generateToken( { ...userDto } );

        TokenHelper.saveToken( user._id, tokens.refreshToken );
        
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} );

        return res.json({
            tokens,
            user: userDto
        });

    }

    async logout ( req: express.Request, res: express.Response ) {

        const {refreshToken} = req.cookies;
        const token = await TokenHelper.deleteToken(refreshToken);
        
        res.clearCookie("refreshToken");
        
        return res.json(token);
    }

    delete ( req: express.Request, res: express.Response ) {
        const id: string = req.params.id;

        UserModel.findOneAndRemove( { _id: id } )
        .then(user => {
            if(user) {
                res.json({
                    message: `User ${user.fullName} ${user.lastName} deleted `
                })
            }
        })
        .catch(message =>{
            res.json({
                message
            })
        })
    }

    activateUser ( req: express.Request, res: express.Response ) {
        const link = req.params.link;

        UserModel
        .findOneAndUpdate( {confirm_hash: link}, {confirmed: true}, { new: true })
        .exec( ( err, user ) => {
            if ( err ) {
                return res.json(err);
            }

            return res.redirect('http://localhost:8080/login');
        });
    }

    async refreshToken ( req: express.Request, res: express.Response ) {
        
        const {refreshToken} = req.cookies;
        
        if ( !refreshToken ) {
            return res.status(401).json({
                status: 401,
                message: "user not authenticated"
            });
        }

        const userData: any = TokenHelper.validateRefreshToken( refreshToken ); 
        const tokenFromDB = await TokenHelper.findToken( refreshToken ); 

        if ( !userData || !tokenFromDB ) {
            return res.json({
                status: 401,
                message: "user not authenticated"
            });
        }

        const user = await UserModel.findById( userData.id );
        if ( !user ) {
            return res.json({
                status: 404,
                message: "user not found"
            })
        }
        const userDto = new UserDto( user );
        const tokens = TokenHelper.generateToken( { ...userDto } );

        TokenHelper.saveToken( user._id, tokens.refreshToken );
        
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} );

        return res.json({
            tokens,
            user: userDto
        });
    }
    
}

export default UserController;