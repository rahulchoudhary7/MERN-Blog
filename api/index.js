import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'

dotenv.config({ path: '../.env' })

try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("hhiuyiuyiuhkjhkjhk")
} catch (error) {
    console.log(error);
}

const app = express()

app.listen(3000, () => {
  console.log('Server is running on port 3000!!')
})

app.use('/api/user', userRoutes);
