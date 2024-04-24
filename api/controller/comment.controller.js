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

    res.status(200).json(comments)
})

export const likeComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
        return next(errorHandler(404, 'Comment Not Found'))
    }

    const userIndex = comment.likes.indexOf(req.user.id)

    if (userIndex === -1) {
        comment.numberOfLikes += 1
        comment.likes.push(req.user.id)
    } else {
        comment.numberOfLikes -= 1
        comment.likes.splice(userIndex, 1)
    }

    await comment.save()

    res.status(200).json(comment)
})

export const editComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        return next(errorHandler(404, 'Comment Not Found'))
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
            content: req.body.content,
        },
        { new: true },
    )

    res.status(200).json(updatedComment)
})
