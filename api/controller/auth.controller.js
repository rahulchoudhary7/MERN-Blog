import User from '../models/user.model.js'
import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body

    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
    ) {
        return next(errorHandler(400, 'All fields are required!'))
    }
    const hashPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashPassword })

    await newUser.save()

    res.json('Signup Successful')
})

export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === null || password === null) {
        next(errorHandler(400, 'All fields are required'))
    }

    const validUser = await User.findOne({ email })

    if (!validUser) {
        return next(errorHandler(404, 'Email or Password not correct'))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
                                                                                                                                                                                                    
    if (!validPassword) {
        return next(errorHandler(400, 'Email or Password not correct'))
    }
    //separating password from the rest of the validUser object
    const { password: pass, ...rest } = validUser._doc
    const token = jwt.sign(
        {
            id: validUser._id,
            isAdmin: validUser.isAdmin,
        },
        process.env.JWT_SECRET,
    )

    res.cookie('accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
        .status(200)
        .json(rest)
})

export const google = asyncHandler(async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body

    const user = await User.findOne({ email })

    if (user) {
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
        )
        const { password, ...rest } = user._doc
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
            .status(200)
            .json(rest)
    } else {
        const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8)
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

        const newUser = new User({
            username:
                name.toLowerCase().split(' ').join('') +
                Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture: googlePhotoUrl,
        })

        await newUser.save()
        const token = jwt.sign(
            { id: newUser._id, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
        )
        const { password, ...rest } = newUser._doc
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
            .status(200)
            .json(rest)
    }
})
