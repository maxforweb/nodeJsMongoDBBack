import { Router } from "express";

import {UserController, AdsController, CalendarNotesController} from '../controllers';

const router = Router();

const User = new UserController;
const Ad = new AdsController;
const CalendarNote = new CalendarNotesController;

router.get( '/user/:email', User.findUserByEmail );
router.delete( '/user/:id', User.delete );
router.post( '/user/create', User.registrateUser );
router.post( '/user/login', User.loginUser );
router.get( '/user', User.getAll );
router.get( '/activate/:link', User.activateUser );
router.post( '/user/logout', User.logout );
router.get( '/refreshToken', User.refreshToken );
router.post( '/user/update', User.updateUser );
router.post( '/user/change-pass', User.changeUserPassword );
router.post( '/user/avatar', User.uploadAvatar );
router.post( '/user/resetPassword', User.resetPassword );
router.post( '/reset-link/:link', User.resetPassword );

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