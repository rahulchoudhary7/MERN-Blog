// import { Select, TextInput } from 'flowbite-react'
// import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

// export default function Search() {
//     const [searchData, setSearchData] = useState({
//         searchTerm: '',
//         sort: 'desc',
//         category: 'uncategorized',
//     })

//     const [posts, setPosts] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [showMore, setShowMore] = useState(false)
//     const location = useLocation()

//     console.log(searchData);

//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search)
//         const searchTermFromUrl = urlParams.get('searchTerm')
//         const sortFromUrl = urlParams.get('sort')
//         const categoryFromUrl = urlParams.get('category')

//         if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
//             setSearchData({
//                 ...searchData,
//                 searchTerm: searchTermFromUrl,
//                 sort: sortFromUrl,
//                 category: categoryFromUrl,
//             })
//         }

//         const fetchPosts = async ()=>{
//             setLoading(true);

//             const searchQuery = urlParams.toString();
//             const res = await fetch(`/api/post/getposts?${searchQuery}`)
//             if(!res.ok){
//                 setLoading(false);
//                 return
//             }
//             else if(res.ok){
//                 const data = await res.json();
//                 setPosts(data.posts)
//                 setLoading(false)

//                 if(data.posts.length>9){
//                     setShowMore(true)
//                 }else{
//                     setShowMore(false)
//                 }

//             }
//         }

//         fetchPosts()
//     }, [location.search])

//     function handleChange(e){
//         if(e.target.id==='searchTerm'){
//             setSearchData({
//                 ...searchData,
//                 searchTerm: e.target.value
//             })
//         }

//         if(e.target.id==='sort'){
//             const order = e.target.value || 'desc'
//             setSearchData({
//                 ...searchData,
//                 sort: order
//             })
//         }

//         if(e.target.id==='category'){
//             const category = e.target.value || 'uncategorized'
//             setSearchData({
//                 ...searchData,
//                 category
//             })
//         }
//     }

//     return (
//         <div className='flex flex-col'>
//             <div className='p-2 border-b  my-4 border-gray-500'>
//                 <form className='flex flex-col gap-8'>
//                     <div className="flex justify-center gap-5">
//                     <div className='flex flex-col gap-2'>
//                         <label className='whitespace-nowrap font-semibold'>Search term:</label>
//                         <TextInput
//                             className=''
//                             placeholder='Search...'
//                             id='searchTerm'
//                             type='text'
//                             value={searchData.searchTerm}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div>
//                         <label className='whitespace-nowrap font-semibold'>
//                             Sort
//                         </label>
//                         <Select>
//                             <option value={'desc'}>Latest first</option>
//                             <option value={'asc'}>Oldest first</option>
//                         </Select>
//                     </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }
import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    })


    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    const location = useLocation()

    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            })
        }

        const fetchPosts = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/post/getposts?${searchQuery}`)
            if (!res.ok) {
                setLoading(false)
                return
            }
            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)
                if (data.posts.length === 9) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
            }
        }
        fetchPosts()
    }, [location.search])

    const handleChange = e => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc'
            setSidebarData({ ...sidebarData, sort: order })
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized'
            setSidebarData({ ...sidebarData, category })
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length
        const startIndex = numberOfPosts
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/post/getposts?${searchQuery}`)
        if (!res.ok) {
            return
        }
        if (res.ok) {
            const data = await res.json()
            setPosts([...posts, ...data.posts])
            if (data.posts.length === 9) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='flex p-7 border-b w-full border-gray-500'>
                <form
                    className='flex flex-col sm:flex-row max-w-full gap-4 flex-grow justify-end'
                    onSubmit={handleSubmit}
                >
                    <div className='flex sm:flex-col  items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </label>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex sm:flex-col items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.sort}
                            id='sort'
                        >
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex sm:flex-col items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.category}
                            id='category'
                        >
                            <option value={'uncategorized'}>
                                ---Select---
                            </option>
                            <option value={'Personal'}>Personal Blog</option>
                            <option value={'Lifestyle'}>Lifestyle Blog</option>
                            <option value={'Travel'}>Travel Blog</option>
                            <option value={'Food'}>Food Blog</option>
                            <option value={'Technology'}>Tech Blog</option>
                        </Select>
                    </div>
                    <div className='flex sm:flex-col items-center gap-2 mt-8'>
                        <Button
                            type='submit'
                            outline
                            gradientDuoTone='purpleToPink'
                        >
                            Apply Filters
                        </Button>
                    </div>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4 justify-center'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && (
                        <p className='text-xl text-gray-500'>Loading...</p>
                    )}
                    {!loading &&
                        posts &&
                        posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
