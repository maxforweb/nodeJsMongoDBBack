import { Router } from "express";

import {UserController, AdsController} from '../controllers';

const router = Router();

const User = new UserController;
const Ad = new AdsController;

router.get( '/user/:email', User.findUserByEmail );
router.delete( '/user/:id', User.delete );
router.post( '/user/create', User.registrateUser );
router.post( '/user/login', User.loginUser );
router.get( '/user', User.getAll );
router.get( '/activate/:link', User.activateUser );
router.post( '/user/logout', User.logout );

router.get( '/ads/:id', Ad.index );
router.get( '/ads', Ad.getAll );
router.delete( '/ads/:id', Ad.delete);
router.post( '/ads/create-ad', Ad.create );
router.post( '/ads/update/:id', Ad.update );


export default router;