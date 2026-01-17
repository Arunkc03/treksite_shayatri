import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { activitiesAPI } from '../lib/apiClient'

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await activitiesAPI.getById(id)
        // Handle both response formats: direct activity or wrapped in activity object
        const activityData = response.activity || response
        setActivity(activityData)
        console.log('🔍 Fetched Activity:', activityData)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }
    fetchActivity()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>Loading activity...</p>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#64748b', marginBottom: '20px' }}>Activity not found</p>
          <button onClick={() => navigate('/activities')} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
            Back to Activities
          </button>
        </div>
      </div>
    )
  }

  // Handle image display
  const isImage = activity.image && (
    activity.image.startsWith('http') || 
    activity.image.startsWith('/uploads') || 
    activity.image.includes('localhost') ||
    activity.image.includes('trek-') ||
    activity.image.includes('activity-') ||
    activity.image.includes('uploads')
  );
  let imageSrc = activity.image;
  if (activity.image && activity.image.startsWith('/uploads')) {
    imageSrc = `http://localhost:5000${activity.image}`;
  }
  
  // Console log for debugging
  console.log('Activity Image Data:', { image: activity.image, isImage, imageSrc })

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/activities')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 700 }}>{activity.name}</h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {activity.location}</p>
            </div>
          </div>
          {activity.price && (
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              color: '#2d5016', 
              padding: '16px 24px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#666' }}>Price per Person</p>
              <p style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: '#2d5016' }}>₨ {parseFloat(activity.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
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
              alt={activity.name}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ fontSize: '120px', textAlign: 'center' }}>
              {activity.image || '🎯'}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div>
            {/* Details Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2d5016', marginBottom: '20px' }}>Activity Details</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {activity.difficulty && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Difficulty Level</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#2d5016' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '14px' }}>
                        {activity.difficulty}
                      </span>
                    </p>
                  </div>
                )}
                
                {activity.location && (
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>📍 {activity.location}</p>
                  </div>
                )}
              </div>

              {activity.description && (
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016', marginTop: 0, marginBottom: '12px' }}>About This Activity</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8', margin: 0, fontSize: '16px' }}>
                    {activity.description}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0369a1', marginTop: 0, marginBottom: '16px' }}>✓ What to Expect</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: '1.8' }}>
                  <li>Professional guides and safety equipment</li>
                  <li>Small group sizes for personalized experience</li>
                  <li>Flexible scheduling based on your availability</li>
                  <li>All necessary gear provided</li>
                  <li>Insurance coverage included</li>
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
              top: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: '#2d5016' }}>Ready to Book?</h3>
              
              {activity.price && (
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #0369a1', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '12px', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Price per Person</p>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#2d5016' }}>₨ {parseFloat(activity.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
              )}
              
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0f2fe' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px' }}>Activity Type</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d5016' }}>
                  {activity.difficulty} Adventure
                </p>
              </div>

              <button
                onClick={() => navigate('/contact', { state: { activityId: activity.id } })}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2d5016 0%, #1a3509 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(45,80,22,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                📧 Contact Us to Book
              </button>

              <button
                onClick={() => navigate('/activities')}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#2d5016',
                  border: '2px solid #2d5016',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff'
                }}
              >
                ← Back to Activities
              </button>

              {/* Info Box */}
              <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', color: '#92400e' }}>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
                  💡 <strong>Tip:</strong> Contact us for group discounts and custom itineraries!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
