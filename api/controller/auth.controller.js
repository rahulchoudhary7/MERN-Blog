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
    next(errorHandler(400, 'All fields are required!'))
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
  const {password: pass, ...rest} = validUser._doc;
  const token = jwt.sign(
    {
      id: validUser._id,
    },
    process.env.JWT_SECRET,
  )

  res.status(200).cookie('accessToken', token, {
    httpOnly: true,
  }).json(rest);
})
