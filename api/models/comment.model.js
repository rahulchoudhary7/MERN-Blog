import mongoose from 'mongoose'

const commentSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },

        postId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },

        likes: {
            type: [],
            default: [],
        },

        numberOfLikes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
)

const Comment = mongoose.model('Comments', commentSchema)

export default Comment
