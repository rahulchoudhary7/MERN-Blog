import { Link, useNavigate } from 'react-router-dom'
import {
    Alert,
    Button,
    Checkbox,
    Label,
    Spinner,
    TextInput,
    Toast,
} from 'flowbite-react'
import { useEffect, useState } from 'react'
import {
    signInStart,
    signInSuccess,
    signInFailure,
    alertDone,
    setErrorNull,
} from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'
import { RiCompassDiscoverFill } from 'react-icons/ri'
import { HiCheck } from 'react-icons/hi'

function Signin() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()
    const {
        loading,
        error: errorMessage,
        signoutMessage,
    } = useSelector(state => state.user)

    const navigate = useNavigate()

    useEffect(()=>{
        if(signoutMessage){
            setTimeout(() => {
                dispatch(alertDone())
            }, 5000);
        }
    })

    const handleSubmit = async e => {
        e.preventDefault()

        const formData = {
            email: email,
            password: password,
        }
        if (!formData.email || !formData.password) {
            dispatch(signInFailure('All fields are required.'))
        }

        try {
            dispatch(signInStart())

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                },
                withCredentials: true,
                credentials: 'include',

                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                return dispatch(signInFailure(data.message))
            }

            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            dispatch(signInFailure(error.message))
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            {signoutMessage && (
                <Toast className='mx-auto mt-5'>
                    <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
                        <HiCheck className='h-5 w-5' />
                    </div>
                    <div className='ml-3 text-sm font-normal'>
                        {signoutMessage}
                    </div>
                    <Toast.Toggle onDismiss={() => dispatch(alertDone())} />
                </Toast>
            )}
            <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
                {/* leftside */}
                <div className='flex flex-col flex-1'>
                    <Link
                        to={'/'}
                        className='font-bold dark:text-white flex justify-center items-center gap-2'
                    >
                        <RiCompassDiscoverFill className=' text-red-500 h-14 w-14 ' />
                        <span className='text-3xl font-bold'>
                            NOMAD&apos;S NEXUS
                        </span>
                    </Link>
                    <p className='text-lg mt-5 pl-4 text-center font-medium'>
                        Welcome back! Sign in to continue exploring awesome
                        contents
                    </p>
                </div>
                {/* rightside */}
                <div className='flex-1'>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={handleSubmit}
                    >
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
                                'Sign In'
                            )}
                        </Button>

                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-2'>
                        <span>Don&apos;t have an account? </span>
                        <Link
                            to={'/signup'}
                            className='text-blue-700 hover:text-blue-500 font-medium'
                        >
                            Sign Up
                        </Link>
                    </div>
                    {errorMessage && (
                        <Alert
                            className='mt-5'
                            color={'failure'}
                            onDismiss={() => dispatch(setErrorNull())}
                        >
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Signin
