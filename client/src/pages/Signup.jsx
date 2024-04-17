import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import OAuth from '../components/OAuth'

function Signup() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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
        console.log(formData)

        try {
            setLoading(true)
            setErrorMessage(null)
            console.log(formData)
            const res = await fetch('http://localhost:3000/api/auth/signup', {
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

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
                {/* leftside */}
                <div className='flex-1'>
                    <Link
                        to={'/'}
                        className='font-bold dark:text-white text-4xl'
                    >
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to bg-pink-500 rounded-lg text-white'>
                            Rahul&apos;s
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project. You can sign up with your email
                        and password or with Google
                    </p>
                </div>
                {/* rightside */}
                <div className='flex-1'>
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
                                    console.log(username)
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
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder='Password'
                                id='password'
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                            />
                            {password !== '' && (
                                <label
                                    onClick={() =>
                                        setIsPasswordVisible(!isPasswordVisible)
                                    }
                                    className='text-sm text-blue-700 cursor-pointer '
                                >
                                    {isPasswordVisible
                                        ? 'Hide Password'
                                        : 'Show password'}
                                </label>
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
                            className='text-blue-700 hover:text-blue-500'
                        >
                            Sign In
                        </Link>
                    </div>
                    {errorMessage && (
                        <Alert className='mt-5' color={'failure'}>
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Signup
