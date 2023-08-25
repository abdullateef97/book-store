import express from 'express';
import { authenticateAdmin } from '../utils/authenticate';
import * as userController from '../controllers/user';

const router = express.Router();
router.use(authenticateAdmin());

router.get('/users', userController.getUserList);

export default router;
