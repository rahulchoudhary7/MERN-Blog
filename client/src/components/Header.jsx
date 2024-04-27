import { Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice'
import { useEffect, useState } from 'react'
import { RiCompassDiscoverFill } from 'react-icons/ri'
function Header() {
    const { currentUser } = useSelector(state => state.user)
    const { theme } = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const [searchTerm, setSearchTerm] = useState('')
    const path = useLocation().pathname
    const location = useLocation()
    const navigate = useNavigate()


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

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    const handleSubmit = e => {
        e.preventDefault()

        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    }

    return (
        <>
            <Navbar className='border-b-2'>
                <Link
                    to={'/'}
                    className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white flex items-center justify-center gap-2'
                >
                    
                    <RiCompassDiscoverFill className='text-red-500 h-10 w-10 ' />
                    <span className='text:lg sm:text-xl font-bold'>
                        NOMAD&apos;S NEXUS
                    </span>
                </Link>

                <form onSubmit={handleSubmit}>
                    <TextInput
                        type='text'
                        placeholder='Search...'
                        rightIcon={AiOutlineSearch}
                        className='hidden lg:inline '
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button className='w-12 h-10 hidden sm:inline lg:hidden' color='gray' pill>
                    <AiOutlineSearch />
                </Button>
                <div className='flex gap-2 md:order-2'>
                    {theme === 'Light' ? (
                        <Button
                            className='w-12 h-10'
                            color='gray'
                            pill
                            onClick={() => dispatch(toggleTheme())}
                        >
                            <FaMoon className='my-auto'/>
                        </Button>
                    ) : (
                        <Button
                            className='w-12 h-10'
                            color='gray'
                            pill
                            onClick={() => dispatch(toggleTheme())}
                        >
                            <FaSun className='my-auto'/>
                        </Button>
                    )}
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>
                                    {currentUser.username}
                                </span>
                                <span className='block text-sm truncate'>
                                    {currentUser.email}
                                </span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                className='font-medium text-red-500 dark:text-red-500 '
                                onClick={handleSignout}
                            >
                                Sign Out
                            </Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to={'/signin'}>
                            <Button gradientDuoTone='purpleToBlue' className='text:xs sm:text-sm'>
                                Sign In
                            </Button>
                        </Link>
                    )}

                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link active={path === '/'} as={'div'}>
                        <Link to={'/'}>Home</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === '/about'} as={'div'}>
                        <Link to={'/about'}>About</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === '/posts'} as={'div'}>
                        <Link to={'/posts'}>Posts</Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default Header
