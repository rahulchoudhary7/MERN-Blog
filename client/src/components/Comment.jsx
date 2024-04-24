import { useEffect, useState } from 'react'
import moment from 'moment'
import { GoHeartFill } from 'react-icons/go'
import { useSelector } from 'react-redux'

export default function Comment({ comment, onLike }) {
    const [user, setUser] = useState({})
    const [error, setError] = useState(null)

    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)

                const data = await res.json()

                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                setError(error)
            }
        }

        fetchUser()
    }, [comment])
    return (
        <div className='flex p-4 text-sm'>
            <div className='flex-shrink-0 mr-2'>
                <img
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-10 h-10 rounded-full bg-gray-200'
                />
            </div>

            <div className='flex-1'>
                <div className='flex items-center'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? user.username : 'deleted user'}
                    </span>

                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className='text-gray-700 dark:text-gray-400 mb-1'>
                    {comment.content}
                </p>

                <div className='flex gap-1 items-center text-xs'>
                    <button
                        className={`text-gray-400 hover:text-pink-500 ${
                            currentUser &&
                            comment.likes.includes(currentUser._id) &&
                            '!text-red-500'
                        }`}
                        onClick={() => onLike(comment._id)}
                    >
                        <GoHeartFill className='' />
                    </button>
                    <p className='text-gray-400 '>{comment.numberOfLikes>0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes===1 ? 'like' : 'likes')}</p>
                </div>
            </div>
        </div>
    )
}
