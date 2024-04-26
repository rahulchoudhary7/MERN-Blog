import express from 'express';
import {verifyToken} from '../utils/verifyUser.js'
import { createComment, getPostComments, getAllComments, likeComment, editComment, deleteComment } from '../controller/comment.controller.js';


const router = express.Router();


router.post('/create',verifyToken, createComment)
router.get('/getcomments/:postId', getPostComments )
router.get('/getcomments', verifyToken, getAllComments )
router.put('/likeComment/:commentId', verifyToken, likeComment)
router.put('/editComment/:commentId', verifyToken, editComment)
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)
export default router;