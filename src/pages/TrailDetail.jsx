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
  const [showPayment, setShowPayment] = useState(false)
  const [numParticipants, setNumParticipants] = useState(1)
  const [bookingDate, setBookingDate] = useState('')
  const [bookings, setBookings] = useState([])
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false)

  // Check if trek is already booked from database
  useEffect(() => {
    if (!user || !trail) return
    
    const checkBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/email/${user.email}`)
        const data = await response.json()
        if (data.success && data.bookings && Array.isArray(data.bookings)) {
          // Check if this user already booked this specific trek
          const trailId = parseInt(trail.id)
          const userBookings = data.bookings.filter(booking => {
            const bookingTrekId = parseInt(booking.trek_id)
            return bookingTrekId === trailId
          })
          // Prevent rebooking the same trek
          setIsAlreadyBooked(userBookings.length > 0)
        }
      } catch (err) {
        console.error('Error checking booking:', err)
      }
    }
    
    checkBooking()
  }, [trail, user])

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
    <div className="page trail-detail">
      {/* Header Section with Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#1a202c', marginBottom: '12px' }}>{trail.name}</h1>
        <p style={{ fontSize: '18px', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {trail.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📏 {trail.length || trail.length_km} km</span>
          <span style={{ padding: '4px 12px', background: getDifficultyColor(trail.difficulty), color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>{trail.difficulty}</span>
        </p>
      </div>

      {/* Hero Image Section */}
      {isImage ? (
        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <img 
            src={imageSrc} 
            alt={trail.name} 
            style={{ width: '100%', height: '100%', maxHeight: '500px', objectFit: 'cover' }} 
            loading="lazy" 
          />
        </div>
      ) : (
        <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', marginBottom: '32px', fontSize: '120px' }}>
          {trail.image || '⛰️'}
        </div>
      )}

      {/* Description Section */}
      <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#1a202c' }}>About This Trek</h3>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>{trail.description || 'Explore this amazing trail through beautiful landscapes and challenging terrain.'}</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📏</div>
          <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: 500 }}>Distance</h4>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c' }}>{trail.length || trail.length_km} km</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⛰️</div>
          <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: 500 }}>Difficulty</h4>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c' }}>{trail.difficulty}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
          <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: 500 }}>Location</h4>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c' }}>{trail.location}</p>
        </div>
      </div>

      {/* Weather Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', marginBottom: '32px', color: '#fff' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>🌤️ Weather Forecast</h3>
        {weatherError && <p style={{ color: '#fed7d7', marginBottom: '12px' }}>⚠️ {weatherError}</p>}
        {weatherLoading && <p style={{ color: '#fff' }}>Loading weather data...</p>}
        {weather && (
          <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '64px' }}>{weather.icon}</div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>{weather.temp}°C</p>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>{weather.condition}</p>
                <p style={{ fontSize: '14px', display: 'flex', gap: '16px', opacity: 0.9 }}>
                  <span>💧 {weather.humidity}% humidity</span>
                  <span>💨 {weather.wind_speed} km/h wind</span>
                </p>
              </div>
            </div>
          </div>
        )}
        {forecast.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
            {forecast.map((day, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{day.date}</p>
                <p style={{ fontSize: '36px', marginBottom: '8px' }}>{day.icon}</p>
                <p style={{ fontSize: '13px', marginBottom: '6px' }}>{day.condition}</p>
                <p style={{ fontSize: '16px', fontWeight: 700 }}>{day.temp_high}° / {day.temp_low}°</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Section */}
      <div style={{ background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)', padding: '32px', borderRadius: '12px', marginBottom: '32px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>📅 Book This Trek</h3>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>Secure your spot on this amazing adventure</p>
        
        {isAlreadyBooked ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '24px', borderRadius: '12px', color: '#1a202c', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#10b981' }}>Already Booked!</h4>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>You have already booked this trek. Check your profile for booking details.</p>
            <Link 
              to="/profile" 
              style={{ display: 'inline-block', padding: '12px 24px', background: '#2d5016', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}
            >
              View My Bookings
            </Link>
          </div>
        ) : !showBooking ? (
          <button 
            onClick={() => {
              if (!user) {
                alert('Please sign in to book this trek')
                return
              }
              setShowBooking(true)
            }} 
            style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 600, background: '#fff', color: '#2d5016', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            📅 Book Now
          </button>
        ) : (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '24px', borderRadius: '12px', color: '#1a202c' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>👥 Number of Participants</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numParticipants}
                  onChange={(e) => setNumParticipants(parseInt(e.target.value))}
                  style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '16px', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>📆 Preferred Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '16px', fontWeight: 600 }}
                />
              </div>
            </div>
            <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #bae6fd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', color: '#0369a1', fontWeight: 600 }}>Price per person:</span>
                <span style={{ fontSize: '18px', color: '#0369a1', fontWeight: 700 }}>NPR {(trail?.price || 2500).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '2px dashed #bae6fd' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e' }}>Total Cost:</span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#0c4a6e' }}>NPR {((trail?.price || 2500) * numParticipants).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#0369a1', marginTop: '8px', textAlign: 'center' }}>
                {numParticipants} participant{numParticipants > 1 ? 's' : ''} × NPR {(trail?.price || 2500).toLocaleString()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (!bookingDate) {
                    alert('Please select a date')
                    return
                  }
                  if (!user) {
                    alert('Please sign in to book')
                    return
                  }
                  setShowBooking(false)
                  setShowPayment(true)
                }}
                style={{ flex: 1, minWidth: '200px', padding: '14px 24px', background: '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#1f3610'}
                onMouseOut={(e) => e.target.style.background = '#2d5016'}
              >
                💳 Proceed to Payment
              </button>
              <button
                onClick={() => setShowBooking(false)}
                style={{ padding: '14px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#d1d5db'}
                onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div style={{ marginBottom: '32px' }}>
        <Reviews trailId={trail?.id} />
      </div>

      {/* Back to Trails Link */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        <Link 
          to="/trails" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, transition: 'all 0.2s', border: '2px solid #e5e7eb' }}
          onMouseOver={(e) => { e.target.style.background = '#e5e7eb'; e.target.style.borderColor = '#d1d5db'; }}
          onMouseOut={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.borderColor = '#e5e7eb'; }}
        >
          ← Back to All Trails
        </Link>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentGatewaySelector
          activity={{ id: trail.id, name: trail.name, type: 'trek' }}
          numParticipants={numParticipants}
          totalAmount={(trail?.price || 2500) * numParticipants}
          bookingDetails={{ date: bookingDate }}
          onClose={() => setShowPayment(false)}
          onSuccess={async (paymentData) => {
            try {
              // Save booking to database
              const bookingPayload = {
                trekId: trail.id,
                trekName: trail.name,
                clientName: user.name || 'Guest',
                clientEmail: user.email,
                clientPhone: user.phone || '',
                idType: 'passport',
                idNumber: '',
                participants: numParticipants,
                bookingDate: bookingDate,
                amount: (trail?.price || 2500) * numParticipants,
                paymentId: paymentData.transactionId,
                gateway: paymentData.gateway,
                status: 'confirmed'
              }
              
              const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingPayload)
              })
              
              const bookingData = await bookingResponse.json()
              
              if (!bookingResponse.ok) {
                throw new Error(bookingData.error || 'Failed to save booking')
              }
              
              // User can book same trek multiple times, so don't set isAlreadyBooked
              setShowPayment(false)
              setShowBooking(false)
              setNumParticipants(1)
              setBookingDate('')
              alert(`✅ Booking Confirmed!\n\nTrek: ${trail.name}\nDate: ${bookingDate}\nParticipants: ${numParticipants}\nAmount Paid: NPR ${((trail?.price || 2500) * numParticipants).toLocaleString()}\nPayment ID: ${paymentData.transactionId}\n\nYou can book this trek again anytime!`)
            } catch (err) {
              console.error('Error saving booking:', err)
              alert(`❌ ${err.message}`)
            }
          }}
        />
      )}
    </div>
  )
}
