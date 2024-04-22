import { Alert, Button, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

export default function PostPage() {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [post, setPost] = useState(null)

    const { currentUser } = useSelector(state => state.user)

    console.log(post)

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
                    <span className='italic'>{post && (post.content.length/1000).toFixed(0)} min read</span>
                </div>
                <div className="p-3 max-w-6xl mx-auto post-content" dangerouslySetInnerHTML={{__html: post && post.content}}></div>
            </main>
        </>
    )
}
