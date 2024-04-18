import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import {  useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useSelector } from 'react-redux'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function CreatePost() {
    const { currentUser, loading, error } = useSelector(state => state.user)

    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [imageFileUploading, setImageFileUploading] = useState(false)

   

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
                            setFormData({ ...formData, imageUrl: downloadURL })
                            console.log(downloadURL)
                        },
                        console.log(formData.imageUrl),
                    )
                },
            )
        } catch (error) {
            setImageFileUploadError('Could not upload Image')
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>
                Create a post
            </h1>

            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                    />
                    <Select>
                        <option value={'uncategorized'}>---Select---</option>
                        <option value={'javascript'}>JavaScript</option>
                        <option value={'react'}>ReactJS</option>
                        <option value={'next'}>NextJS</option>
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
                {formData.imageUrl && (
                    <img
                        src={formData.imageUrl}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='write something'
                    className='h-72 mb-12'
                    required
                />
                <Button type='submit' gradientDuoTone={'purpleToBlue'}>
                    Publish
                </Button>
            </form>
        </div>
    )
}
