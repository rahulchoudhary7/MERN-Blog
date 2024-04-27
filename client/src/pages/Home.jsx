import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'


export default function Home() {
    const [posts, setPosts] = useState([])

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
                <div className='flex flex-col gap-6 px-4 p-28 pb-5 max-w-6xl mx-auto'>
                    <h1 className='text-3xl font-bold lg:text-6xl'>
                        Welcome to my Blog!
                    </h1>
                    <p className='text-gray-500 text-xs sm:text-sm'>
                        Welcome to our tech blog hub! 🚀 Get ready to dive into
                        the digital universe where we decode the latest trends,
                        untangle complex concepts, and ignite your tech passion!
                        From coding conundrums to AI adventures, we&apos;ve got your
                        back. Join us for a thrilling ride through bytes and
                        beyond. Let&apos;s geek out together! Welcome aboard!
                    </p>
                    <Link
                        to={'/search'}
                        className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
                    >
                        View all posts
                    </Link>
                </div>

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
