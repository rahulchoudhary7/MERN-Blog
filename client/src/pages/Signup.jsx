import { Link, useNavigate } from 'react-router-dom'
import {
    Alert,
    Badge,
    Button,
    Checkbox,
    Label,
    Spinner,
    TextInput,
} from 'flowbite-react'
import { useState } from 'react'
import OAuth from '../components/OAuth'
import { RiCompassDiscoverFill } from 'react-icons/ri'
import { TiWarningOutline } from 'react-icons/ti'
import { IoMdDoneAll } from 'react-icons/io'
import { IoCloseCircleSharp } from 'react-icons/io5'

function Signup() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const [strength, setStrength] = useState(null)

    const hasWhitespace = username => {
        return /\s/.test(username)
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (!email || !username || !password) {
            return setErrorMessage('Please fill out all fields')
        }

        if (hasWhitespace(username)) {
            return setErrorMessage('Username can not contain spaces')
        }

        const formData = {
            username: username,
            email: email,
            password: password,
        }

        try {
            setLoading(true)
            setErrorMessage(null)
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                return setErrorMessage(data.message)
            }
            setLoading(false)

            if (res.ok) {
                navigate('/signin')
            }
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false)
        }
    }

    function getPasswordStrength(password) {
        const lengthScore = password.length >= 8 ? 2 : 1
        const uppercaseScore = password.toUpperCase() !== password ? 1 : 0
        const lowercaseScore = password.toLowerCase() !== password ? 1 : 0
        const numberScore = /\d/.test(password) ? 1 : 0
        const symbolScore = /[!@#$%^&*()_+\-=\[\]{};':".\/\\|?<>]/.test(
            password,
        )
            ? 1
            : 0

        const totalScore =
            lengthScore +
            uppercaseScore +
            lowercaseScore +
            numberScore +
            symbolScore

        let strength
        if (totalScore <= 2) {
            strength = 'Weak'
        } else if (totalScore <= 4) {
            strength = 'Medium'
        } else {
            strength = 'Strong'
        }

        return strength
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value)
        const strengthInfo = getPasswordStrength(e.target.value)
        setStrength(strengthInfo)
    }

    return (
        <>
            <div className='min-h-screen mt-20'>
                <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
                    {/* leftside */}
                    <div className='flex flex-col flex-1'>
                        <Link
                            to={'/'}
                            className='font-bold dark:text-white flex justify-center items-center gap-2'
                        >
                            <RiCompassDiscoverFill className=' text-red-500 h-16 w-16 ' />
                            <span className='text-3xl font-bold'>
                                NOMAD&apos;S NEXUS
                            </span>
                        </Link>
                        <p className='text-lg mt-5 pl-4 text-center font-medium'>
                            Join the Conversation! Sign up for a free account to
                            comment on posts, share your voice, and connect with
                            other readers.
                        </p>
                    </div>
                    {/* rightside */}
                    <div className='flex-1'>
                        {errorMessage && (
                            <Alert
                                className='mt-5 max-w-2xl mx-auto'
                                color={'failure'}
                                onDismiss={() => setErrorMessage(null)}
                            >
                                {errorMessage}
                            </Alert>
                        )}
                        <form
                            className='flex flex-col gap-4'
                            onSubmit={handleSubmit}
                        >
                            <div className=''>
                                <Label value='Your Username' />
                                <TextInput
                                    type='text'
                                    placeholder='Username'
                                    id='username'
                                    onChange={e => {
                                        setUsername(e.target.value)
                                    }}
                                />
                            </div>
                            <div className=''>
                                <Label value='Your Email' />
                                <TextInput
                                    type='email'
                                    placeholder='Email'
                                    id='email'
                                    onChange={e => {
                                        setEmail(e.target.value)
                                    }}
                                />
                            </div>
                            <div className=''>
                                <Label value='Your Password' />
                                <TextInput
                                    type={
                                        isPasswordVisible ? 'text' : 'password'
                                    }
                                    placeholder='Password'
                                    id='password'
                                    onChange={handlePasswordChange}
                                />
                                {password !== '' && (
                                    <div className='flex mt-2 gap-1'>
                                        <Checkbox
                                            onClick={() =>
                                                setIsPasswordVisible(
                                                    !isPasswordVisible,
                                                )
                                            }
                                        />

                                        <label className='text-xs tex-gray-500 mr-5'>
                                            Show Password
                                        </label>
                                    </div>
                                )}
                                {password !== '' && (
                                    <label
                                        onClick={() =>
                                            setIsPasswordVisible(
                                                !isPasswordVisible,
                                            )
                                        }
                                        className='text-sm text-blue-700 cursor-pointer '
                                    >
                                        {isPasswordVisible
                                            ? 'Hide Password'
                                            : 'Show password'}
                                    </label>
                                )}
                                {password && strength === 'Weak' && (
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        <Badge
                                            icon={IoCloseCircleSharp}
                                            color={'failure'}
                                            className='px-2'
                                        >
                                            Password strength: Weak
                                        </Badge>
                                    </div>
                                )}
                                {password && strength === 'Medium' && (
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        <Badge
                                            icon={TiWarningOutline}
                                            color={'warning'}
                                            className='px-2'
                                        >
                                            Password strength: Medium
                                        </Badge>
                                    </div>
                                )}
                                {password && strength === 'Strong' && (
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        <Badge
                                            icon={IoMdDoneAll}
                                            color={'success'}
                                            className='px-2'
                                        >
                                            Password strength: Strong
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <Button
                                gradientDuoTone={'purpleToPink'}
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size={'sm'} />
                                        <span className='pl-3'>Loading...</span>
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>

                            <OAuth />
                        </form>
                        <div className='flex gap-2 text-sm mt-2'>
                            <span>Already have an account? </span>
                            <Link
                                to={'/signin'}
                                className='text-blue-700 hover:text-blue-500 font-medium'
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
