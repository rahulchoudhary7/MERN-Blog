import { Alert, Button, Modal, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function PostPage() {
    const { currentUser } = useSelector(state => state.user)
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)

                const data = await res.json()
                console.log(data)

                if (!res.ok) {
                    setError('Error fetching the post')
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(null)
                }
            } catch (error) {
                setError('Error fetching the post')
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=3`)

                const data = await res.json()

                if (res.ok) {
                    setRecentPosts(data.posts)
                    setError(null)
                }
            } catch (error) {
                setError(error)
            }
        }
        fetchRecentPosts()
    }, [])

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
    const formattedDate = `${date.getDate()} ${
        months[date.getMonth()]
    } ${String(date.getFullYear()).slice(2)}`

    const handleDelete = async () => {
        setShowModal(false)
        setError(null)
        try {
            const res = await fetch(
                `/api/post/deletepost/${post._id}/${currentUser._id}`,
                {
                    method: 'DELETE',
                },
            )
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
            } else {
               navigate('/search')
            }
        } catch (error) {
            setError(null)
        }
    }

    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size={'xl'} />
            </div>
        )
    return (
        <>
            {error && (
                <Alert
                    color={'failure'}
                    className='mt-4'
                    onDismiss={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
            <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
                <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
                    {post && post.title}
                </h1>
                <div className=''>
                    {post && currentUser && currentUser._id === post.userId && (
                        <div className='w-full flex justify-center gap-2'>
                            <Link to={`/update-post/${post._id}`}>
                                <Button
                                    className='text-md rounded-full'
                                    color={'blue'}
                                    size={'sm'}
                                >
                                    Edit Post
                                </Button>
                            </Link>
                            <Button
                                    className='text-md rounded-full'
                                    color={'red'}
                                    size={'sm'}
                                    type='button'
                                    onClick={()=>setShowModal(true)}
                                >
                                    Delete Post
                                </Button>
                            
                        </div>
                    )}
                </div>
                <Link
                    className='self-center mt-5'
                    to={`/search?category=${post && post.category}`}
                >
                    <Button color={'gray'} pill size={'xs'}>
                        {post && post.category}
                    </Button>
                </Link>
                <img
                    src={post && post.image}
                    alt={post && post.title}
                    className='mt-10 p-3 max-h-[600px] w-full object-cover'
                />
                <div className='flex justify-between border-b border-slate-500 mx-auto w-full max-w-6xl text-sm p-3'>
                    <span>{post && formattedDate}</span>
                    <span className='italic'>
                        {post && (post.content.length / 1000).toFixed(0)} min
                        read
                    </span>
                </div>
                <div
                    className='p-3 max-w-6xl mx-auto post-content'
                    dangerouslySetInnerHTML={{ __html: post && post.content }}
                ></div>

                <div className='max-w-6xl mx-auto w-full'>
                    <CallToAction />
                </div>
                <CommentSection postId={post && post._id} />
                <div className='flex flex-col justify-center items-center mb-5 border-t-2'>
                    <h1 className='text-xl mt-5'>Recent articles</h1>
                    <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                        {recentPosts &&
                            recentPosts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                    </div>
                </div>
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
                                <Button
                                    color={'failure'}
                                    onClick={handleDelete}
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
            </main>
        </>
    )
}
