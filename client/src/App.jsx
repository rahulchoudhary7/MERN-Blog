import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Routes>               
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/search' element={<Search />} />
                    <Route path='/posts' element={<Posts />} />
                    <Route path='/post/:postSlug' element={<PostPage />} />
                </Route>
                <Route element={<AdminPrivateRoute />}>
                    <Route path='/create-post' element={<CreatePost />} />
                    <Route
                        path='/update-post/:postId'
                        element={<UpdatePost />}
                    />
                </Route>
                
            </Routes>

            <Footer />
        </BrowserRouter>
    )
}
