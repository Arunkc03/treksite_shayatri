import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { activitiesAPI } from '../lib/apiClient'

export default function Activities() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookings, setBookings] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await activitiesAPI.getAll()
        setActivities(data.activities || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch activities:', err)
        setActivities([]) // Empty array if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const handleViewDetails = (activityId) => {
    // Navigate to activity detail page
    navigate(`/activities/${activityId}`)
  }

  return (
    <div className="page activities-page">
      <div className="activities-header">
        <h1>Adventure Activities</h1>
        <p>Explore exciting outdoor adventures and book your experience today!</p>
      </div>

      {error && (
        <div className="error-message" style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {loading && <p className="loading-text">Loading activities...</p>}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', margin: '20px 0' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>
            No activities available yet.
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Admin can add activities through the Admin panel.
          </p>
        </div>
      )}

      <div className="activities-grid">
        {activities.map(activity => {
          // Handle image URLs
          const isImage = activity.image && (
            activity.image.startsWith('http') || 
            activity.image.startsWith('/uploads') || 
            activity.image.includes('localhost')
          );
          let imageSrc = activity.image;
          if (activity.image && activity.image.startsWith('/uploads')) {
            imageSrc = `http://localhost:5000${activity.image}`;
          }

          return (
            <div key={activity.id} className="activity-card">
              <div className="activity-image">
                {activity.image && isImage ? (
                  <img src={imageSrc} alt={activity.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '64px', textAlign: 'center', paddingTop: '50px' }}>
                    {activity.image || '🎯'}
                  </div>
                )}
              </div>
              <div className="activity-content">
                <h3>{activity.name}</h3>
                
                <div className="activity-header-info">
                  <div className="location-badge">📍 {activity.location}</div>
                  <div className={`difficulty-badge difficulty-${activity.difficulty.toLowerCase()}`}>
                    {activity.difficulty}
                  </div>
                  {activity.price && (
                    <div style={{ background: '#2d5016', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>
                      ₨ {parseFloat(activity.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </div>

                <p className="activity-desc">{activity.description}</p>
                
                <div className="activity-details">
                  <div className="detail-section">
                    <h4>Activity Details</h4>
                    <ul className="details-list">
                      <li>
                        <span className="detail-icon">📍</span>
                        <span className="detail-text"><strong>Location:</strong> {activity.location}</span>
                      </li>
                      <li>
                        <span className="detail-icon">🔧</span>
                        <span className="detail-text"><strong>Difficulty:</strong> {activity.difficulty}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button 
                  className="book-btn"
                  onClick={() => handleViewDetails(activity.id)}
                >
                  👁️ View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
