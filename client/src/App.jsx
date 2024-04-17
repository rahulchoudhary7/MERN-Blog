import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './pages/CreatePost'

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                </Route>
                <Route element={<AdminPrivateRoute />}>
                    <Route path='/create-post' element={<CreatePost />} />
                </Route>
                <Route path='/projects' element={<Projects />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    )
}
