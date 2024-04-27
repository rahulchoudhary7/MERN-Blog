import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import {
    HiArrowSmRight,
    HiDocumentText,
} from 'react-icons/hi'
import { FaUsers, FaUser } from "react-icons/fa";
import { LiaComments } from "react-icons/lia";
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { MdDashboard } from "react-icons/md";

export default function DashSidebar() {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()

    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess("Signed out successfully"))
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={FaUser}
                            label={currentUser.isAdmin ? 'Admin' : 'User'}
                            labelColor='dark'
                            className='cursor-pointer'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=dashboard'}>
                            <Sidebar.Item
                                as='div'
                                active={tab === 'dashboard'}
                                icon={MdDashboard}
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item
                                as='div'
                                active={tab === 'posts'}
                                icon={HiDocumentText}
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}

                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=users'}>
                            <Sidebar.Item
                                as='div'
                                active={tab === 'users'}
                                icon={FaUsers}
                            >
                                Users
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=comments'}>
                            <Sidebar.Item
                                as='div'
                                active={tab === 'comments'}
                                icon={LiaComments}
                            >
                                Comments
                            </Sidebar.Item>
                        </Link>
                    )}

                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className='cursor-pointer'
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
