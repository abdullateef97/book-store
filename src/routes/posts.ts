import express from 'express';
import { authenticateClient } from '../utils/authenticate';
import * as postController from '../controllers/post';

const router = express.Router();
router.use(authenticateClient());

router.post('/', postController.createPost);
router.get('/:post_id', postController.getPostDetails);
router.get('/', postController.getPosts);
router.post('/:post_id/comment', postController.addCommentToPost);

export default router;
