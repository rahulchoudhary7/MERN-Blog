import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, Table } from 'flowbite-react'
import { HiBadgeCheck } from 'react-icons/hi'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { MdAutoDelete } from 'react-icons/md'

export default function DashUsers() {
    const { currentUser } = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [showmore, setShowmore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [userIdtoDelete, setUserIdToDelete] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setError(null)
            try {
                const res = await fetch('/api/user/getusers')
                const data = await res.json()

                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowmore(false)
                    }
                }
            } catch (error) {
                setError(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length
        setError(null)
        try {
            const res = await fetch(
                `/api/post/getusers?startIndex=${startIndex}`,
            )

            const data = await res.json()

            if (res.ok) {
                setUsers(prev => [...prev, ...data.users])

                if (data.users.length < 9) {
                    setShowmore(false)
                }
            }
        } catch (error) {
            setError(null)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        setError(null)
        try {
            const res = await fetch(`/api/user/delete/${userIdtoDelete}`, {
                method: 'DELETE',
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
            } else {
                setUsers(prev =>
                    prev.filter(user => user._id !== userIdtoDelete),
                )
            }
            setUserIdToDelete(null)
        } catch (error) {
            setError(null)
        }
    }
    const formattedDate = user => {
        const date = new Date(user && user.createdAt)
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
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Profile Picture</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {users.map(user => (
                            <Table.Body key={user._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {formattedDate(user)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full mx-auto'
                                        />
                                    </Table.Cell>
                                    <Table.Cell className='font-medium teext-gray-900 dark:text-gray-200'>
                                        {user.username}
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <HiBadgeCheck className='text-blue-500 mx-auto' />
                                        ) : (
                                            <HiBadgeCheck className='text-gray-500 mx-auto' />
                                        )}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <MdAutoDelete
                                            className='mx-auto hover:text-red-500 hover:cursor-pointer'
                                            onClick={() => {
                                                setShowModal(true)
                                                setUserIdToDelete(user._id)
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
                <p>No Users available</p>
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
                            Are you sure you want to delete this user?
                        </h3>

                        <div className='flex justify-center gap-7'>
                            <Button
                                color={'failure'}
                                onClick={handleDeleteUser}
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
