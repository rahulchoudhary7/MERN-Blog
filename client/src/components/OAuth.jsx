import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const auth = getAuth(app)
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()

    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider)
      // const resultFromGoogle = await signInWithRedirect(auth, provider);
      //check out how to do sign in with redirect from firebase;
      console.log(resultFromGoogle.user)
      console.log(resultFromGoogle.user.photoURL)

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      type='button'
      gradientDuoTone={'pinkToOrange'}
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
          Continue with Google
    </Button>
  )
}
