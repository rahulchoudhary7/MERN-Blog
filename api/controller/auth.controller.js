import User from '../models/user.model.js'
import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

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

    next(errorHandler(400, "All fields are required!"));
    
  }
  const hashPassword = bcryptjs.hashSync(password, 10)
  const newUser = new User({ username, email, password:hashPassword })

  await newUser.save();

  res.json("Signup Successful")
})
