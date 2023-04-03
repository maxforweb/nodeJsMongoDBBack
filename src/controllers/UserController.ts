import {Request, Response} from 'express'
import bcrypt, { hash } from 'bcrypt';
import {v4} from 'uuid';
import fileUpload from 'express-fileupload'
import fs from 'fs';

import { UserDto } from '../dtos';
import { UserModel } from '../models';
import { MailHelper, TokenHelper } from '../helpers';
import { IUser } from '../models/User';
import { Model } from 'mongoose';
import { UserService } from '../services';
import { resolveSoa } from 'dns';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService;
    }

    public async findUserByEmail ( req: Request, res: Response): Promise<Response> {
        const email: string = req.params.email;
    
        try {
            const user = await UserService.findUserByEmail(email);
            if(!user) {
                return res.status(404).json({
                    message: 'User does not exist'
                })
            }
            return res.json(user);
        } catch (err) {
            return res.status(400).json(err);
        }
    }

    public async getAll( _: Request, res: Response ): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            if (!users){
                return res.json({
                    status: 404,
                    message: 'There is no users in database'
                })
            }
            return res.json(users)
        } catch (err) {
            return res.json({
                status: 400,
                message: 'Error while requesting all users',
                error: err,
            })
        }
    }

    public async registrateUser (req: Request, res: Response): Promise<Response> {
        const confirm_hash = v4();
        const postData: IUser = { 
            email: req.body.email,
            fullName: req.body.name,
            phone: req.body.phone,
            lastName: req.body.lastName,
            password: req.body.password,
            confirm_hash,
            confirmed: false
        }

        try {
            const user = await this.userService.registrate(postData);
            res.cookie('refreshToken', user.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            
            return res.json(user)
        } catch(err: any) {
            return res.status(400).json({
                message: err.message,
            })
        }
    }

    public async loginUser ( req: Request, res: Response ) {
        const email: string = req.body.email;
        const password: string = req.body.password;
        
        try {
            const {userDto, tokens} = await this.userService.login({email, password});
            
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} );
            return res.json({
                tokens,
                user: userDto,
                status: 200
            });
        } catch (err: any) {
            return res.status(err.status).json({
                status: err.status,
                message: err.message
            });
        }
    }

    public async logout ( req: Request, res: Response ) {

        const {refreshToken} = req.cookies;
        const token = await TokenHelper.deleteToken(refreshToken);
        
        res.clearCookie("refreshToken");
        
        return res.json(token);
    }

    public async delete ( req: Request, res: Response ) {
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

    public async activateUser ( req: Request, res: Response ) {
        const link = req.params.link;

        UserModel
        .findOneAndUpdate( {confirm_hash: link}, {confirmed: true}, { new: true })
        .exec( ( err, user ) => {
            if ( err ) {
                return res.json(err);
            }

            return res.redirect('http://localhost:8080');
        });
    }

    public async refreshToken ( req: Request, res: Response ) {
        
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
                status: 403,
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

    public async updateUser ( req: Request, res: Response ) {
        const userId = req.body.id;

        if ( !userId ) {
            return res.json({
                sattus: 401,
                message: 'Auth error'
            })
        }

        const updateData = {
            email: req.body.email,
            fullName: req.body.name,
            lastName: req.body.lastName,
            phone: req.body.phone,
        }

        const options = {
            new: true,
            upsert: true,
        }

        const model = UserModel;

        model
            .findByIdAndUpdate( userId, { $set: updateData}, options )
            .then( user => {
                if ( user ) {
                    const userDto = new UserDto( user );

                    res.json({
                        status: 200,
                        user: userDto,
                        message: "User sucesfully updated"
                    })
                } else {
                    res.json({
                        status: 400,
                        message: 'Something went wrong'
                    })
                }
            })
            .catch( error => {
                res.json(error);
            })
    }

    public async changeUserPassword ( req: Request, res: Response ) {
        const {id, oldPass, password} = req.body;
        if ( !id ) {
            return res.json({
                status: 403,
                message: 'User is not authenticated'
            })
        }

        const user = await UserModel.findById(id);

        if ( !user ) {
            return res.json({
                status: 404,
                message: "User doesn't exist"
            })
        }

        const existPass = await bcrypt.compare(oldPass, user.password);

        if ( !existPass ) {
            return res.json({
                status: 400,
                message: "Password is wrong"
            })
        }

        const hashPassword = bcrypt.hashSync(password, 3);

        const options: object = { 
            new: true
        };

        
        const updatedUser = await UserModel.findByIdAndUpdate( id, { $set: { password: hashPassword }, options });

        if ( !updatedUser ) {
            return res.json({
                status: 500,
                message: updatedUser
            })
        }

        const userDto = new UserDto(updatedUser);

        res.json({
            status: 200,
            user: userDto,
            message: "User sucesfully updated"
        })
    }

    public async uploadAvatar ( req: Request, res: Response ) {
        const files: fileUpload.FileArray | undefined = req.files;
        const {refreshToken} = req.cookies;

        if ( !refreshToken ) {
            return res.json({
                status: 403,
                message: "User is not authorized"
            })
        }

        const userData = TokenHelper.validateRefreshToken(refreshToken);

        if ( !userData ) {
            return res.status(403).json({
                status: 403,
                message: "User is not authorized"
            })
        }

        if ( !files ) {
            return res.json({
                status: 400,
                message: "Files was not uploaded"
            })
        }

        const user = await UserModel.findById(userData.id);

        if ( !user ) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            })
        }

        if ( user.avatar ) {
            fs.unlinkSync("/Users/mkapustian/Projets/GoCleanBack/src/static/" + user.avatar);
        }
        
        const avatarName: string = v4() + '.jpg';
        let file: any = files.file;
        
        file.mv("/Users/mkapustian/Projets/GoCleanBack/src/static/" + avatarName)
        
        user.avatar = avatarName;
        await user.save()
        
        const userDto = new UserDto( user );
        
        return res.json({
            status: 200,
            user: userDto,
            message: "Avatar upload successfully"
        })

    }

    public async resetPassword ( req: Request, res: Response ) {
        const email = req.body.email ? req.body.email : '';
        const link = req.params.link ? req.params.link : '';
        const password = req.body.password ? bcrypt.hashSync(req.body.password, 3) : '';
        
        const model = UserModel;

        if ( email ) {

            const resetLink = v4();

            model
                .findOneAndUpdate( {email: email}, {reset_hash: resetLink}, {new: true} )
                .exec( (err, user) => {
                    if ( !user ) {
                        return res.json({
                            status: 404,
                            message: "User doesn't exist"
                        })
                    } else if ( err ) {
                        return res.json({err: err});
                    }
                } );

            MailHelper.sendResetPasswordEmail( email, 'http://localhost:3000/api/resetLink/' + resetLink );
            
            res.cookie( 'reset_hash', resetLink, { maxAge: 60 * 60 * 1000, httpOnly: true } );

            return res.json({
                status: 200,
                message: 'success'
            })
        } 

        if ( link ) {

            model
                .findOne( {reset_hash: link} )
                .exec( (err, user) => {
                    if ( err ) {
                        return res.json(err);
                    }

                    return res.redirect('http://localhost:8080/forgot-password/step2');
                })
        }

        if ( req.cookies.reset_hash && password ) {
            model 
                .findOneAndUpdate( { reset_hash: req.cookies.reset_hash }, { password: password, reset_hash: '' }, { new: true } )
                .then( ( user ) => {
                    return res.json({
                        status: 200,
                        message: 'Password has changed successfully',
                    })
                })
                .catch( (e) => {
                    return res.json(e);
                })
        }

        return res.json({err: 'Error'});
    }
}

export default UserController;