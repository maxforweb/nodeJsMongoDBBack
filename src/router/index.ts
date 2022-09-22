import { Router } from "express";

import {UserController, AdsController, CalendarNotesController} from '../controllers';

const router = Router();

const userController = new UserController;
const Ad = new AdsController;
const CalendarNote = new CalendarNotesController;

router.get( '/user/:email', userController.findUserByEmail );
router.delete( '/user/:id', userController.delete );
router.post( '/user/create', userController.registrateUser );
router.post( '/user/login', userController.loginUser );
router.get( '/user', userController.getAll );
router.get( '/activate/:link', userController.activateUser );
router.post( '/user/logout', userController.logout );
router.get( '/refreshToken', userController.refreshToken );
router.post( '/user/update', userController.updateUser );
router.post( '/user/change-pass', userController.changeUserPassword );
router.post( '/user/avatar', userController.uploadAvatar );
router.post( '/user/resetPassword', userController.resetPassword );
router.post( '/reset-link/:link', userController.resetPassword );

router.get( '/posts/:id', Ad.index );
router.get( '/posts', Ad.getAll );
router.delete( '/posts/:id', Ad.delete);
router.post( '/posts/create', Ad.create );
router.post( '/posts/update/:id', Ad.update );

router.get ('/calendar-note/getAll', CalendarNote.getAll );
router.delete ('/calendar-note/deleteNote/:id', CalendarNote.deleteNote );
router.post ('/calendar-note/editNote/', CalendarNote.editNote );
router.post ('/calendar-note/createNote/', CalendarNote.createNote );

export default router;