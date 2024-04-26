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

export const getAllComments = asyncHandler(async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(403, 'Not authorized')
    }
    const startIndex = parseInt(req.query.startIndex) || 0

    const limit = parseInt(req.query.limit) || 9

    const sortDirection = req.query.sort === 'desc' ? -1 : 1

    const comments = await Comment.find()
        .sort({
            createdAt: sortDirection,
        })
        .skip(startIndex)
        .limit(limit)

    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
    )

    const lastMonthComments = await Comment.countDocuments({
        createdAt:{
            $gte:oneMonthAgo}
        }
    )

    res.status(200).json({comments, totalComments, lastMonthComments})
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

export const deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
        next(errorHandler(404, 'Comment not found'))
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(errorHandler(403, 'Not allowed to delete the comment'))
    }
    await Comment.findByIdAndDelete(comment._id)

    res.status(200).json('Comment deleted successfully')
})
