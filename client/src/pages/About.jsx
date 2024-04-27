function About() {
    return (
        <div className='min-h-screen flex items-center justify-center m-10'>
            <div className='max-w-2xl mx-auto p-3 text-center'>
                <div className=''>
                    <img
                        src={
                            'https://firebasestorage.googleapis.com/v0/b/rahul-mern-blog.appspot.com/o/1708791703467.jpeg?alt=media&token=b65a945a-e385-48a1-9c26-2844de9a639e'
                        }
                        alt=''
                        className='rounded-full h-36 w-36 mx-auto shadow-md'
                    />
                    <h1 className='text-3xl font-semibold text-center my-7'>
                        About Rahul
                    </h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6'>
                        <p>
                            Welcome! I&apos;m a Mechanical Engineering graduate
                            from the esteemed National Institute of Technology
                            Jalandhar, with a strong inclination towards
                            software engineering. My professional journey has
                            been defined by a commitment to innovation and
                            excellence in software development. Proficient in
                            Java, JavaScript, and C/C++, I specialize in web
                            development, particularly in frameworks like
                            React.js, Node.js and SpringBoot, coupled with expertise in
                            database management using MySQL and MongoDB.
                        </p>
                        <p>
                            With a meticulous approach to problem-solving, I
                            architect robust systems that facilitate seamless
                            communication between frontend and backend layers. I
                            prioritize security and reliability, implementing
                            advanced authentication protocols to safeguard
                            systems against potential threats. My skill set
                            extends beyond technical proficiency to encompass
                            effective communication and strategic planning. I'm
                            dedicated to driving innovation and efficiency,
                            seeking to revolutionize conventional processes and
                            redefine the future of technology.
                        </p>
                        <p>
                            Join me as we embark on an exciting journey to push
                            the boundaries of what&apos;s possible in the digital
                            realm, one solution at a time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
