import express from 'express'
import { deleteUser, getUser,  getusers,  signout,  updateUser } from '../controller/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.get('/test', getUser)

router.put('/update/:userId', verifyToken, updateUser)

router.delete('/delete/:userId', verifyToken, deleteUser)

router.post('/signout', signout)

router.get('/getusers', verifyToken, getusers)

export default router
