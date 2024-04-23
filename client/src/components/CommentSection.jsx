import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Button, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import Comment from './Comment.jsx'

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const [comments, setComments] = useState(null)

    console.log(comments)

    useEffect(() => {
        setError(null)
        async function fetchComments() {
            try {
                const res = await fetch(`/api/comments/getcomments/${postId}`, {
                    method: 'GET',
                })

                const data = await res.json()

                if (res.ok) {
                    setComments(data)

                }
            } catch (error) {
                setError('Error loading comments')
            }
        }
        fetchComments()
    }, [postId])

    const handleSubmit = async e => {
        e.preventDefault()

        if (comment.length > 200) {
            return
        }
        setError(null)
        try {
            const res = await fetch('/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/JSON',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setComment('')
                setError(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setError('Could not post comment')
        }
    }
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 margin-5 text-gray-500'>
                    <p>Signed in as: </p>
                    <img
                        src={currentUser.profilePicture}
                        alt={currentUser.username}
                        className='h-5 w-5 object-cover rounded-full'
                    />
                    <Link
                        to={'/dashboard?tab=profile'}
                        className='text-s text-cyan-600 hover:underline'
                    >
                        {currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    Sign in for add a Comment 👉
                    <Link
                        to={'/signin'}
                        className='text-blue-500 hover:underline'
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {currentUser && (
                <>
                    <form
                        className='border border-teal-500 rounded-md p-3 mt-3 '
                        onSubmit={handleSubmit}
                    >
                        <Textarea
                            placeholder='Add a comment..'
                            rows={'3'}
                            maxLength={'200'}
                            onChange={e => setComment(e.target.value)}
                            value={comment}
                            className='resize-none'
                        />
                        <div className='flex w-full justify-between'>
                            <p className='text-gray-500 text-sm'>
                                {200 - comment.length} characters remaining
                            </p>
                            <Button
                                outline
                                gradientDuoTone={'purpleToBlue'}
                                type='submit'
                                className='mt-2'
                                disabled={!comment}
                            >
                                Comment
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <Alert color={'failure'} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {!comments ? (
                        <p className='text-sm my-5'>No comments yet</p>
                    ) : (
                        <>
                            <div className='text-sm my-5 flex items-center gap-1'>
                                <p>Comments</p>

                                <div className='border border-gray-400 px-2 py-1 rounded-sm'>
                                    <p>{comments.length}</p>
                                </div>
                            </div>

                            {comments.map(comment => (
                                <Comment key={comment._id} comment={comment} />
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}
