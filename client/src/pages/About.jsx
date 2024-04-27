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
                        className="rounded-full h-36 w-36 mx-auto shadow-md"
                    />
                    <h1 className='text-3xl font-semibold text-center my-7'>
                        About Rahul
                    </h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6'>
                        <p>
                            Welcome! I'm a Mechanical Engineering graduate from
                            the prestigious National Institute of Technology
                            Jalandhar, with a knack for software engineering. As
                            a Software Engineer Intern at Incture Technologies,
                            my passion for innovation shines through in every
                            line of code. Proficient in Java, JavaScript, and
                            C/C++, I specialize in web development, mastering
                            frameworks like React.js and Node.js, along with
                            database management using MySQL and MongoDB
                        </p>
                        <p>
                            With a keen eye for detail and a flair for
                            problem-solving, I architect robust systems,
                            ensuring seamless communication between frontend and
                            backend layers. Advanced authentication protocols
                            like JWT and Microsoft authentication are my forte,
                            fortifying systems against security threats. Whether
                            it's crafting dynamic user interfaces or optimizing
                            backend APIs for peak performance, I thrive on
                            pushing the boundaries of what's possible in the
                            digital realm.
                        </p>
                        <p>
                            Beyond coding, my skill set extends to effective
                            communication and strategic planning. I'm here to
                            revolutionize conventional processes, driving
                            innovation and efficiency at every turn. Join me as
                            we embark on an exhilarating journey to redefine the
                            future of technology, one skillful solution at a
                            time
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
