import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config({ path: '../.env' })

try {
    await mongoose.connect(process.env.MONGO_STRING)
    console.log('database connected')
} catch (error) {
    console.log(error)
}

const __dirname = path.resolve()

const app = express()
app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
    console.log('Server is running on port 3000!!')
})
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://nomadsnexus.onrender.com/',
        ],
        credentials: true,
    }),
)

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comments', commentRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500

    const message = err.message || 'Internal server error'

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
