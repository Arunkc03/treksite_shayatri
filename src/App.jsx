import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Trails from './pages/Trails'
import TrailDetail from './pages/TrailDetail'
import Climbing from './pages/Climbing'
import Contact from './pages/Contact'
import About from './pages/About'
import Faq from './pages/Faq'
import Blog from './pages/Blog'
import Gallery from './pages/Gallery'
import Gear from './pages/Gear'
import Events from './pages/Events'
import Features from './pages/Features'
import Activities from './pages/Activities'
import Destinations from './pages/Destinations'
import DestinationDetail from './pages/DestinationDetail'
import SignUp from './pages/SignUp'
import Admin from './pages/Admin'
import SignIn from './pages/SignIn'
import Tracking from './pages/Tracking'

export default function App() {
  const { user } = useAuth()

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trails" element={<Trails />} />
          <Route path="/trails/:id" element={<TrailDetail />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gear" element={<Gear />} />
          <Route path="/events" element={<Events />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
