import { Alert, Button, Modal, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { MdAutoDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'

export default function DashComments() {
    const { currentUser } = useSelector(state => state.user)
    const [comments, setComments] = useState(null)
    const [showmore, setShowmore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentIdtoDelete, setCommentIdToDelete] = useState(null)
    const [error, setError] = useState(null)

    console.log(comments)

    useEffect(() => {
        const fetchCommets = async () => {
            setError(null)
            try {
                const res = await fetch('/api/comments/getComments')
                const data = await res.json()

                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowmore(false)
                    }
                }
            } catch (error) {
                setError(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchCommets()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = comments.length
        setError(null)
        try {
            const res = await fetch(
                `/api/comments/getComments?startIndex=${startIndex}`,
            )

            const data = await res.json()

            if (res.ok) {
                setComments(prev => [...prev, ...data.comments])

                if (data.comments.length < 9) {
                    setShowmore(false)
                }
            }
        } catch (error) {
            setError(null)
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false)
        setError(null)
        try {
            const res = await fetch(
                `/api/comments/deleteComment/${commentIdtoDelete}`,
                {
                    method: 'DELETE',
                },
            )
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
            } else {
                setComments(prev =>
                    prev.filter(user => user._id !== commentIdtoDelete),
                )
            }
            setCommentIdToDelete(null)
        } catch (error) {
            setError(null)
        }
    }

    const formattedDate = user => {
        const date = new Date(user && user.updatedAt)
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        return `${date.getDate()} ${months[date.getMonth()]} ${String(
            date.getFullYear(),
        ).slice(2)}`
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbarr-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-gray-500'>
            {currentUser.isAdmin && comments && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Comment</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell>Post ID</Table.HeadCell>
                            <Table.HeadCell>User ID</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {comments.map(comment => (
                            <Table.Body key={comment._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {formattedDate(comment)}
                                    </Table.Cell>
                                    <Table.Cell className='font-medium teext-gray-900 dark:text-gray-200'>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell >
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <MdAutoDelete
                                            className='mx-auto hover:text-red-500 hover:cursor-pointer'
                                            onClick={() => {
                                                setShowModal(true)
                                                setCommentIdToDelete(
                                                    comment._id,
                                                )
                                            }}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showmore && (
                        <button
                            className='w-full text-teal-500 self-center text-sm py-7'
                            onClick={handleShowMore}
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No Comments available</p>
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
                                onClick={handleDeleteComment}
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
            {error && (
                <Alert color={'danger'} className='mt-4'>
                    {error.message}
                </Alert>
            )}
        </div>
    )
}
