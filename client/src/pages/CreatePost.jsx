import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useSelector } from 'react-redux'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
    const { currentUser, loading } = useSelector(state => state.user)

    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [publishError, setPublishError] = useState(null)

    const navigate = useNavigate()

    const handleUploadImage = async () => {
        try {
            // Ensure imageFile is not null
            if (!imageFile) {
                setImageFileUploadError('No file selected')
                return
            }

            // Validate file size and type
            if (!imageFile.type.startsWith('image/')) {
                setImageFileUploadError('File must be of type image')
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
                            setImageFileUploadProgress(null)
                            setImageFileUrl(downloadURL)
                            setImageFileUploading(false)
                            setFormData({ ...formData, image: downloadURL })
                            console.log(downloadURL)
                        },
                    )
                },
            )
        } catch (error) {
            setImageFileUploadError('Could not upload Image')
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            const res = await fetch('/api/post/createpost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError(error.message)
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>
                Create a post
            </h1>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={e =>
                            setFormData({
                                ...formData,
                                [e.target.id]: e.target.value,
                            })
                        }
                    />
                    <Select
                        onChange={e =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                    >
                        <option value={'uncategorized'}>---Select---</option>
                        <option value={'JavaScript'}>JavaScript</option>
                        <option value={'ReactJS'}>ReactJS</option>
                        <option value={'NextJS'}>NextJS</option>
                    </Select>
                </div>

                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput
                        type='file'
                        accept='image/*'
                        onChange={e => setImageFile(e.target.files[0])}
                    />
                    <Button
                        type='button'
                        gradientDuoTone={'purpleToBlue'}
                        size={'sm'}
                        onClick={handleUploadImage}
                        disabled={loading || imageFileUploading}
                        outline
                    >
                        {imageFileUploadProgress ? (
                            <div className='h-12 w-12'>
                                <CircularProgressbar
                                    value={imageFileUploadProgress}
                                    text={`${imageFileUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload'
                        )}
                    </Button>
                </div>
                {imageFileUploadError && (
                    <Alert color='failure' className='mt-4'>
                        {imageFileUploadError}
                    </Alert>
                )}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='write something'
                    className='h-72 mb-12'
                    required
                    onChange={value =>
                        setFormData({
                            ...formData,
                            content: value,
                        })
                    }
                    disabled={imageFileUploadProgress}
                />
                <Button type='submit' gradientDuoTone={'purpleToBlue'} disabled={loading || imageFileUploadProgress}>
                    Publish
                </Button>

                {publishError && (
                    <Alert color={'failure'} className='mt-4'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    )
}
