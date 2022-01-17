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

router.get( '/ads/:id', Ad.index );
router.get( '/ads', Ad.getAll );
router.delete( '/ads/:id', Ad.delete);
router.post( '/ads/create', Ad.create );
router.post( '/ads/update/:id', Ad.update );

router.get ('/calendar-note/getAll', CalendarNote.getAll );
router.delete ('/calendar-note/deleteNote/:id', CalendarNote.deleteNote );
router.post ('/calendar-note/editNote/', CalendarNote.editNote );
router.post ('/calendar-note/createNote/', CalendarNote.createNote );

export default router;