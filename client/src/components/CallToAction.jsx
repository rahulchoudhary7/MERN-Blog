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
                    src='https://www.logicraysacademy.com/blog/wp-content/uploads/2023/05/MVM1-1.png'
                    alt=''
                />
            </div>
        </div>
    )
}
