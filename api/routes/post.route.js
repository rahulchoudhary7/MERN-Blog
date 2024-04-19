import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createpost, deletepost, getposts } from '../controller/post.controller.js';

const router = express.Router();

router.post('/createpost', verifyToken, createpost)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId',verifyToken, deletepost)
export default router;