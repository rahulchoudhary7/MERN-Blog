import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { useDispatch, useSelector } from 'react-redux'
import { Banner, Toast } from 'flowbite-react'
import { HiCheck, HiX } from 'react-icons/hi'
import { alertDone } from '../redux/user/userSlice'
import { FaFaceSmileWink } from 'react-icons/fa6'

export default function Home() {
    const [posts, setPosts] = useState([])
    const [joke, setJoke] = useState(null)
    const { signoutMessage } = useSelector(state => state.user)
    const dispatch = useDispatch()
    console.log(joke)

    useEffect(() => {
        const fetchJoke = async () => {
            try {
                const res = await fetch(
                    'https://official-joke-api.appspot.com/jokes/random',
                )

                if (res.ok) {
                    const data = await res.json()
                    setJoke(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchJoke()
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=9`)
                const data = await res.json()

                if (res.ok) {
                    setPosts(data.posts)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchPosts()
    }, [])
    return (
        <>
            <div className=''>
                {signoutMessage && (
                    <Toast className='mx-auto mt-10'>
                        <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
                            <HiCheck className='h-5 w-5' />
                        </div>
                        <div className='ml-3 text-sm font-normal'>
                            {signoutMessage}
                        </div>
                        <Toast.Toggle onDismiss={() => dispatch(alertDone())} />
                    </Toast>
                )}

                <div className='flex flex-col gap-6 px-4 p-28 pb-5 max-w-6xl mx-auto'>
                    <h1 className='text-3xl font-bold lg:text-6xl'>
                        Welcome to my Blog!
                    </h1>
                    <p className='text-gray-500 text-sm sm:text-md'>
                        Welcome to our blog hub! 🚀 Get ready to explore a
                        diverse universe where we delve into personal
                        reflections, tantalizing culinary adventures,
                        cutting-edge tech insights, exhilarating travel
                        experiences, and vibrant lifestyle inspirations! Whether
                        you're seeking heartfelt stories, mouthwatering recipes,
                        the latest gadgets, wanderlust-worthy destinations, or
                        tips for living your best life, you&apos;re in the right
                        place. Join us for a captivating journey through the
                        realms of personal growth, gastronomic delights,
                        technological innovations, globetrotting adventures, and
                        everyday inspiration. Let&apos;s embark on this enriching
                        voyage together! Welcome aboard!
                    </p>
                    <Link
                        to={'/posts'}
                        className='text-xs sm:text-sm text-teal-500 font-bold hover:text-teal-400'
                    >
                        View all posts
                    </Link>
                </div>
                {joke && (
                    <Banner className='my-10'>
                        <h2 className='text-center text-md font-medium p-1'>
                            Something to make you laugh 😁
                        </h2>
                        <div className='flex max-w-2xl w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 mx-auto rounded-full'>
                            <div className='mx-auto flex items-center'>
                                <p className='flex flex-col items-center text-sm font-normal text-gray-700 dark:text-gray-400'>
                                    <span className='[&_p]:inline text-center'>
                                        {joke.setup}
                                    </span>
                                    <span className='[&_p]:inline text-center'>
                                        {joke.punchline} 😂
                                    </span>
                                </p>
                            </div>
                            <Banner.CollapseButton
                                color='gray'
                                className='border-0 bg-transparent text-gray-500 dark:text-gray-400'
                            >
                                <HiX className='h-4 w-4' />
                            </Banner.CollapseButton>
                        </div>
                    </Banner>
                )}

                <div className='p-10 bg-amber-100 dark:bg-slate-800'>
                    <CallToAction />
                </div>

                <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                    {posts && posts.length > 0 && (
                        <div className='flex flex-col gap-8 items-center'>
                            <h2 className='text-2xl font-semibold text-center'>
                                Recent posts
                            </h2>
                            <div className='flex flex-wrap gap-4 justify-center'>
                                {posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                            <Link
                                to={'/search'}
                                className='text-lg text-center text-teal-500 font-bold hover:underline'
                            >
                                View all posts
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
