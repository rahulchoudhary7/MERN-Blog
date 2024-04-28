import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers } from 'react-icons/fa'
import { MdKeyboardDoubleArrowUp } from 'react-icons/md'
import { FaCommentDots } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'
import { Alert, Button, Spinner, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardComp() {
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const fetchUsers = async () => {
            setError(null)
            setLoading(true)
            try {
                const res = await fetch('/api/user/getusers?limit=5')
                const data = await res.json()

                if (res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        const fetchPosts = async () => {
            setError(null)
            setLoading(true)
            try {
                const res = await fetch(`/api/post/getposts?limit=5`)
                const data = await res.json()

                if (res.ok) {
                    setPosts(data.posts)
                    setLastMonthPosts(data.lastMonthPosts)
                    setTotalPosts(data.totalPosts)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        const fetchComments = async () => {
            setError(null)
            setLoading(true)
            try {
                const res = await fetch('/api/comments/getComments')
                const data = await res.json()

                if (res.ok) {
                    setComments(data.comments)
                    setLastMonthComments(data.lastMonthComments)
                    setTotalComments(data.totalComments)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser._id])
    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen w-full'>
                <Spinner size={'xl'} />
            </div>
        )
    return (
        <>
            <div className='p-3 md:mx-auto'>
                {error && (
                    <Alert
                        color={'failure'}
                        className='my-5 max-w-2xl mx-auto'
                        onDismiss={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
                <div className='flex-wrap flex gap-4 justify-center'>
                    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                        <div className='flex justify-between'>
                            <div className=''>
                                <h3 className='text-gray-500 text-md uppercase'>
                                    Total Users
                                </h3>
                                <p className='text-2xl'>{totalUsers}</p>
                            </div>
                            <FaUsers className='bg-teal-500 text-white rounded-full text-5xl p-2 shadow-lg' />
                        </div>
                        <div className='flex gap-2 text-sm'>
                            <span className='text-green-500 flex items-center'>
                                <MdKeyboardDoubleArrowUp />
                                {lastMonthUsers}
                            </span>
                            <span className='gray-500'>Last Month</span>
                        </div>
                    </div>

                    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                        <div className='flex justify-between'>
                            <div className=''>
                                <h3 className='text-gray-500 text-md uppercase'>
                                    Total Comments
                                </h3>
                                <p className='text-2xl'>{totalComments}</p>
                            </div>
                            <FaCommentDots className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                        </div>
                        <div className='flex gap-2 text-sm'>
                            <span className='text-green-500 flex items-center'>
                                <MdKeyboardDoubleArrowUp />
                                {lastMonthComments}
                            </span>
                            <span className='gray-500'>Last Month</span>
                        </div>
                    </div>

                    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                        <div className='flex justify-between'>
                            <div className=''>
                                <h3 className='text-gray-500 text-md uppercase'>
                                    Total Posts
                                </h3>
                                <p className='text-2xl'>{totalPosts}</p>
                            </div>
                            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-2 shadow-lg' />
                        </div>
                        <div className='flex gap-2 text-sm'>
                            <span className='text-green-500 flex items-center'>
                                <MdKeyboardDoubleArrowUp />
                                {lastMonthPosts}
                            </span>
                            <span className='gray-500'>Last Month</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
                    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3'>
                        <div className='flex justify-between p-3 text-sm font-semibold'>
                            <h1 className='text-center p-2'>Recent Users</h1>
                            <div className='text-xs'>
                                <Button outline color={'blue'} pill size={'xs'}>
                                    <Link to={'/dashboard?tab=users'}>
                                        See All
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>User image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                            </Table.Head>

                            {users &&
                                users.map(user => (
                                    <Table.Body
                                        key={user._id}
                                        className='divide-y'
                                    >
                                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                            <Table.Cell>
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user.username}
                                                    className='h-10 w-10 rounded-full mx-auto bg-gray-500'
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span>{user.username}</span>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))}
                        </Table>
                    </div>
                    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3'>
                        <div className='flex justify-between p-3 font-semibold'>
                            <h1 className='text-center p-2 text-sm'>
                                Recent comments
                            </h1>
                            <div className='text-xs'>
                                <Button outline color={'blue'} pill size={'xs'}>
                                    <Link to={'/dashboard?tab=comments'}>
                                        See all
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Comment</Table.HeadCell>
                                <Table.HeadCell>Likes</Table.HeadCell>
                            </Table.Head>

                            {comments &&
                                comments.map(comment => (
                                    <Table.Body
                                        key={comment._id}
                                        className='divide-y'
                                    >
                                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                            <Table.Cell className='w-96'>
                                                <span>{comment.content}</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span>
                                                    {comment.numberOfLikes}
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))}
                        </Table>
                    </div>
                    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3'>
                        <div className='flex justify-between p-3 text-sm font-semibold'>
                            <h1 className='text-center p-2'>Recent posts</h1>
                            <div className='text-xs'>
                                <Button outline color={'blue'} pill size={'xs'}>
                                    <Link to={'/dashboard?tab=users'}>
                                        See all
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Post cover</Table.HeadCell>
                                <Table.HeadCell>Post title</Table.HeadCell>
                            </Table.Head>

                            {posts &&
                                posts.map(post => (
                                    <Table.Body
                                        key={post._id}
                                        className='divide-y'
                                    >
                                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                            <Table.Cell>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className='w-16 h-10 rounded-md mx-auto bg-gray-500 object-cover'
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span>{post.title}</span>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))}
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}
