import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Trails from './pages/Trails'
import TrailDetail from './pages/TrailDetail'
import Climbing from './pages/Climbing'
import ClimbingDetail from './pages/ClimbingDetail'
import Contact from './pages/Contact'
import About from './pages/About'
import Faq from './pages/Faq'
import Blog from './pages/Blog'
import Gallery from './pages/Gallery'
import Gear from './pages/Gear'
import Events from './pages/Events'
import Features from './pages/Features'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import Destinations from './pages/Destinations'
import DestinationDetail from './pages/DestinationDetail'
import Tracking from './pages/Tracking'
import Itineraries from './pages/Itineraries'
import ItineraryDetail from './pages/ItineraryDetail'
import Search from './pages/Search'

export default function App() {
  const location = useLocation()

  // Handle page refresh - restore scroll position and state
  useEffect(() => {
    // Mark that page has loaded
    sessionStorage.setItem('app-loaded', 'true')
    
    // Restore scroll position if navigating back
    const savedScrollPos = sessionStorage.getItem(`scroll-${location.pathname}`)
    if (savedScrollPos) {
      window.scrollTo(0, parseInt(savedScrollPos))
    } else {
      window.scrollTo(0, 0)
    }

    return () => {
      // Save scroll position before leaving page
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY)
    }
  }, [location.pathname])

  // Handle beforeunload to preserve state
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Save current location to restore after refresh
      sessionStorage.setItem('last-location', location.pathname)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [location.pathname])

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
          <Route path="/search" element={<Search />} />
          <Route path="/trails" element={<Trails />} />
          <Route path="/trails/:id" element={<TrailDetail />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/climbing/:id" element={<ClimbingDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
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
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path="/itineraries/:id" element={<ItineraryDetail />} />
          <Route path="/tracking" element={<Tracking />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
