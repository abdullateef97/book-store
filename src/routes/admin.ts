import express from 'express';
import { authenticateAdmin } from '../utils/authenticate';
import * as userController from '../controllers/user';

const router = express.Router();

router.get('/users', authenticateAdmin(), userController.getUserList);
router.get('/performance', userController.performanceChallenge);

export default router;
