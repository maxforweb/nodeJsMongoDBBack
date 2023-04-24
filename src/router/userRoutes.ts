import { Router, Request } from 'express';
import { Query } from 'express-serve-static-core';
import { handleAsync } from './helpers/handleAsync';
import { UserController } from '../controllers';
import { CreateUserBody, LoginUser, UserByEmailRequest, UserConfirmLinkRequest } from '../types/User';

const userRouter = Router();
const userController = new UserController();

interface TypedRequestQuery<T extends Query> extends Request {
	query: T;
}

interface TypedRequestBoody<T>  extends Request {
    body: T;
}

userRouter.get(
    '/user-by-email', 
    handleAsync<TypedRequestQuery<UserByEmailRequest>>(async(req, res, next) => {
        try {
            const user = await userController.getUserByEmail(req);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    })
);

userRouter.get(
    '/', 
    handleAsync<TypedRequestQuery<UserByEmailRequest>>(async(req, res, next) => {
        try {
            const users = await userController.getAll(req);
            return res.json(users);
        } catch (error) {
            return next(error);
        }
    })
);

userRouter.post(
    '/',
    handleAsync<TypedRequestBoody<CreateUserBody>>(async(req, res, next) => {
        try {
            const { userDto, tokens } = await userController.registrateUser(req);
		    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userDto);
        } catch (error) {
            return next(error);
        }
    })
);

userRouter.get(
    '/activate', 
    handleAsync<TypedRequestQuery<UserConfirmLinkRequest>>(async(req, res, next) => {
        try {
            const redirect_link = await userController.activateUser(req);
            return res.redirect(redirect_link);
        } catch (error) {
            return next(error);
        }
    })
);

userRouter.post(
    '/login', 
    handleAsync<TypedRequestBoody<LoginUser>>(async(req, res, next) => {
        try{
            const { userDto, tokens } = await userController.loginUser(req);
    		res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({userDto, tokens});
        } catch (error) {
            return next(error);
        }
    })
);

userRouter.delete(
    '/:id', 
    handleAsync(async(req, res, next) => {
        try {
            await userController.delete(req);
            res.status(200);
        } catch (err) {
            return next(err);
        }
    })
);

// userRouter.post('/logout', userController.logout);
// userRouter.get('/refreshToken', userController.refreshToken);
// userRouter.post('/update', userController.updateUser);
// userRouter.post('/change-pass', userController.changeUserPassword);
// userRouter.post('/avatar', userController.uploadAvatar);
// userRouter.post('/resetPassword', userController.resetPassword);
// userRouter.post('/reset-link/:link', userController.resetPassword);

export default userRouter;