import { Button } from 'flowbite-react'

export default function CallToAction() {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
            <div className='flex-1 flex-col'>
                <h2 className='font-medium text-md sm:text-xl '>
                    🌟 MERN & Spring Boot Developer Available 🌟 <br/>
                    💼 Need expertise in MongoDB, Express.js, React, Node.js, and SpringBoot?<br/>
                    💻 Let&apos;s build robust solutions together. Get in touch now! 🚀
                </h2>
                <Button
                    gradientDuoTone={'purpleToPink'}
                    className='rounded-tl-xl rounded-tr-none rounded-bl-none mt-5 w-full'
                >
                    <a
                        href='https://www.linkedin.com/in/raaxhul/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Connect Here
                    </a>
                </Button>
            </div>

            <div className='flex-1 p-7'>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/rahul-mern-blog.appspot.com/o/MERN.png?alt=media&token=29f1a77c-e9e7-469a-ba9b-2234264d5a02'
                    alt=''
                />
            </div>
        </div>
    )
}
