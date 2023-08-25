import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import userRoutes from './users';
import postRoutes from './posts';
import adminRoutes from './admin';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/admin', adminRoutes);

export default router;
