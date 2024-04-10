import User from '../models/user.model.js'
import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    return res.status(400).json({
      message: 'All fields are required',
    })
  }
  const hashPassword = bcryptjs.hashSync(password, 10)
  const newUser = new User({ username, email, hashPassword })

  await newUser.save();

  res.json({
    message: 'signup successfull',
  })
})
