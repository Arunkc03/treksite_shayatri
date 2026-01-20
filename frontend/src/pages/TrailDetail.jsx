import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Map from '../components/Map'
import Reviews from '../components/Reviews'
import PaymentGatewaySelector from '../components/PaymentGatewaySelector'
import { weatherAPI, trailsAPI } from '../lib/apiClient'
import { useAuth } from '../context/AuthContext'

export default function TrailDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [trail, setTrail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [showClientInfo, setShowClientInfo] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [numParticipants, setNumParticipants] = useState(1)
  const [bookingDate, setBookingDate] = useState('')
  const [bookings, setBookings] = useState([])
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false)
  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: '',
    idDocument: null
  })
  const [idPreview, setIdPreview] = useState(null)
  const PRICE_PER_PERSON = 2500 // NPR per person

  // Check if trek is already booked
  useEffect(() => {
    if (!trail) return
    
    const bookedTreks = JSON.parse(localStorage.getItem('bookedTreks') || '[]')
    const alreadyBooked = bookedTreks.some(booking => booking.trekId === trail.id)
    setIsAlreadyBooked(alreadyBooked)
  }, [trail])

  // Helper function for difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#10b981'
      case 'moderate': return '#f59e0b'
      case 'hard': return '#ef4444'
      case 'expert': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  // Fetch trail details from backend
  useEffect(() => {
    const fetchTrail = async () => {
      try {
        setLoading(true)
        const data = await trailsAPI.getById(id)
        setTrail(data.trail)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch trail:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrail()
  }, [id])

  // Sample route coordinates (for demo)
  const sampleRoute = [
    [-74.0, 40.7],
    [-74.1, 40.8],
    [-74.2, 40.9],
    [-74.3, 40.8],
    [-74.2, 40.7]
  ]

  // Fetch weather for trail location
  useEffect(() => {
    if (!trail) return

    const fetchWeather = async () => {
      setWeatherLoading(true)
      setWeatherError(null)
      try {
        // Use real coordinates from trail
        const lat = trail.lat || 40.7128
        const lng = trail.lng || -74.0060
        
        const weatherData = await weatherAPI.getWeather(lat, lng)
        setWeather(weatherData.data)

        const forecastData = await weatherAPI.getForecast(lat, lng, 5)
        setForecast(forecastData.forecast || [])
      } catch (err) {
        setWeatherError(err.message)
        console.error('Failed to fetch weather:', err)
        // Fallback to mock data if API fails
        setWeather({
          temp: 22,
          condition: 'Partly Cloudy',
          humidity: 65,
          wind_speed: 15,
          icon: '⛅',
        })
        setForecast([
          { date: 'Today', temp_high: 25, temp_low: 18, condition: 'Sunny', icon: '☀️' },
          { date: 'Tomorrow', temp_high: 23, temp_low: 17, condition: 'Cloudy', icon: '☁️' },
          { date: 'Wed', temp_high: 20, temp_low: 15, condition: 'Rainy', icon: '🌧️' },
        ])
      } finally {
        setWeatherLoading(false)
      }
    }

    fetchWeather()
  }, [trail])

  if (loading) return (
    <div className="page trail-detail">
      <p style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>Loading trail details...</p>
    </div>
  )

  if (error || !trail) return (
    <div className="page trail-detail">
      <h2>Trail not found</h2>
      <Link to="/trails">Back to trails</Link>
    </div>
  )

  // Handle image URLs properly
  const isImage = trail.image && (
    trail.image.startsWith('http') || 
    trail.image.startsWith('/uploads') || 
    trail.image.includes('localhost') ||
    trail.image.includes('trek-')
  );
  let imageSrc = trail.image;
  if (trail.image && trail.image.startsWith('/uploads')) {
    imageSrc = `http://localhost:5000${trail.image}`;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/trails" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </Link>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 700 }}>{trail.name}</h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {trail.location}</p>
            </div>
          </div>
          {trail.price && (
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              color: '#2d5016', 
              padding: '16px 24px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#666' }}>Price per Person</p>
              <p style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: '#2d5016' }}>₨ {parseFloat(trail.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Image */}
        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', background: '#f0f4ff', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isImage ? (
            <img 
              src={imageSrc} 
              alt={trail.name}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ fontSize: '120px', textAlign: 'center' }}>
              {trail.image || '⛰️'}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div>
            {/* Details Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Trail Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {trail.difficulty && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Difficulty Level</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#2d5016' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '14px' }}>
                        {trail.difficulty}
                      </span>
                    </p>
                  </div>
                )}
                
                {trail.location && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📍 {trail.location}</p>
                  </div>
                )}

                {(trail.length_km || trail.length) && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Distance</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📏 {trail.length_km || trail.length} km</p>
                  </div>
                )}
              </div>

              {trail.description && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: 0, marginBottom: '12px' }}>About This Trail</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0, fontSize: '16px' }}>
                    {trail.description}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0369a1', marginTop: 0, marginBottom: '16px' }}>✓ What to Expect</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: '1.8' }}>
                  <li>Professional guides and safety equipment</li>
                  <li>Well-marked trails and rest points</li>
                  <li>Flexible scheduling based on your availability</li>
                  <li>Basic camping gear provided</li>
                  <li>Travel insurance coverage included</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '20px',
              maxWidth: '100%',
              overflowX: 'hidden'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#2d5016', wordBreak: 'break-word' }}>💰 Pricing</h3>
              
              {trail.price && (
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #0369a1', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '12px', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Price per Person</p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#2d5016' }}>₨ {parseFloat(trail.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
              )}
              
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px', fontWeight: 600 }}>Trail Type</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                  {trail.difficulty} Trek
                </p>
              </div>
              
              <Link
                to="/trails"
                style={{
                  width: '100%',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  transition: 'background 0.2s',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => e.target.style.background = '#d1d5db'}
                onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
              >
                ← Back to Trails
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        <Reviews trailId={trail?.id} />
      </div>
    </div>
  )
}
