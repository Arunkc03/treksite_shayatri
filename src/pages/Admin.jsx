import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { trailsAPI, activitiesAPI, climbingAPI, uploadAPI } from '../lib/apiClient'

export default function Admin() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'treks', 'activities', or 'climbing'
  const [treks, setTraks] = useState([])
  const [activities, setActivities] = useState([])
  const [climbing, setClimbing] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalTreks: 0,
    totalActivities: 0,
    totalClimbing: 0,
    totalBookings: 0,
    totalRevenue: 0
  })
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    difficulty: 'Easy',
    length_km: '',
    elevation: '',
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
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Check if user is admin - Verify role from database (role-based access control)
  const isAdmin = user && user.role === 'admin'

  useEffect(() => {
    if (!isAdmin) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch both treks and activities for dashboard stats
        const treksData = await trailsAPI.getAll()
        const activitiesData = await activitiesAPI.getAll()
        const climbingData = await climbingAPI.getAll()
        
        setTraks(treksData.trails || [])
        setActivities(activitiesData.activities || [])
        setClimbing(climbingData.climbing || [])
        
        // Calculate stats
        setStats({
          totalTreks: treksData.trails?.length || 0,
          totalActivities: activitiesData.activities?.length || 0,
          totalClimbing: climbingData.climbing?.length || 0,
          totalBookings: 45, // Mock data - would come from bookings API
          totalRevenue: 125000 // Mock data - would come from bookings API
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
      if (activeTab === 'treks') {
        const payload = {
          name: formData.name,
          location: formData.location,
          difficulty: formData.difficulty,
          length: parseFloat(formData.length_km),
          elevation: parseFloat(formData.elevation || 0),
          description: formData.description,
          image: formData.image || '⛰️',
          price: parseFloat(formData.price) || 2500,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }

        if (editingId) {
          await trailsAPI.update(editingId, payload)
        } else {
          await trailsAPI.create(payload)
        }

        const data = await trailsAPI.getAll()
        setTraks(data.trails || [])
      } else if (activeTab === 'activities') {
        // Activities
        const payload = {
          name: formData.name,
          location: formData.location,
          difficulty: formData.difficulty,
          duration: formData.duration,
          price: parseFloat(formData.price),
          maxParticipants: parseInt(formData.maxParticipants),
          date: formData.date,
          description: formData.description
        }

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
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }

        if (editingId) {
          await climbingAPI.update(editingId, payload)
        } else {
          await climbingAPI.create(payload)
        }

        const data = await climbingAPI.getAll()
        setClimbing(data.climbing || [])
      }

      // Reset form
      setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', elevation: '', description: '', image: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '', rockType: '', heightMeters: '', routesCount: '' })
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
    if (activeTab === 'treks') {
      setFormData({
        name: item.name,
        location: item.location,
        difficulty: item.difficulty,
        length_km: item.length || item.length_km || '',
        elevation: item.elevation || '',
        description: item.description || '',
        image: item.image || '',
        price: item.price || 2500,
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
        duration: item.duration || '',
        price: item.price || '',
        maxParticipants: item.maxParticipants || '',
        date: item.date || '',
        description: item.description,
        length_km: '',
        image: '',
        lat: '',
        lng: '',
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
        lat: item.lat || '',
        lng: item.lng || '',
        length_km: '',
        duration: '',
        price: '',
        maxParticipants: '',
        date: '',
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
      if (activeTab === 'treks') {
        await trailsAPI.delete(id)
        const data = await trailsAPI.getAll()
        setTraks(data.trails || [])
      } else if (activeTab === 'activities') {
        await activitiesAPI.delete(id)
        const data = await activitiesAPI.getAll()
        setActivities(data.activities || [])
      } else if (activeTab === 'climbing') {
        await climbingAPI.delete(id)
        const data = await climbingAPI.getAll()
        setClimbing(data.climbing || [])
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
    <div className="page admin-page">
      <h1>Admin Dashboard</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => { setActiveTab('dashboard'); setShowForm(false); setEditingId(null); }}
          style={{
            padding: '12px 24px',
            background: activeTab === 'dashboard' ? '#2d5016' : 'transparent',
            color: activeTab === 'dashboard' ? '#fff' : '#666',
            border: 'none',
            borderBottom: activeTab === 'dashboard' ? '3px solid #2d5016' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('treks'); setShowForm(false); setEditingId(null); }}
          style={{
            padding: '12px 24px',
            background: activeTab === 'treks' ? '#2d5016' : 'transparent',
            color: activeTab === 'treks' ? '#fff' : '#666',
            border: 'none',
            borderBottom: activeTab === 'treks' ? '3px solid #2d5016' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          🏔️ Treks/Destinations
        </button>
        <button
          onClick={() => { setActiveTab('activities'); setShowForm(false); setEditingId(null); }}
          style={{
            padding: '12px 24px',
            background: activeTab === 'activities' ? '#2d5016' : 'transparent',
            color: activeTab === 'activities' ? '#fff' : '#666',
            border: 'none',
            borderBottom: activeTab === 'activities' ? '3px solid #2d5016' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          🎯 Activities
        </button>
        <button
          onClick={() => { setActiveTab('climbing'); setShowForm(false); setEditingId(null); }}
          style={{
            padding: '12px 24px',
            background: activeTab === 'climbing' ? '#2d5016' : 'transparent',
            color: activeTab === 'climbing' ? '#fff' : '#666',
            border: 'none',
            borderBottom: activeTab === 'climbing' ? '3px solid #2d5016' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          🧗 Climbing
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      {activeTab === 'dashboard' && renderDashboard()}
      
      {activeTab !== 'dashboard' && (
        <>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="add-trek-btn" style={{ marginBottom: '20px' }}>
              + Create New {activeTab === 'treks' ? 'Trek' : activeTab === 'activities' ? 'Activity' : 'Climbing Spot'}
            </button>
          ) : (
            activeTab === 'treks' ? renderTrekForm() : activeTab === 'activities' ? renderActivityForm() : renderClimbingForm()
          )}

          {activeTab === 'treks' ? renderTreksList() : activeTab === 'activities' ? renderActivitiesList() : renderClimbingList()}
        </>
      )}
    </div>
  )

  function renderDashboard() {
    return (
      <div>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Treks</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalTreks}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Active destinations</div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Activities</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalActivities}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Available activities</div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Climbing Spots</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalClimbing}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Rock climbing locations</div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Bookings</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>All-time bookings</div>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>NPR {stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>All-time earnings</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '16px', color: '#2d5016' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('treks')}
              style={{ padding: '12px 24px', background: '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              + Add New Trek
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              style={{ padding: '12px 24px', background: '#2d5016', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              + Add New Activity
            </button>
            <button
              onClick={() => window.location.href = '/trails'}
              style={{ padding: '12px 24px', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              View All Treks
            </button>
            <button
              onClick={() => window.location.href = '/activities'}
              style={{ padding: '12px 24px', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              View All Activities
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Recent Treks */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px', color: '#2d5016' }}>Recent Treks</h3>
            {treks.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>No treks added yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {treks.slice(0, 5).map(trek => (
                  <div key={trek.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', borderLeft: '3px solid #2d5016' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{trek.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{trek.location} • {trek.difficulty}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px', color: '#2d5016' }}>Recent Activities</h3>
            {activities.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>No activities added yet</p>
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
            <p><strong>Payment Gateway:</strong> Razorpay (Test)</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
  }

  function renderTrekForm() {
    return (
        <form className="trek-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Trek' : 'New Trek'}</h3>

          <div className="form-group">
            <label>Trek Name</label>
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
            <label>Distance (km)</label>
            <input
              type="number"
              name="length_km"
              value={formData.length_km}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label>Elevation (meters)</label>
            <input
              type="number"
              name="elevation"
              value={formData.elevation}
              onChange={handleInputChange}
              step="1"
              placeholder="e.g., 2500"
            />
          </div>

          <div className="form-group">
            <label>Price per Person (NPR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="100"
              placeholder="e.g., 2500"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Destination Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              step="0.000001"
              placeholder="e.g., 27.7172"
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Use Google Maps to find coordinates: Right-click on map → "What's here?"
            </small>
          </div>

          <div className="form-group">
            <label>Destination Longitude</label>
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
              Latitude and longitude will be used to show trail destination on map
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
              {loading ? 'Saving...' : editingId ? 'Update Trek' : 'Create Trek'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', image: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '' })
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
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 6 hours, 2 days"
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
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Available Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
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
                setFormData({ name: '', location: '', difficulty: 'Easy', length_km: '', description: '', lat: '', lng: '', duration: '', price: '', maxParticipants: '', date: '' })
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
    )
  }

  function renderTreksList() {
    return (
      <div className="treks-admin-list">
        <h3>All Treks ({treks.length})</h3>
        {loading && <p className="loading-text">Loading...</p>}
        {treks.length === 0 && !loading ? (
          <p className="no-results">No treks created yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Difficulty</th>
                <th>Distance (km)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {treks.map(trek => {
                // Handle image URLs
                const isImage = trek.image && (
                  trek.image.startsWith('http') || 
                  trek.image.startsWith('/uploads') || 
                  trek.image.includes('localhost') ||
                  trek.image.includes('trek-')
                );
                let imageSrc = trek.image;
                if (trek.image && trek.image.startsWith('/uploads')) {
                  imageSrc = `http://localhost:5000${trek.image}`;
                }
                
                return (
                <tr key={trek.id}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {trek.image && isImage ? (
                        <img src={imageSrc} alt={trek.name} style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{trek.image || '⛰️'}</span>
                      )
                    }
                  </td>
                  <td>{trek.name}</td>
                  <td>{trek.location}</td>
                  <td>{trek.difficulty}</td>
                  <td>{trek.length || trek.length_km}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(trek)} className="edit-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(trek.id)} className="delete-btn-sm">Delete</button>
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
                <th>Name</th>
                <th>Location</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Price (NPR)</th>
                <th>Max Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.name}</td>
                  <td>{activity.location}</td>
                  <td>{activity.difficulty}</td>
                  <td>{activity.duration}</td>
                  <td>{activity.price}</td>
                  <td>{activity.maxParticipants}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(activity)} className="edit-btn-sm">Edit</button>
                    <button onClick={() => handleDelete(activity.id)} className="delete-btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
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
}
