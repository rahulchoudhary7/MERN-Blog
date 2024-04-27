import { useSelector } from 'react-redux'
import { Alert, Badge, Button, Modal, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    signoutSuccess,
} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { TiWarningOutline } from 'react-icons/ti'
import { IoMdDoneAll } from 'react-icons/io'
import { IoCloseCircleSharp } from 'react-icons/io5'

export default function DashProfile() {
    const { currentUser, loading } = useSelector(state => state.user)

    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [password, setPassword] = useState('')
    const [strength, setStrength] = useState(null)
    const filePickerRef = useRef()

    const dispatch = useDispatch()

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        try {
            if (!imageFile) {
                setImageFileUploadError('No file selected')
                return
            }

            // Validate file size and type
            if (
                imageFile.size > 2 * 1024 * 1024 ||
                !imageFile.type.startsWith('image/')
            ) {
                setImageFileUploadError(
                    'File must be less than 2MB and of type image',
                )
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploadProgress(null)
                return
            }

            // Proceed with uploading the file
            setImageFileUploadError(null)
            setImageFileUploading(true)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + imageFile.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, imageFile)

            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageFileUploadProgress(progress.toFixed(0))
                },
                error => {
                    setImageFileUploadError('Could not upload image')
                    setImageFileUploadProgress(null)
                    setImageFile(null)
                    setImageFileUrl(null)
                    setImageFileUploading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        downloadURL => {
                            setImageFileUrl(downloadURL)
                            setImageFileUploadProgress(null)
                            setFormData({
                                ...formData,
                                profilePicture: downloadURL,
                            })
                            setImageFileUploading(false)
                        },
                    )
                },
            )
        } catch (error) {
            setImageFileUploadError('Could not upload image')
        }
    }

    const handleChange = e => {
        if (e.target.id === 'password') {
            setPassword(e.target.value)
            const strengthInfo = getPasswordStrength(e.target.value)
            setStrength(strengthInfo)
        }
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)

        const isFormDataChanged = Object.keys(formData).some(
            key => formData[key] !== currentUser[key],
        )

        if (!isFormDataChanged) {
            setUpdateUserError('No changes were detected')
            return
        }

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes were detected')
            return
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload')
            return
        }

        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()

            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess('Profile updated successfully')
                setStrength(null)
                setPassword('')
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispatch(deleteStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()

            if (!res.ok) {
                dispatch(deleteFailure(data.message))
            } else {
                dispatch(deleteSuccess(data))
            }
        } catch (error) {
            dispatch(deleteFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess('Signed out successfully'))
            }
        } catch (error) {
            console.log(error.message)
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

    return (
        <>
            <div className='max-w-lg mx-auto p-3 w-full'>
                <h1 className=' my-7 text-center font-semibold text-3xl'>
                    Profile
                </h1>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        ref={filePickerRef}
                        hidden
                    />
                    <div
                        className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                        onClick={() => filePickerRef.current.click()}
                    >
                        {imageFileUploadProgress && (
                            <CircularProgressbar
                                value={imageFileUploadProgress || 0}
                                text={`${imageFileUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    root: {
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    },
                                    path: {
                                        stroke: `rgba(62,152,199), ${
                                            imageFileUploadProgress / 100
                                        }`,
                                    },
                                }}
                            />
                        )}
                        <img
                            src={imageFileUrl || currentUser.profilePicture}
                            alt='user'
                            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'
            }`}
                        />
                    </div>
                    {imageFileUploadError && (
                        <Alert color={'failure'}>{imageFileUploadError}</Alert>
                    )}

                    <TextInput
                        type='text'
                        id='username'
                        placeholder='Username'
                        defaultValue={currentUser.username}
                        onChange={handleChange}
                    />
                    <TextInput
                        type='email'
                        id='email'
                        placeholder='Email'
                        defaultValue={currentUser.email}
                        onChange={handleChange}
                    />
                    <TextInput
                        type='password'
                        id='password'
                        placeholder='Password'
                        onChange={handleChange}
                    />
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
                    <Button
                        gradientDuoTone={'purpleToBlue'}
                        type='submit'
                        disabled={loading || imageFileUploading}
                        outline
                    >
                        {loading ? (
                            <>
                                <Spinner size={'sm'} />
                                <span className='pl-3'>Loading...</span>
                            </>
                        ) : (
                            'Update'
                        )}
                    </Button>
                    {currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                            <Button
                                type='button'
                                gradientDuoTone={'purpleToPink'}
                                className='w-full'
                            >
                                Create a Post
                            </Button>
                        </Link>
                    )}
                </form>

                {updateUserSuccess && (
                    <Alert
                        color={'success'}
                        className='mt-5'
                        onDismiss={() => setUpdateUserSuccess(null)}
                    >
                        {updateUserSuccess}
                    </Alert>
                )}

                {updateUserError && (
                    <Alert
                        color={'failure'}
                        className='mt-5'
                        onDismiss={() => setUpdateUserError(null)}
                    >
                        {updateUserError}
                    </Alert>
                )}

                <div className='text-red-500 flex justify-between mt-5'>
                    <span
                        onClick={() => setShowModal(true)}
                        className='cursor-pointer'
                    >
                        Delete Account
                    </span>
                    <span className='cursor-pointer' onClick={handleSignOut}>
                        Signout
                    </span>
                </div>

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
                                Are you sure you want to delete your account?
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
            </div>
        </>
    )
}
