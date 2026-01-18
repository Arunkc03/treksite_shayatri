import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trailsAPI, activitiesAPI } from '../lib/apiClient'

export default function Home() {
  const navigate = useNavigate()
  const [trails, setTrails] = useState([])
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true)
      try {
        const data = await trailsAPI.getAll()
        console.log('✅ Trails fetched:', data)
        setTrails(data.trails || [])
      } catch (err) {
        console.error('❌ Failed to fetch trails:', err)
        setTrails([])
      } finally {
        setLoading(false)
      }
    }

    // Fetch activities
    const fetchActivities = async () => {
      try {
        const data = await activitiesAPI.getAll()
        console.log('✅ Activities fetched:', data)
        setActivities(data.activities || data || [])
      } catch (err) {
        console.error('❌ Failed to fetch activities:', err)
        setActivities([])
      }
    }

    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations')
        const data = await response.json()
        console.log('✅ Destinations fetched:', data)
        setDestinations(data || [])
      } catch (err) {
        console.error('❌ Failed to fetch destinations:', err)
        setDestinations([])
      }
    }
    
    fetchTrails()
    fetchActivities()
    fetchDestinations()
  }, [])

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-inner">
          <div className="intro" style={{ textAlign: 'center' }}>
            <h1>Welcome to Orophiletrek</h1>
            <p>Explore beautiful mountain trails and book your adventure today. Discover breathtaking landscapes, experience nature at its finest, and create unforgettable memories with our carefully curated trekking routes.</p>
            <a href="/trails" style={{ display: 'inline-block', padding: '14px 36px', backgroundColor: '#2d5016', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s' }}>Start Your Adventure</a>
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="activities-preview" style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)', margin: '0 calc(-50vw + 50%)', width: '100vw' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '12px', textAlign: 'center' }}>🎯 Popular Activities</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px', fontSize: '16px' }}>Experience thrilling adventures with professional guides and top-notch equipment</p>
        
        {activities.length > 0 ? (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%' }}>
              {activities.slice(0, 6).map(activity => {
                const isImage = activity.image && (
                  activity.image.startsWith('http') || 
                  activity.image.startsWith('/uploads') || 
                  activity.image.includes('localhost') ||
                  activity.image.includes('trek-') ||
                  activity.image.includes('emoji')
                );
                let imageSrc = activity.image;
                if (activity.image && activity.image.startsWith('/uploads')) {
                  imageSrc = `http://localhost:5000${activity.image}`;
                }

                return (
                  <div 
                    key={activity.id} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: '12px', 
                      background: '#fff', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                      minHeight: '100%', 
                      transition: 'transform 0.3s, box-shadow 0.3s', 
                      overflow: 'hidden', 
                      cursor: 'pointer' 
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-8px)'; 
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' 
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' 
                    }}
                  >
                    <div className="activity-image" style={{ height: '200px', overflow: 'hidden', background: '#f0f4ff' }}>
                      {isImage ? (
                        <img src={imageSrc} alt={activity.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: '64px', textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {activity.image || '🎯'}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      <div>
                        <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{activity.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                          <span>📍</span>
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      {activity.difficulty && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                            {activity.difficulty}
                          </span>
                          {activity.price && (
                            <span style={{ padding: '4px 12px', background: '#2d5016', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                              ₨ {parseFloat(activity.price).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          )}
                        </div>
                      )}
                      {activity.description && (
                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px', flex: 1 }}>
                          {activity.description.length > 80 ? activity.description.substring(0, 80) + '...' : activity.description}
                        </p>
                      )}
                      <button 
                        onClick={() => navigate(`/activities/${activity.id}`)}
                        style={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          padding: '8px 16px', 
                          background: '#2d5016', 
                          color: '#fff', 
                          borderRadius: '6px', 
                          textDecoration: 'none', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginTop: 'auto',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1a3509'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2d5016'}
                      >
                        👁️ View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {activities.length > 6 && (
              <div style={{ textAlign: 'center', padding: '40px 20px 20px', width: '100%' }}>
                <a href="/activities" style={{ display: 'inline-block', padding: '12px 32px', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 600, transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#2d5016'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2d5016' }}>View All Activities →</a>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
              No activities available yet. Check back soon!
            </p>
          </div>
        )}
      </section>
      <section className="trails-preview" style={{ padding: '60px 20px', background: '#fafbf9', margin: '0 calc(-50vw + 50%)', width: '100vw' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '16px', textAlign: 'center' }}>Featured Trails</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading trails...</p>
        ) : trails.length > 0 ? (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="trails-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%' }}>
            {trails.slice(0, 6).map(trail => {
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
                <div key={trail.id} style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minHeight: '100%', transition: 'transform 0.3s, box-shadow 0.3s', overflow: 'hidden', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}>
                  {isImage ? (
                    <img src={imageSrc} alt={trail.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '48px', textAlign: 'center', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff' }}>{trail.image || '⛰️'}</div>
                  )}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div>
                      <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{trail.name}</h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px', margin: 0 }}>{trail.location}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ padding: '4px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{trail.difficulty}</span>
                      <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#15803d', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{trail.length_km || trail.length} km</span>
                    </div>
                    <a href={`/trails/${trail.id}`} style={{ display: 'block', textAlign: 'center', padding: '8px 16px', background: '#2d5016', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginTop: 'auto' }}>View Details</a>
                  </div>
                </div>
              );
            })}
            </div>
            {trails.length > 6 && (
              <div style={{ textAlign: 'center', padding: '40px 20px 20px', width: '100%' }}>
                <a href="/trails" style={{ display: 'inline-block', padding: '12px 32px', background: '#fff', color: '#2d5016', border: '2px solid #2d5016', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}>View All Trails</a>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
              No trails available yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Destinations Section */}
      <section className="destinations-section" style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)', margin: '0 calc(-50vw + 50%)', width: '100vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '12px', textAlign: 'center' }}>🏔️ Explore Amazing Destinations</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px', fontSize: '16px' }}>Discover spectacular locations handpicked for unforgettable adventures</p>
          
          {destinations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {destinations.slice(0, 6).map((dest, idx) => {
                // Parse images from JSON if needed
                let images = []
                if (dest.images) {
                  try {
                    images = typeof dest.images === 'string' ? JSON.parse(dest.images) : dest.images
                  } catch (e) {
                    images = [dest.images]
                  }
                }
                const mainImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
                const imageUrl = mainImage && mainImage.startsWith('http') ? mainImage : `http://localhost:5000${mainImage}`

                return (
                  <div 
                    key={idx} 
                    onClick={() => navigate(`/destinations/${dest.id}`)}
                    style={{ 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      background: '#fff', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-12px)'; 
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(45,80,22,0.2)';
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                      <img 
                        src={imageUrl} 
                        alt={dest.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        top: '0', 
                        left: '0', 
                        right: '0', 
                        bottom: '0',
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                      }} />
                      <div style={{ 
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: '#2d5016',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        {images.length} {images.length === 1 ? 'photo' : 'photos'}
                      </div>
                    </div>
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d5016', marginBottom: '8px', margin: 0 }}>{dest.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#6b7280', fontSize: '14px' }}>
                        <span>📍</span>
                        <span>{dest.location}</span>
                      </div>
                      {dest.best_season && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#6b7280', fontSize: '14px' }}>
                          <span>🌍</span>
                          <span>Best: {dest.best_season}</span>
                        </div>
                      )}
                      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px', flex: 1, margin: '0 0 16px 0' }}>
                        {dest.description ? dest.description.substring(0, 100) + (dest.description.length > 100 ? '...' : '') : 'Explore this amazing destination'}
                      </p>
                      <button 
                        style={{ 
                          background: 'linear-gradient(135deg, #2d5016 0%, #1a3509 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)'
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(45,80,22,0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <p style={{ fontSize: '18px' }}>No destinations available yet. Check back soon!</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/destinations" style={{ 
              display: 'inline-block', 
              padding: '16px 40px', 
              background: 'linear-gradient(135deg, #2d5016 0%, #1a3509 100%)',
              color: '#fff', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontSize: '16px', 
              fontWeight: 700,
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(45,80,22,0.2)'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(45,80,22,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,80,22,0.2)'
            }}>
              Explore All Destinations ✨
            </a>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="blog-section" style={{ padding: '60px 20px', background: '#fff', margin: '0 calc(-50vw + 50%)', width: '100vw' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#2d5016', marginBottom: '16px', textAlign: 'center' }}>Latest from Our Blog</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Tips, guides, and stories from our trekking adventures</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '🏔️', title: 'Top 10 Trekking Tips for Beginners', excerpt: 'Essential advice for your first mountain adventure. Learn about preparation, gear, and safety.', date: 'Jan 10, 2026', category: 'Tips', content: 'Starting your trekking journey can be exciting but overwhelming. In this comprehensive guide, we cover the 10 most important tips including proper acclimatization, hydration, pacing yourself, and building endurance before your trek. We also discuss common mistakes beginners make and how to avoid them.' },
            { icon: '🎒', title: 'Essential Gear Guide for High Altitude Treks', excerpt: 'Complete checklist of equipment you need for successful high-altitude expeditions.', date: 'Jan 8, 2026', category: 'Guides', content: 'High altitude trekking requires specialized equipment to ensure your safety and comfort. Learn about the best backpacks, sleeping bags rated for cold weather, proper footwear, and layering systems. We also recommend specific brands tested by experienced trekkers and explain why each item is crucial for your expedition.' },
            { icon: '🌄', title: 'Best Time to Trek in the Himalayas', excerpt: 'Seasonal guide to planning your perfect Himalayan trekking experience.', date: 'Jan 5, 2026', category: 'Planning', content: 'Timing is everything when planning a Himalayan trek. The main trekking seasons are spring and autumn, each offering unique advantages. Discover weather patterns, temperature ranges, visibility conditions, and crowd levels for each season. Learn which trails are best during different times of year.' },
            { icon: '🧗', title: 'Rock Climbing: From Beginner to Advanced', excerpt: 'Master rock climbing techniques and build your climbing skills progressively.', date: 'Jan 3, 2026', category: 'Skills', content: 'Rock climbing is an incredible way to build strength and confidence. This guide covers the fundamentals of rock climbing, from understanding climbing grades, proper belaying techniques, rope management, and safety protocols. Explore progression routes in Nepal and how to find certified instructors for proper training.' },
            { icon: '📸', title: 'Photography Tips for Capturing Mountain Beauty', excerpt: 'Learn how to photograph stunning landscapes and wildlife during your adventures.', date: 'Dec 28, 2025', category: 'Photography', content: 'Mountains offer breathtaking photo opportunities. Master composition techniques, understand golden hour lighting, camera settings for high altitude, and how to protect your equipment in harsh conditions. Get tips on capturing candid moments with fellow trekkers and wildlife photography ethical practices.' },
            { icon: '🍽️', title: 'Nutrition and Food Safety on the Trail', excerpt: 'Stay energized and healthy with proper nutrition during multi-day treks.', date: 'Dec 24, 2025', category: 'Health', content: 'Proper nutrition is vital for trek performance. Learn about caloric needs at altitude, best portable foods, water purification methods, and preventing altitude sickness through diet. We discuss meal planning, energy management, and special dietary considerations for different trek durations and altitudes.' }
          ].map((blog, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(52,101,197,0.15)'; e.currentTarget.style.borderColor = '#d4a574' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#e5e7eb' }}>
              <div style={{ fontSize: '3rem', padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))' }}>{blog.icon}</div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ background: 'rgba(45,80,22,0.15)', color: '#2d5016', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{blog.category}</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{blog.date}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px', lineHeight: '1.4' }}>{blog.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{blog.excerpt}</p>
                <a href="/blog" style={{ color: '#2d5016', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Read More →</a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="/blog" style={{ display: 'inline-block', padding: '14px 32px', background: '#2d5016', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: '600', transition: 'background 0.3s' }}>View All Posts</a>
        </div>
      </section>
    </div>
  )
}
