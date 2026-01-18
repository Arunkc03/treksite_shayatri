import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { trailsAPI, activitiesAPI, climbingAPI, uploadAPI } from '../lib/apiClient'
import ItinerariesSection from '../components/ItinerariesSection'

export default function Admin() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'trails', 'activities', 'climbing', 'destinations', 'bookings', 'reviews', 'itineraries', or 'gallery'
  const [trails, setTrails] = useState([])
  const [activities, setActivities] = useState([])
  const [climbing, setClimbing] = useState([])
  const [destinations, setDestinations] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [gallery, setGallery] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [galleryFile, setGalleryFile] = useState(null)
  const [galleryDescription, setGalleryDescription] = useState('')
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [stats, setStats] = useState({
    totalTrails: 0,
    totalActivities: 0,
    totalClimbing: 0,
    totalDestinations: 0,
    totalBookings: 0,
    totalRevenue: 0
  })
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    difficulty: 'Easy',
    length_km: '',
    description: '',
    image: '',
    lat: '',
    lng: '',
    // Activity-specific fields
    duration: '',
    price: '',
    maxParticipants: '',
    date: '',
    // Climbing-specific fields
    rockType: '',
    heightMeters: '',
    routesCount: '',
    // Destinations-specific fields
    best_season: '',
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Check if user is admin - Verify role from database (role-based access control)
  // Temporarily allow access for testing
  const isAdmin = true // user && user.role === 'admin'

  useEffect(() => {
    if (!isAdmin) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch both trails and activities for dashboard stats
        const trailsData = await trailsAPI.getAll()
        const activitiesData = await activitiesAPI.getAll()
        const climbingData = await climbingAPI.getAll()
        
        const destinationsResponse = await fetch('http://localhost:5000/api/destinations')
        const savedDestinations = await destinationsResponse.json()
        
        // Fetch bookings from API
        const bookingsResponse = await fetch('http://localhost:5000/api/bookings')
        const bookingsData = await bookingsResponse.json()
        const savedBookings = bookingsData.success ? bookingsData.bookings : []
        
        // Fetch reviews from API
        const reviewsResponse = await fetch('http://localhost:5000/api/reviews')
        const reviewsData = await reviewsResponse.json()
        const savedReviews = reviewsData.success ? reviewsData.reviews : []
        
        // Fetch gallery photos
        const galleryResponse = await fetch('http://localhost:5000/api/gallery')
        const galleryData = await galleryResponse.json()
        const galleryPhotos = galleryData.photos || []
        
        setTrails(trailsData.trails || [])
        setActivities(activitiesData.activities || [])
        setClimbing(climbingData.climbing || [])
        setDestinations(savedDestinations)
        setBookings(savedBookings)
        setReviews(savedReviews)
        setGallery(galleryPhotos)
        
        // Calculate stats
        const totalRevenue = savedBookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0)
        setStats({
          totalTrails: trailsData.trails?.length || 0,
          totalActivities: activitiesData.activities?.length || 0,
          totalClimbing: climbingData.climbing?.length || 0,
          totalDestinations: savedDestinations.length || 0,
          totalBookings: savedBookings.length,
          totalRevenue: totalRevenue
        })
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAdmin])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await uploadAPI.uploadImage(file)
      if (result.success && result.imageUrl) {
        setFormData({ ...formData, image: result.imageUrl })
        // Show preview
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreview(event.target.result)
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message)
      console.error('Upload error:', err)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'trails') {
        // Trails - same as activities
        const payload = {
          name: formData.name,
          location: formData.location,
          difficulty: formData.difficulty,
          description: formData.description,
          image: formData.image || '⛰️',
          price: formData.price ? parseFloat(formData.price) : null,
          length_km: formData.length_km ? parseFloat(formData.length_km) : null,
          lat: formData.lat ? parseFloat(formData.lat) : null,
          lng: formData.lng ? parseFloat(formData.lng) : null
        }

        if (editingId) {
          await trailsAPI.update(editingId, payload)
        } else {
          await trailsAPI.create(payload)
        }

        const data = await trailsAPI.getAll()
        setTrails(data.trails || [])
      } else if (activeTab === 'activities') {
        // Activities
        const payload = {
          name: formData.name,
          location: formData.location,
          difficulty: formData.difficulty,
          description: formData.description,
          image: formData.image || '🎯',
          price: formData.price ? parseFloat(formData.price) : null
        }

        console.log('🔹 Submitting activity payload:', payload);

        if (editingId) {
          await activitiesAPI.update(editingId, payload)
        } else {
          await activitiesAPI.create(payload)
        }

        const data = await activitiesAPI.getAll()
        setActivities(data.activities || [])
      } else if (activeTab === 'climbing') {
        // Climbing
        const payload = {
          name: formData.name,
          location: formData.location,
          difficulty: formData.difficulty,
          rockType: formData.rockType,
          heightMeters: parseFloat(formData.heightMeters),
          routesCount: parseInt(formData.routesCount),
          description: formData.description,
          image: formData.image || '🧗',
          price: formData.price ? parseFloat(formData.price) : 0,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }

        console.log('📤 Climbing Update Payload:', payload);

        if (editingId) {
          const result = await climbingAPI.update(editingId, payload)
          console.log('✅ Update Response:', result);
        } else {
          const result = await climbingAPI.create(payload)
          console.log('✅ Create Response:', result);
        }

        const data = await climbingAPI.getAll()
        console.log('📥 Refreshed Climbing Data:', data.climbing);
        setClimbing(data.climbing || [])
      } else if (activeTab === 'destinations') {
        // Destinations - save multiple images and videos as JSON arrays
        const images = formData.destinationImages || []
        const videos = formData.destinationVideos || []
        const payload = {
          name: formData.name,
          location: formData.location || '',
          best_season: formData.best_season || '',
          description: formData.description || '',
          image_url: images.length > 0 ? images[0] : '', // Main image
          images: JSON.stringify(images), // All images as JSON
          video_url: formData.video_url || '', // Main video URL
          videos: JSON.stringify(videos) // All videos as JSON
        }

        console.log('Sending destination payload:', payload)

        const url = editingId 
          ? `http://localhost:5000/api/destinations/${editingId}`
          : 'http://localhost:5000/api/destinations'
        
        const response = await fetch(url, {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Destination save error:', errorData)
          throw new Error(errorData.error || 'Failed to save destination')
        }

        const destinationsResponse = await fetch('http://localhost:5000/api/destinations')
        const destinationsData = await destinationsResponse.json()
        setDestinations(destinationsData)
      }

      // Reset form
      setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', image: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '', rockType: '', heightMeters: '', routesCount: '', best_season: '' })
      setShowForm(false)
      setEditingId(null)

      alert('Saved successfully!')
    } catch (err) {
      setError(err.message)
      console.error('Failed to save:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    if (activeTab === 'trails') {
      setFormData({
        name: item.name,
        location: item.location,
        difficulty: item.difficulty,
        length_km: item.length_km || item.length || '',
        description: item.description || '',
        image: item.image || '',
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        lat: item.lat || '',
        lng: item.lng || '',
        duration: '',
        maxParticipants: '',
        date: '',
        rockType: '',
        heightMeters: '',
        routesCount: '',
      })
    } else if (activeTab === 'activities') {
      setFormData({
        name: item.name,
        location: item.location,
        difficulty: item.difficulty,
        description: item.description || '',
        image: item.image || '🎯',
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        length_km: '',
        lat: '',
        lng: '',
        duration: '',
        maxParticipants: '',
        date: '',
        rockType: '',
        heightMeters: '',
        routesCount: '',
      })
    } else if (activeTab === 'climbing') {
      setFormData({
        name: item.name,
        location: item.location,
        difficulty: item.difficulty,
        rockType: item.rock_type || item.rockType || '',
        heightMeters: item.height_meters || item.heightMeters || '',
        routesCount: item.routes_count || item.routesCount || '',
        description: item.description || '',
        image: item.image || '',
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        lat: item.lat || '',
        lng: item.lng || '',
        length_km: '',
        duration: '',
        maxParticipants: '',
        date: '',
      })
    } else if (activeTab === 'destinations') {
      // Parse images if stored as JSON string
      let images = []
      let videos = []
      try {
        images = item.images ? JSON.parse(item.images) : (item.image_url ? [item.image_url] : [])
        videos = item.videos ? JSON.parse(item.videos) : (item.video_url ? [item.video_url] : [])
      } catch {
        images = item.image_url ? [item.image_url] : []
        videos = item.video_url ? [item.video_url] : []
      }
      
      setFormData({
        name: item.name,
        location: item.location,
        best_season: item.best_season || '',
        description: item.description || '',
        image: images.length > 0 ? images[0] : '',
        destinationImages: images,
        difficulty: '',
        length_km: '',
        lat: '',
        lng: '',
        duration: '',
        price: '',
        maxParticipants: '',
        date: '',
        rockType: '',
        heightMeters: '',
        routesCount: '',
      })
    }
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return

    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'trails') {
        await trailsAPI.delete(id)
        const data = await trailsAPI.getAll()
        setTrails(data.trails || [])
      } else if (activeTab === 'activities') {
        await activitiesAPI.delete(id)
        const data = await activitiesAPI.getAll()
        setActivities(data.activities || [])
      } else if (activeTab === 'climbing') {
        await climbingAPI.delete(id)
        const data = await climbingAPI.getAll()
        setClimbing(data.climbing || [])
      } else if (activeTab === 'destinations') {
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete destination')
        const destinationsResponse = await fetch('http://localhost:5000/api/destinations')
        const destinationsData = await destinationsResponse.json()
        setDestinations(destinationsData)
      }
      alert('Deleted successfully!')
    } catch (err) {
      setError(err.message)
      console.error('Failed to delete:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="page admin-page">
        <h1>Access Denied</h1>
        <p>You must be an admin to access this page.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '700' }}>Admin Dashboard</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>Manage your trekking platform</p>
        </div>

        {/* Client Details Modal */}
        {selectedBooking && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedBooking(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px', borderBottom: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>Client Details</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      color: '#64748b',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div style={{ padding: '24px' }}>
                {/* ID Document Photo */}
                {selectedBooking.id_document && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '16px', fontWeight: 600 }}>ID Document</h3>
                    <div style={{ 
                      width: '100%', 
                      maxHeight: '400px', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedBooking.id_document.toLowerCase().endsWith('.pdf') ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                          <a 
                            href={`http://localhost:5000${selectedBooking.id_document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '12px 24px',
                              background: '#3b82f6',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '8px',
                              display: 'inline-block',
                              fontWeight: 600
                            }}
                          >
                            View PDF Document
                          </a>
                        </div>
                      ) : (
                        <img 
                          src={`http://localhost:5000${selectedBooking.id_document}`}
                          alt="ID Document"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '16px', fontWeight: 600 }}>Booking Information</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Booking ID:</span>
                      <span style={{ color: '#1e293b' }}>#{selectedBooking.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Trek Name:</span>
                      <span style={{ color: '#1e293b', fontWeight: 600 }}>{selectedBooking.trek_name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Date:</span>
                      <span style={{ color: '#1e293b' }}>{selectedBooking.booking_date}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Participants:</span>
                      <span style={{ color: '#1e293b' }}>{selectedBooking.participants}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Amount:</span>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>NPR {parseFloat(selectedBooking.amount)?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Status:</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: selectedBooking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                        color: selectedBooking.status === 'confirmed' ? '#166534' : '#991b1b'
                      }}>
                        {selectedBooking.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '16px', fontWeight: 600 }}>Client Information</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Name:</span>
                      <span style={{ color: '#1e293b' }}>{selectedBooking.client_name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Email:</span>
                      <span style={{ color: '#1e293b' }}>{selectedBooking.client_email || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>Phone:</span>
                      <span style={{ color: '#1e293b' }}>{selectedBooking.client_phone || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>ID Type:</span>
                      <span style={{ color: '#1e293b', textTransform: 'capitalize' }}>
                        {selectedBooking.id_type ? selectedBooking.id_type.replace('_', ' ') : 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#64748b' }}>ID Number:</span>
                      <span style={{ color: '#1e293b', fontFamily: 'monospace' }}>{selectedBooking.id_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '2px solid #e5e7eb', background: '#f9fafb' }}>
                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      
        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('dashboard'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent',
              color: activeTab === 'dashboard' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('trails'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'trails' ? '#3b82f6' : 'transparent',
              color: activeTab === 'trails' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🛤️ Trails
          </button>
          <button
            onClick={() => { setActiveTab('activities'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'activities' ? '#3b82f6' : 'transparent',
              color: activeTab === 'activities' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🎯 Activities
          </button>
          <button
            onClick={() => { setActiveTab('climbing'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'climbing' ? '#3b82f6' : 'transparent',
              color: activeTab === 'climbing' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🧗 Climbing
          </button>
          <button
            onClick={() => { setActiveTab('destinations'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'destinations' ? '#3b82f6' : 'transparent',
              color: activeTab === 'destinations' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🗺️ Destinations
          </button>
          <button
            onClick={() => { setActiveTab('reviews'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'reviews' ? '#3b82f6' : 'transparent',
              color: activeTab === 'reviews' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            ⭐ Reviews
          </button>
          <button
            onClick={() => { setActiveTab('itineraries'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'itineraries' ? '#3b82f6' : 'transparent',
              color: activeTab === 'itineraries' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🗺️ Itineraries
          </button>
          <button
            onClick={() => { setActiveTab('gallery'); setShowForm(false); setEditingId(null); }}
            style={{
              padding: '12px 24px',
              background: activeTab === 'gallery' ? '#3b82f6' : 'transparent',
              color: activeTab === 'gallery' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            🖼️ Gallery
          </button>
        </div>

        {error && <div style={{ background: '#fee', padding: '16px', borderRadius: '8px', color: '#c33', marginBottom: '24px', border: '1px solid #fcc' }}>Error: {error}</div>}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'itineraries' && <ItinerariesSection activeTab={activeTab} />}
        {activeTab === 'gallery' && renderGallery()}
        
        {activeTab !== 'dashboard' && activeTab !== 'bookings' && activeTab !== 'reviews' && activeTab !== 'gallery' && activeTab !== 'itineraries' && (
          <>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ background: '#3b82f6', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px', boxShadow: '0 2px 8px rgba(59,130,246,0.3)', transition: 'all 0.3s' }}>
                + Create New {activeTab === 'trails' ? 'Trail' : activeTab === 'activities' ? 'Activity' : activeTab === 'destinations' ? 'Destination' : 'Climbing Spot'}
              </button>
            ) : (
              activeTab === 'trails' ? renderTrailForm() : activeTab === 'activities' ? renderActivityForm() : activeTab === 'destinations' ? renderDestinationForm() : renderClimbingForm()
            )}

            {activeTab === 'trails' ? renderTrailsList() : activeTab === 'activities' ? renderActivitiesList() : activeTab === 'destinations' ? renderDestinationsList() : renderClimbingList()}
          </>
        )}
      </div>
    </div>
  )

  function renderDashboard() {
    return (
      <div>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Total Trails</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{stats.totalTrails}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Trekking trails</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Total Activities</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{stats.totalActivities}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Available activities</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Climbing Spots</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{stats.totalClimbing}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Rock climbing locations</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Destinations</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{stats.totalDestinations}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Travel destinations</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Total Bookings</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{stats.totalBookings}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>All-time bookings</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Total Revenue</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>NPR {stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>All-time earnings</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b', fontSize: '18px', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('trails')}
              style={{ padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}
            >
              + Add New Trail
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              style={{ padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}
            >
              + Add New Activity
            </button>
            <button
              onClick={() => setActiveTab('trails')}
              style={{ padding: '12px 24px', background: '#fff', color: '#3b82f6', border: '2px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s' }}
            >
              View All Trails
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              style={{ padding: '12px 24px', background: '#fff', color: '#3b82f6', border: '2px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s' }}
            >
              View All Activities
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Recent Trails */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b', fontSize: '18px', fontWeight: 600 }}>Recent Trails</h3>
            {trails.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No trails added yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trails.slice(0, 5).map(trail => (
                  <div key={trail.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#1e293b' }}>{trail.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{trail.location} • {trail.difficulty}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b', fontSize: '18px', fontWeight: 600 }}>Recent Activities</h3>
            {activities.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No activities added yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', borderLeft: '3px solid #2d5016' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{activity.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{activity.location} • NPR {activity.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div style={{ marginTop: '30px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
          <h3 style={{ marginBottom: '12px', color: '#0369a1' }}>ℹ️ System Information</h3>
          <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: '1.8' }}>
            <p><strong>Admin User:</strong> {user?.email}</p>
            <p><strong>Database Status:</strong> ✅ Connected</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
  }

  function renderBookings() {
    const handleRefreshBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings')
        const data = await response.json()
        const savedBookings = data.success ? data.bookings : []
        setBookings(savedBookings)
        
        // Update stats
        const totalRevenue = savedBookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0)
        setStats(prev => ({
          ...prev,
          totalBookings: savedBookings.length,
          totalRevenue: totalRevenue
        }))
      } catch (error) {
        console.error('Error refreshing bookings:', error)
        alert('Failed to refresh bookings')
      }
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#2d5016' }}>📋 Client Bookings</h2>
          <button
            onClick={handleRefreshBookings}
            style={{
              padding: '10px 20px',
              background: '#2d5016',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Refresh Bookings
          </button>
        </div>
        
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>No bookings yet</p>
            <p style={{ fontSize: '14px', color: '#999' }}>Client bookings will appear here</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0f4ff', borderBottom: '2px solid #2d5016' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Booking ID</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Trek Name</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Client Name</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Phone</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>ID Type</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>ID Number</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Participants</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Amount</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#2d5016' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb', background: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>#{booking.id}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px', fontWeight: 600 }}>{booking.trek_name}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>{booking.client_name || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>{booking.client_email || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>{booking.client_phone || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px', textTransform: 'capitalize' }}>
                        {booking.id_type ? booking.id_type.replace('_', ' ') : 'N/A'}
                      </td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px', fontFamily: 'monospace' }}>{booking.id_number || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>{booking.booking_date}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px', textAlign: 'center' }}>{booking.participants}</td>
                      <td style={{ padding: '16px', color: '#374151', fontSize: '14px', fontWeight: 600 }}>NPR {parseFloat(booking.amount)?.toLocaleString() || 0}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                          color: booking.status === 'confirmed' ? '#166534' : '#991b1b'
                        }}>
                          {booking.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                          onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div style={{ padding: '20px', background: '#f9fafb', borderTop: '2px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#2d5016' }}>Total Bookings: </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#2d5016' }}>{bookings.length}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: '#2d5016' }}>Total Revenue: </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#2d5016' }}>
                    NPR {bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderReviews() {
    const handleApproveReview = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        })
        const data = await response.json()
        if (data.success) {
          setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r))
          alert('Review approved!')
        }
      } catch (err) {
        alert('Error approving review: ' + err.message)
      }
    }

    const handleRejectReview = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' })
        })
        const data = await response.json()
        if (data.success) {
          setReviews(reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
          alert('Review rejected!')
        }
      } catch (err) {
        alert('Error rejecting review: ' + err.message)
      }
    }

    const handleDeleteReview = async (id) => {
      if (!window.confirm('Are you sure you want to delete this review?')) return
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (data.success) {
          setReviews(reviews.filter(r => r.id !== id))
          alert('Review deleted!')
        }
      } catch (err) {
        alert('Error deleting review: ' + err.message)
      }
    }

    const handleRefreshReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews')
        const data = await response.json()
        if (data.success) {
          setReviews(data.reviews)
        }
      } catch (err) {
        alert('Error refreshing reviews: ' + err.message)
      }
    }

    const pendingCount = reviews.filter(r => r.status === 'pending').length
    const approvedCount = reviews.filter(r => r.status === 'approved').length

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 12px 0', color: '#2d5016' }}>⭐ Guest Reviews</h2>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#64748b' }}>Total: </span>
                <span style={{ fontWeight: 700, color: '#2d5016' }}>{reviews.length}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#64748b' }}>Pending: </span>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#64748b' }}>Approved: </span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{approvedCount}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefreshReviews}
            style={{
              padding: '10px 20px',
              background: '#2d5016',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Refresh Reviews
          </button>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>No reviews yet</p>
            <p style={{ fontSize: '14px', color: '#999' }}>Guest reviews will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: '#fff',
                  border: '2px solid ' + (review.status === 'pending' ? '#fbbf24' : review.status === 'approved' ? '#86efac' : '#fca5a5'),
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px', fontWeight: 700 }}>
                      {review.title}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      by <strong>{review.name}</strong> ({review.email})
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background: review.status === 'pending' ? '#fef3c7' : review.status === 'approved' ? '#dcfce7' : '#fee2e2',
                      color: review.status === 'pending' ? '#b45309' : review.status === 'approved' ? '#166534' : '#991b1b'
                    }}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '12px 0' }}>
                  {review.review}
                </p>

                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                  📍 {review.destination_id ? 'Destination' : review.trail_id ? 'Trail' : 'Activity'} | 
                  {' '}{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveReview(review.id)}
                      style={{
                        padding: '10px 16px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#059669'}
                      onMouseLeave={(e) => e.target.style.background = '#10b981'}
                    >
                      ✅ Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleRejectReview(review.id)}
                      style={{
                        padding: '10px 16px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                    >
                      ❌ Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    style={{
                      padding: '10px 16px',
                      background: '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                    onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderTrailForm() {
    return (
        <form className="trek-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Trail' : 'New Trail'}</h3>

          <div className="form-group">
            <label>Trail Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Annapurna Base Camp Trek"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Annapurna Region"
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe this trail..."
            />
          </div>

          <div className="form-group">
            <label>Price (NPR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              min="0"
              step="100"
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact || ''}
              onChange={handleInputChange}
              placeholder="e.g., +977-9841234567"
            />
          </div>

          <div className="form-group">
            <label>Trail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p style={{ color: '#666', fontSize: '14px' }}>Uploading...</p>}
            {imagePreview && (
              <div style={{ marginTop: '12px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ Image selected</p>
              </div>
            )}
            {formData.image && !imagePreview && (
              <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>✓ Image uploaded: {formData.image}</p>
            )}
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Upload a JPG, PNG, GIF, or WebP image (max 5MB)
            </small>
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Trail' : 'Create Trail'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '', contact: '', image: '' })
                setImagePreview(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
    )
  }

  function renderActivityForm() {
    return (
        <form className="trek-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Activity' : 'New Activity'}</h3>

          <div className="form-group">
            <label>Activity Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe this activity..."
            />
          </div>

          <div className="form-group">
            <label>Price (NPR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              min="0"
              step="100"
            />
          </div>

          <div className="form-group">
            <label>Activity Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p style={{ color: '#666', fontSize: '14px' }}>Uploading...</p>}
            {imagePreview && (
              <div style={{ marginTop: '12px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ Image selected</p>
              </div>
            )}
            {formData.image && !imagePreview && (
              <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>✓ Image uploaded: {formData.image}</p>
            )}
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Upload a JPG, PNG, GIF, or WebP image (max 5MB)
            </small>
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Activity' : 'Create Activity'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '', image: '' })
                setImagePreview(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
    )
  }

  function renderTrailsList() {
    return (
      <div className="treks-admin-list">
        <h3>All Trails ({trails.length})</h3>
        {loading && <p className="loading-text">Loading...</p>}
        {trails.length === 0 && !loading ? (
          <p className="no-results">No trails created yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Difficulty</th>
                <th>Price (NPR)</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trails.map(trail => {
                // Handle image URLs
                const isImage = trail.image && (
                  trail.image.startsWith('http') || 
                  trail.image.startsWith('/uploads') || 
                  trail.image.includes('localhost') ||
                  trail.image.includes('trail-')
                );
                let imageSrc = trail.image;
                if (trail.image && trail.image.startsWith('/uploads')) {
                  imageSrc = `http://localhost:5000${trail.image}`;
                }
                
                return (
                <tr key={trail.id}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {trail.image && isImage ? (
                        <img src={imageSrc} alt={trail.name} style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{trail.image || '⛰️'}</span>
                      )
                    }
                  </td>
                  <td>{trail.name}</td>
                  <td>{trail.location}</td>
                  <td>{trail.difficulty}</td>
                  <td style={{ fontWeight: 'bold', color: '#2d5016' }}>₨ {trail.price || 'Not set'}</td>
                  <td>{trail.contact || 'Not set'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(trail)} className="edit-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(trail.id)} className="delete-btn-sm">Delete</button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  function renderActivitiesList() {
    return (
      <div className="treks-admin-list">
        <h3>All Activities ({activities.length})</h3>
        {loading && <p className="loading-text">Loading...</p>}
        {activities.length === 0 && !loading ? (
          <p className="no-results">No activities created yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Difficulty</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => {
                // Handle image URLs
                const isImage = activity.image && (
                  activity.image.startsWith('http') || 
                  activity.image.startsWith('/uploads') || 
                  activity.image.includes('localhost') ||
                  activity.image.includes('activity-')
                );
                let imageSrc = activity.image;
                if (activity.image && activity.image.startsWith('/uploads')) {
                  imageSrc = `http://localhost:5000${activity.image}`;
                }

                return (
                <tr key={activity.id}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {activity.image && isImage ? (
                        <img src={imageSrc} alt={activity.name} style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{activity.image || '🎯'}</span>
                      )
                    }
                  </td>
                  <td>{activity.name}</td>
                  <td>{activity.location}</td>
                  <td>{activity.difficulty}</td>
                  <td style={{ fontWeight: 'bold', color: '#2d5016' }}>₨ {activity.price || 'Not set'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(activity)} className="edit-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(activity.id)} className="delete-btn-sm">Delete</button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  function renderClimbingForm() {
    return (
        <form className="trek-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Climbing Spot' : 'New Climbing Spot'}</h3>

          <div className="form-group">
            <label>Climbing Spot Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Eagle's Nest Crag"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Nagarjun Forest"
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
              <option value="Easy">Easy (5.1-5.7)</option>
              <option value="Moderate">Moderate (5.8-5.10)</option>
              <option value="Hard">Hard (5.11+)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Rock Type</label>
            <input
              type="text"
              name="rockType"
              value={formData.rockType}
              onChange={handleInputChange}
              placeholder="e.g., Granite, Limestone, Sandstone"
              required
            />
          </div>

          <div className="form-group">
            <label>Height (meters)</label>
            <input
              type="number"
              name="heightMeters"
              value={formData.heightMeters}
              onChange={handleInputChange}
              step="0.1"
              placeholder="e.g., 25"
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Routes</label>
            <input
              type="number"
              name="routesCount"
              value={formData.routesCount}
              onChange={handleInputChange}
              min="1"
              placeholder="e.g., 15"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (NPR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 3000"
              min="0"
              step="100"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe the climbing spot, approach, and notable features..."
              required
            />
          </div>

          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              step="0.000001"
              placeholder="e.g., 27.7172"
              required
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleInputChange}
              step="0.000001"
              placeholder="e.g., 85.3240"
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Coordinates for map location
            </small>
          </div>

          <div className="form-group">
            <label>Image/Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p style={{ color: '#3465c5', fontSize: '14px', marginTop: '8px' }}>⏳ Uploading image...</p>}
            {(imagePreview || formData.image) && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                <img 
                  src={imagePreview || formData.image} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>✓ Image selected</p>
              </div>
            )}
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Upload a JPG, PNG, GIF, or WebP image (max 5MB)
            </small>
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Climbing Spot' : 'Create Climbing Spot'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', image: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '', rockType: '', heightMeters: '', routesCount: '' })
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
    )
  }

  function renderClimbingList() {
    return (
      <div className="treks-admin-list">
        <h3>All Climbing Spots ({climbing.length})</h3>
        {loading && <p className="loading-text">Loading...</p>}
        {climbing.length === 0 && !loading ? (
          <p className="no-results">No climbing spots added yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Difficulty</th>
                <th>Rock Type</th>
                <th>Height (m)</th>
                <th>Routes</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {climbing.map(spot => {
                // Handle image URLs
                const isImage = spot.image && (
                  spot.image.startsWith('http') || 
                  spot.image.startsWith('/uploads') || 
                  spot.image.includes('localhost')
                );
                let imageSrc = spot.image;
                if (spot.image && spot.image.startsWith('/uploads')) {
                  imageSrc = `http://localhost:5000${spot.image}`;
                }
                
                return (
                <tr key={spot.id}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {spot.image && isImage ? (
                        <img src={imageSrc} alt={spot.name} style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{spot.image || '🧗'}</span>
                      )
                    }
                  </td>
                  <td>{spot.name}</td>
                  <td>{spot.location}</td>
                  <td>{spot.difficulty}</td>
                  <td>{spot.rock_type || spot.rockType}</td>
                  <td>{spot.height_meters || spot.heightMeters}</td>
                  <td>{spot.routes_count || spot.routesCount}</td>
                  <td style={{ fontWeight: 'bold', color: '#2d5016' }}>₨ {spot.price ? parseFloat(spot.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Not set'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(spot)} className="edit-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(spot.id)} className="delete-btn-sm">Delete</button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  function renderDestinationForm() {
    const destinationImages = formData.destinationImages || []
    const canAddMore = destinationImages.length < 6

    const handleMultipleImageUpload = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length + destinationImages.length > 6) {
        alert('You can upload maximum 6 images')
        return
      }

      setUploadingImage(true)
      try {
        const uploadedUrls = []
        for (const file of files) {
          const formData = new FormData()
          formData.append('image', file)

          const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) throw new Error('Upload failed')
          const data = await response.json()
          uploadedUrls.push(data.imageUrl)
        }

        setFormData(prev => ({
          ...prev,
          destinationImages: [...(prev.destinationImages || []), ...uploadedUrls],
          image: uploadedUrls[0] // Set first image as main image
        }))
      } catch (error) {
        alert('Failed to upload images: ' + error.message)
      } finally {
        setUploadingImage(false)
      }
    }

    const removeImage = (indexToRemove) => {
      const updatedImages = destinationImages.filter((_, index) => index !== indexToRemove)
      setFormData(prev => ({
        ...prev,
        destinationImages: updatedImages,
        image: updatedImages.length > 0 ? updatedImages[0] : ''
      }))
    }

    const handleVideoUpload = async (e) => {
      const files = Array.from(e.target.files || [])
      if (files.length + (formData.destinationVideos || []).length > 3) {
        alert('Maximum 3 videos allowed')
        return
      }

      setUploadingImage(true)
      try {
        const uploadedUrls = []
        for (const file of files) {
          const formDataUpload = new FormData()
          formDataUpload.append('file', file)

          const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formDataUpload
          })

          if (!response.ok) throw new Error('Upload failed')
          const data = await response.json()
          uploadedUrls.push(data.url)
        }

        setFormData(prev => ({
          ...prev,
          destinationVideos: [...(prev.destinationVideos || []), ...uploadedUrls],
        }))
      } catch (error) {
        alert('Error uploading videos: ' + error.message)
        console.error('Upload error:', error)
      } finally {
        setUploadingImage(false)
      }
    }

    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>🏔️</div>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: 700 }}>{editingId ? 'Edit' : 'Add New'} Destination</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Create stunning destination showcases with multiple images</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Basic Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px', letterSpacing: '0.3px' }}>
                  📍 Destination Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Everest Base Camp"
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px', letterSpacing: '0.3px' }}>
                  🌍 Location <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Solukhumbu, Nepal"
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px', letterSpacing: '0.3px' }}>
                  🌤️ Best Season
                </label>
                <input
                  type="text"
                  name="best_season"
                  value={formData.best_season}
                  onChange={handleInputChange}
                  placeholder="e.g., Spring & Autumn"
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Image Gallery Section */}
            <div style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', padding: '24px', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📸 Image Gallery
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', background: '#e2e8f0', padding: '2px 10px', borderRadius: '12px' }}>
                      {destinationImages.length}/6 images
                    </span>
                  </h4>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Upload 4-6 high-quality images (JPG, PNG, WebP)</p>
                </div>
                {canAddMore && (
                  <label style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '10px', cursor: uploadingImage ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(102,126,234,0.4)', transition: 'all 0.3s' }}>
                    {uploadingImage ? '⏳ Uploading...' : '+ Add Images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImageUpload}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Image Grid */}
              {destinationImages.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {destinationImages.map((url, index) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
                      <img 
                        src={url.startsWith('http') ? url : `http://localhost:5000${url}`} 
                        alt={`Destination ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {index === 0 && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                          ⭐ Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.95)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        ×
                      </button>
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.75)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
                  <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No images uploaded yet</p>
                  <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Click "Add Images" to upload 4-6 stunning photos</p>
                </div>
              )}

              {destinationImages.length < 4 && destinationImages.length > 0 && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <p style={{ margin: 0, color: '#92400e', fontSize: '13px', fontWeight: 500 }}>
                    Recommended: Upload at least 4 images for best showcase
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px', letterSpacing: '0.3px' }}>
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                placeholder="Describe the destination, what makes it special, key highlights..."
                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>💡 Tip: Include key attractions and travel tips</span>
                <span>{formData.description.length} characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '2px solid #f1f5f9' }}>
              <button 
                type="submit" 
                disabled={loading || destinationImages.length === 0}
                style={{ 
                  flex: 1,
                  background: destinationImages.length === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  padding: '16px 32px', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  cursor: destinationImages.length === 0 ? 'not-allowed' : 'pointer', 
                  boxShadow: destinationImages.length === 0 ? 'none' : '0 6px 20px rgba(102,126,234,0.4)',
                  transition: 'all 0.3s',
                  letterSpacing: '0.5px'
                }}
              >
                {loading ? '⏳ Saving...' : editingId ? '✓ Update Destination' : '✓ Create Destination'}
              </button>
              <button 
                type="button" 
                onClick={() => { 
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ ...formData, destinationImages: [], image: '' })
                }} 
                style={{ background: '#f1f5f9', color: '#64748b', padding: '16px 32px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  function renderDestinationsList() {
    return (
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: 700 }}>All Destinations</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>{destinations.length} amazing destinations</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}>
            🏔️ {destinations.length}
          </div>
        </div>
        
        {loading && <p style={{ color: '#64748b', textAlign: 'center', padding: '60px', fontSize: '16px' }}>⏳ Loading destinations...</p>}
        
        {destinations.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>🗺️</div>
            <p style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>No destinations yet</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Start by adding your first amazing destination!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {destinations.map(dest => {
              // Parse images from JSON or use single image
              let images = []
              try {
                images = dest.images ? JSON.parse(dest.images) : (dest.image_url ? [dest.image_url] : [])
              } catch {
                images = dest.image_url ? [dest.image_url] : []
              }

              return (
                <div key={dest.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'all 0.3s', cursor: 'pointer', border: '2px solid transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)'
                    e.currentTarget.style.borderColor = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}>
                  
                  {/* Image Gallery */}
                  <div style={{ position: 'relative', height: '220px', background: '#f1f5f9' }}>
                    {images.length > 0 ? (
                      <>
                        <img 
                          src={images[0].startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`} 
                          alt={dest.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {images.length > 1 && (
                          <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                            {images.slice(1, 4).map((img, idx) => (
                              <div key={idx} style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                            {images.length > 4 && (
                              <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                +{images.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                        🗺️
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📸 {images.length} {images.length === 1 ? 'photo' : 'photos'}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '20px', fontWeight: 700 }}>{dest.name}</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {dest.location}
                      </span>
                    </div>

                    {dest.best_season && (
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                          🌤️ {dest.best_season}
                        </span>
                      </div>
                    )}

                    {dest.description && (
                      <p style={{ margin: '12px 0 16px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <button 
                        onClick={() => handleEdit(dest)} 
                        style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(102,126,234,0.3)' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)} 
                        style={{ flex: 1, background: '#fef2f2', color: '#ef4444', padding: '10px 16px', border: '2px solid #fee2e2', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#ef4444'
                          e.target.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fef2f2'
                          e.target.style.color = '#ef4444'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  function renderGallery() {
    const handleGalleryUpload = async (e) => {
      const file = e.target.files[0]
      if (!file) {
        console.log('No file selected')
        return
      }

      console.log('Starting upload for:', file.name, file.size, file.type)
      setUploadingGallery(true)
      try {
        const formDataUpload = new FormData()
        formDataUpload.append('photo', file)
        formDataUpload.append('description', galleryDescription)
        formDataUpload.append('user_id', 1) // Default user ID

        console.log('FormData created, sending to http://localhost:5000/api/gallery')
        const response = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          body: formDataUpload
        })

        console.log('Response received:', response.status, response.statusText)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Upload successful, data:', data)
        setGallery([data, ...gallery])
        setGalleryFile(null)
        setGalleryDescription('')
        alert('✅ Photo uploaded successfully!')
      } catch (error) {
        console.error('Gallery upload error:', error)
        alert('❌ Error uploading photo: ' + error.message)
      } finally {
        setUploadingGallery(false)
      }
    }

    const handleDeleteGalleryPhoto = async (photoId) => {
      if (!window.confirm('Delete this photo?')) return

      try {
        const response = await fetch(`http://localhost:5000/api/gallery/${photoId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete photo')
        }

        setGallery(gallery.filter(photo => photo.id !== photoId))
        alert('Photo deleted successfully!')
      } catch (error) {
        alert('Error deleting photo: ' + error.message)
      }
    }

    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ color: '#2d5016', marginBottom: '24px', fontSize: '28px', fontWeight: 700 }}>🖼️ Gallery Management</h2>

        {/* Upload Section */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px' }}>
            <h3 style={{ color: '#2d5016', marginBottom: '20px', fontSize: '20px', fontWeight: 600 }}>📸 Add New Photo</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
                  Select Photo <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="file"
                  key={uploadingGallery ? 'uploading' : 'ready'}
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: uploadingGallery ? 'not-allowed' : 'pointer' }}
                />
                {uploadingGallery && <p style={{ color: '#3b82f6', fontSize: '14px', marginTop: '8px' }}>⏳ Uploading photo...</p>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  placeholder="Add a caption or description..."
                  disabled={uploadingGallery}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit', resize: 'vertical', opacity: uploadingGallery ? 0.5 : 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          <h3 style={{ color: '#2d5016', marginBottom: '16px', fontSize: '20px', fontWeight: 600 }}>All Photos ({gallery.length})</h3>
          
          {gallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📸</div>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>No photos in gallery yet</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Upload photos to showcase your adventures</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {gallery.map(photo => (
                <div 
                  key={photo.id} 
                  style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ height: '150px', overflow: 'hidden', background: '#f0f4ff' }}>
                    <img 
                      src={photo.photo_url.startsWith('http') ? photo.photo_url : `http://localhost:5000${photo.photo_url}`}
                      alt="Gallery" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '12px' }}>
                    {photo.description && (
                      <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                        {photo.description.length > 60 ? photo.description.substring(0, 60) + '...' : photo.description}
                      </p>
                    )}
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>
                      {new Date(photo.created_at).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#ef4444'
                        e.target.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#fee2e2'
                        e.target.style.color = '#ef4444'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}