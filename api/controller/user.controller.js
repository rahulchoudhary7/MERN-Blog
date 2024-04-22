import asyncHandler from 'express-async-handler'
import { errorHandler } from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'

export const getUser = (req, res) => {
    res.json({
        message: 'API is working',
    })
}

export const updateUser = asyncHandler(async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not authorized'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(
                errorHandler(400, 'Password must be at least 6 characters'),
            )
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 3 || req.body.username.length > 20) {
            return next(
                errorHandler(
                    400,
                    'Username must be between 3 to 20 characters',
                ),
            )
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username can not contain spaces'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username can not contain spaces'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(
                    400,
                    'Username can only contains letters and numbers',
                ),
            )
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        },
        { new: true },
    )

    const { password, ...rest } = updatedUser._doc
    res.status(200).json(rest)
})

export const deleteUser = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not authorized'))
    }

    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json('User has been deleted')
})

export const signout = asyncHandler(async (req, res, next) => {
    res.clearCookie('accessToken').status(200).json('Signed out successfully')
})

export const getusers = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Forbidden, Not allowed'))
    }

    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9

    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)

    const usersWithoutPassword = users.map(user => {
        const { password, ...rest } = user._doc
        return rest
    })

    const totalUsers = await User.countDocuments()

    const now = new Date()

    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
    )

    const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
    })
})
