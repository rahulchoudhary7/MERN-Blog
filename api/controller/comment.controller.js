import asyncHandler from 'express-async-handler'
import { errorHandler } from '../utils/error.js'
import Comment from '../models/comment.model.js'

export const createComment = asyncHandler(async (req, res, next) => {
    const { content, postId, userId } = req.body

    if (userId !== req.user.id) {
        return next(
            errorHandler(403, 'You are not authorized to make this comment'),
        )
    }

    const newComment = new Comment({
        content,
        postId,
        userId,
    })

    await newComment.save()

    res.status(200).json(newComment)
})

export const getPostComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({
        postId: req.params.postId,
    }).sort({
        createdAt: -1,
    })

    res.status(200).json(comments);
})
