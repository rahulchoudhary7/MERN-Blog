import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createpost, deletepost, getposts, updatepost } from '../controller/post.controller.js';

const router = express.Router();

router.post('/createpost', verifyToken, createpost)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId',verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
export default router;