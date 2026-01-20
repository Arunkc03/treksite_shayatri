import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { itinerariesAPI } from '../lib/apiClient'

export default function ItineraryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true)
        const response = await itinerariesAPI.getById(id)
        if (response.success) {
          // Convert database format to frontend format
          const data = response.itinerary
          const priceValue = typeof data.price === 'string' ? parseFloat(data.price) : data.price
          setItinerary({
            id: data.id,
            title: data.title,
            description: data.description,
            duration: `${data.duration_days} Days`,
            difficulty: data.difficulty,
            price: `₨${priceValue.toLocaleString()}`,
            image: data.image,
            location: data.location,
            bestSeason: data.best_season,
            overview: data.description,
            highlights: Array.isArray(data.highlights) ? data.highlights : [],
            dayByDay: Array.isArray(data.dayByDayPlan) ? data.dayByDayPlan : [],
            whatToInclude: Array.isArray(data.includes) ? data.includes : [],
            whatToPack: Array.isArray(data.excludes) ? data.excludes : [], // Note: using excludes as packing list
            importantNotes: ['Contact us for more details']
          })
        } else {
          setError('Itinerary not found')
        }
      } catch (err) {
        console.error('Error fetching itinerary:', err)
        setError(err.message || 'Failed to load itinerary')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchItinerary()
    }
  }, [id])

  if (loading) {
    return (
      <div className="page" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading itinerary...</p>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="page" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error || 'Itinerary not found'}</p>
        <button
          onClick={() => navigate('/itineraries')}
          style={{
            padding: '10px 20px',
            background: '#2d5016',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Itineraries
        </button>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding: '40px 20px', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/itineraries')}
          style={{
            padding: '8px 16px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back to Itineraries
        </button>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            display: itinerary.image && itinerary.image.startsWith('http') ? 'none' : 'block'
          }}>
            {itinerary.image && !itinerary.image.startsWith('http') ? itinerary.image : ''}
          </div>

          {itinerary.image && itinerary.image.startsWith('http') && (
            <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img 
                src={itinerary.image} 
                alt={itinerary.title}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', height: 'clamp(200px, 50vw, 400px)' }}
              />
            </div>
          )}

          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, color: '#2d5016', marginBottom: '16px' }}>
            {itinerary.title}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Duration</p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{itinerary.duration}</p>
            </div>
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Difficulty</p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{itinerary.difficulty}</p>
            </div>
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Location</p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#2d5016' }}>{itinerary.location}</p>
            </div>
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Price</p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#d4a574' }}>{itinerary.price}</p>
            </div>
          </div>

          <div style={{ background: '#fff4e6', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #d4a574' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Best Season</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{itinerary.bestSeason}</p>
          </div>
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Overview</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563', marginBottom: '20px' }}>
            {itinerary.overview}
          </p>
        </section>

        {itinerary.highlights && itinerary.highlights.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Highlights</h2>
            <ul style={{ marginLeft: '24px' }}>
              {itinerary.highlights.map((highlight, idx) => (
                <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '15px' }}>
                  ✓ {highlight}
                </li>
              ))}
            </ul>
          </section>
        )}

        {itinerary.dayByDay && itinerary.dayByDay.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '20px' }}>Day-by-Day Itinerary</h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {itinerary.dayByDay.map((dayInfo, idx) => (
                <div key={idx} style={{ borderBottom: idx !== itinerary.dayByDay.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ background: '#2d5016', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      {dayInfo.day || idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        {dayInfo.place || dayInfo.title || `Day ${idx + 1}`}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {dayInfo.activity || dayInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          {itinerary.whatToInclude && itinerary.whatToInclude.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What's Included</h2>
              <ul style={{ marginLeft: '20px' }}>
                {itinerary.whatToInclude.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {itinerary.whatToPack && itinerary.whatToPack.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>What to Pack</h2>
              <ul style={{ marginLeft: '20px' }}>
                {itinerary.whatToPack.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                    📦 {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {itinerary.importantNotes && itinerary.importantNotes.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>Important Notes</h2>
            <ul style={{ marginLeft: '20px' }}>
              {itinerary.importantNotes.map((note, idx) => (
                <li key={idx} style={{ marginBottom: '12px', color: '#4b5563', fontSize: '14px' }}>
                  ⚠️ {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div style={{ background: 'linear-gradient(135deg, rgba(45,80,22,0.1), rgba(212,165,116,0.08))', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>Ready to Trek?</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Contact us to book this amazing trek or customize it to your needs.
          </p>
          <button
            onClick={() => navigate('/contact')}
            style={{
              padding: '12px 32px',
              background: '#2d5016',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}
