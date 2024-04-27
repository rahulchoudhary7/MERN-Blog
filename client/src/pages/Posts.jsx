import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'
function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    useEffect(()=>{
        const fetchPosts = async () => {
            setLoading(true)
            const res = await fetch(`/api/post/getposts`)
            if (!res.ok) {
                setLoading(false)
                return
            }
            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)
                if (data.posts.length >9) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
            }
        }
        fetchPosts()
    },[])

    const handleShowMore = async () => {
        const numberOfPosts = posts.length
        const startIndex = numberOfPosts
        const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`)
        if (!res.ok) {
            return
        }
        if (res.ok) {
            const data = await res.json()
            console.log(data);
            setPosts([...posts, ...data.posts])
            if (data.posts.length === 9) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }
        }
    }


    return (
        <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 text-center'>
                    Recent Posts
                </h1>
                <div className='p-7 flex flex-wrap gap-4 justify-center'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && (
                        <p className='text-xl text-gray-500'>Loading...</p>
                    )}
                    {!loading &&
                        posts &&
                        posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
    )
}

export default Posts
