import { useEffect, useState } from 'react'
import moment from 'moment'
import { GoHeartFill } from 'react-icons/go'
import { useSelector } from 'react-redux'
import { Alert, Textarea } from 'flowbite-react'
import { Button } from 'flowbite-react'

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({})
    const [error, setError] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)

    const { currentUser } = useSelector(state => state.user)

    console.log(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)

                

                if(res.status===404){
                    setUser(null)
                }else if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                }
                
            } catch (error) {
                setUser(null)
                setError(error)
                return
            }
        }

        fetchUser()
    }, [comment])

    const handleEdit = async commentId => {
        setIsEditing(true)
        setEditedContent(comment.content)
    }

    const handleSave = async () => {
        try {
            console.log('start edititng')
            const res = await fetch(
                `/api/comments/editComment/${comment._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editedContent,
                    }),
                },
            )

            if (res.ok) {
                setError(null)
                setIsEditing(false)
                onEdit(comment, editedContent)
            }
        } catch (error) {
            console.log('gadbad hai')
            console.log(error.message)
            setError(error.message)
        }
    }

    return (
        <div className='flex p-4 text-sm'>
            <div className='flex-shrink-0 mr-2'>
                <img
                    src={user ? user.profilePicture : ''}
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
                {isEditing ? (
                    <>
                        <Textarea
                            maxLength={'200'}
                            onChange={e => setEditedContent(e.target.value)}
                            value={editedContent}
                            className='resize-none mb-2'
                        />
                        <div className='flex justify-end gap-2 text-xs'>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                type='button'
                                size={'sm'}
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
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
                            <p className='text-gray-400 '>
                                {comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes +
                                        ' ' +
                                        (comment.numberOfLikes === 1
                                            ? 'like'
                                            : 'likes')}
                            </p>
                            {currentUser &&
                                currentUser._id === comment.userId && (
                                    <div className='flex gap-2 ml-1 font-medium'>
                                        <span
                                            className='text-gray-500 hover:text-blue-500 hover:cursor-pointer'
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </span>
                                        <span
                                            className='text-gray-500 hover:text-red-500 hover:cursor-pointer'
                                            onClick={() =>
                                                onDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </span>
                                    </div>
                                )}
                            {currentUser._id !== comment.userId &&
                                currentUser.isAdmin && (
                                    <div className='flex gap-2 ml-1 font-medium'>
                                        <span
                                            className='text-gray-500 hover:text-red-500 hover:cursor-pointer'
                                            onClick={() =>
                                                onDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </span>
                                    </div>
                                )}
                        </div>
                    </>
                )}
            </div>

            {error && <Alert color={'failure'}>{error}</Alert>}
        </div>
    )
}
