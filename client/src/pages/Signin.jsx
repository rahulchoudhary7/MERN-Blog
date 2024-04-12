import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

function Signin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const {loading, error:errorMessage} = useSelector(state=>state.user)

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    

    const formData = {
      email: email,
      password: password,
    }
    if(!formData.email || !formData.password){
      dispatch(signInFailure('All fields are required.'))
    }

    
    console.log(formData)

    try {
      dispatch(signInStart())

      console.log(formData)
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* leftside */}
        <div className='flex-1'>
          <Link to={'/'} className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to bg-pink-500 rounded-lg text-white'>
              Rahul's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password
            or with Google
          </p>
        </div>
        {/* rightside */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className='text-sm text-blue-700 cursor-pointer '
                >
                  {isPasswordVisible ? 'Hide Password' : 'Show password'}
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
          </form>
          <div className='flex gap-2 text-sm mt-2'>
            <span>Don't have an account? </span>
            <Link to={'/signup'} className='text-blue-700 hover:text-blue-500'>
              Sign Up
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

export default Signin
