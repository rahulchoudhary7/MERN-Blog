import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, Spinner, Table, Toast } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi'
import { MdAutoDelete } from 'react-icons/md'

export default function DashPosts() {
    const { currentUser } = useSelector(state => state.user)
    const [userPosts, setUserPosts] = useState([])
    const [showmore, setShowmore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [postIdtoDelete, setPostIdToDelete] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleted, setDeleted] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchPosts = async () => {
            setError(null)
            try {
                const res = await fetch(
                    `/api/post/getposts?userId=${currentUser._id}`,
                )
                const data = await res.json()

                if (res.ok) {
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowmore(false)
                    }
                    setLoading(false)
                }
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        if (currentUser.isAdmin) {
            fetchPosts()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = userPosts.length
        setError(null)
        try {
            setLoading(true)
            const res = await fetch(
                `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
            )

            const data = await res.json()

            if (res.ok) {
                setUserPosts(prev => [...prev, ...data.posts])

                if (data.posts.length < 9) {
                    setShowmore(false)
                }
                setLoading(false)
            }
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setShowModal(false)
        setError(null)
        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdtoDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                },
            )
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
            } else {
                setDeleted(true)
                setUserPosts(prev =>
                    prev.filter(post => post._id !== postIdtoDelete),
                )
            }
            setPostIdToDelete(null)
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    const formattedDate = post => {
        const date = new Date(post && post.updatedAt)
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

    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen w-full'>
                <Spinner size={'xl'} />
            </div>
        )
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbarr-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-gray-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    {deleted && (
                        <Toast className='mx-auto my-5'>
                            <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
                                <HiCheck className='h-5 w-5' />
                            </div>
                            <div className='ml-3 text-sm font-normal'>
                                Post deleted successfully
                            </div>
                            <Toast.Toggle onDismiss={() => setDeleted(false)} />
                        </Toast>
                    )}
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {userPosts.map(post => (
                            <Table.Body key={post._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {formattedDate(post)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            to={`/post/${post.slug}`}
                                            className='font-medium teext-gray-900 dark:text-gray-200'
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            {post.category}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <MdAutoDelete
                                            className='mx-auto hover:text-red-500 hover:cursor-pointer'
                                            onClick={() => {
                                                setShowModal(true)
                                                setPostIdToDelete(post._id)
                                            }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className=' font-medium hover:underline text-teal-500'>
                                                Edit
                                            </span>
                                        </Link>
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
                <p>No posts available</p>
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
                            Are you sure you want to delete this post?
                        </h3>

                        <div className='flex justify-center gap-7'>
                            <Button color={'failure'} onClick={handleDelete}>
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
