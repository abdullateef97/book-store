import express from 'express';
import { authenticateClient } from '../utils/authenticate';
import * as userController from '../controllers/user';

const router = express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/', authenticateClient(), userController.getUserDetails);

export default router;
