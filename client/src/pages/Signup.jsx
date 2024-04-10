import { Link } from 'react-router-dom'
import { Button, Label, TextInput } from 'flowbite-react'

function Signup() {
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
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Your Username' />
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div className=''>
              <Label value='Your Email' />
              <TextInput type='email' placeholder='Email' id='email' />
            </div>
            <div className=''>
              <Label value='Your Password' />
              <TextInput type='password' placeholder='Password' id='password' />
            </div>
            <Button gradientDuoTone={'purpleToPink'} type='submit'>
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Have an account? </span>
            <Link to={'/signin'} className='text-blue-700 underline'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
