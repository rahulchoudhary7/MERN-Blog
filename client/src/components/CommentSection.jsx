import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import Comment from './Comment.jsx'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const [comments, setComments] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)

    const navigate = useNavigate()

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

    const handleLike = async commentId => {
        setError(null)
        try {
            if (!currentUser) {
                navigate('/signin')
                return
            }

            const res = await fetch(`/api/comments/likeComment/${commentId}`, {
                method: 'PUT',
            })

            if (res.ok) {
                setError(null)
                const data = await res.json()
                setComments(
                    comments.map(comment => {
                        return comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  numberOfLikes: data.likes.length,
                              }
                            : comment
                    }),
                )
            }
            console.log(comments)
        } catch (error) {
            setError(error.message)
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map(c => {
                return c._id === comment._id
                    ? { ...c, content: editedContent }
                    : c
            }),
        )
    }

    const handleDelete = async commentId => {
        setError(null)
        setShowModal(false)

        try {
            if (!currentUser) {
                navigate('/signin')
                return
            }

            const res = await fetch(
                `/api/comments/deleteComment/${commentId}`,
                {
                    method: 'DELETE',
                },
            )

            if (res.ok) {
                setError(null)
                const data = await res.json()

                setComments(
                    comments.filter(comment => comment._id !== commentId),
                )
            }
        } catch (error) {
            setError(error.message)
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
                    Sign in see or add comments 👉
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
                                <p className='font-medium'>Comments</p>

                                <div className='border border-gray-400 px-2 py-1 rounded-sm'>
                                    <p>{comments.length}</p>
                                </div>
                            </div>

                            {comments.map(comment => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onLike={handleLike}
                                    onEdit={handleEdit}
                                    onDelete={commentId => {
                                        setShowModal(true)
                                        setCommentToDelete(commentId)
                                    }}
                                />
                            ))}
                        </>
                    )}
                </>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size={'md'}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 color-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>

                        <div className='flex justify-center gap-7'>
                            <Button
                                color={'failure'}
                                onClick={() => handleDelete(commentToDelete)}
                            >
                                Yes, Delete
                            </Button>
                            <Button
                                color={'gray'}
                                onClick={() => setShowModal(false)}
                            >
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

        
    )
}
