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
