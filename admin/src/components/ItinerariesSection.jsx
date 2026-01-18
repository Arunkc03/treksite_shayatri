import React, { useState, useEffect } from 'react'

export default function ItinerariesSection({ activeTab }) {
  const [itineraries, setItineraries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_days: '',
    difficulty: 'Moderate',
    price: '',
    location: '',
    best_season: '',
    image: '🗺️',
    highlights: [],
    dayByDayPlan: [],
    includes: [],
    excludes: [],
    maxParticipants: '',
    status: 'active'
  })
  const [highlightInput, setHighlightInput] = useState('')
  const [includeInput, setIncludeInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')
  const [dayInput, setDayInput] = useState({
    day: '',
    title: '',
    description: '',
    activities: [],
    location: ''
  })
  const [activityInput, setActivityInput] = useState('')

  useEffect(() => {
    if (activeTab === 'itineraries') {
      fetchItineraries()
    }
  }, [activeTab])

  const fetchItineraries = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5000/api/itineraries')
      const data = await response.json()
      if (data.success) {
        setItineraries(data.itineraries || [])
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput]
      }))
      setHighlightInput('')
    }
  }

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const addInclude = () => {
    if (includeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includeInput]
      }))
      setIncludeInput('')
    }
  }

  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }))
  }

  const addExclude = () => {
    if (excludeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        excludes: [...prev.excludes, excludeInput]
      }))
      setExcludeInput('')
    }
  }

  const removeExclude = (index) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }))
  }

  const addDayPlan = () => {
    if (dayInput.day && dayInput.title && dayInput.description) {
      setFormData(prev => ({
        ...prev,
        dayByDayPlan: [...prev.dayByDayPlan, { ...dayInput, activities: activityInput ? [activityInput] : [] }]
      }))
      setDayInput({ day: '', title: '', description: '', activities: [], location: '' })
      setActivityInput('')
    }
  }

  const removeDayPlan = (index) => {
    setFormData(prev => ({
      ...prev,
      dayByDayPlan: prev.dayByDayPlan.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `http://localhost:5000/api/itineraries/${editingId}`
        : 'http://localhost:5000/api/itineraries'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        await fetchItineraries()
        resetForm()
        setShowForm(false)
      } else {
        setError(data.error || 'Failed to save itinerary')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleEdit = (itinerary) => {
    setFormData(itinerary)
    setEditingId(itinerary._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/itineraries/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        await fetchItineraries()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration_days: '',
      difficulty: 'Moderate',
      price: '',
      location: '',
      best_season: '',
      image: '🗺️',
      highlights: [],
      dayByDayPlan: [],
      includes: [],
      excludes: [],
      maxParticipants: '',
      status: 'active'
    })
    setEditingId(null)
    setHighlightInput('')
    setIncludeInput('')
    setExcludeInput('')
    setDayInput({ day: '', title: '', description: '', activities: [], location: '' })
    setActivityInput('')
  }

  if (activeTab !== 'itineraries') return null

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Itineraries</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : '+ Add Itinerary'}
        </button>
      </div>

      {error && <div className="error" style={{ marginBottom: '20px' }}>{error}</div>}

      {showForm && (
        <div className="trek-form" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9fbff', borderRadius: '12px' }}>
          <h3>{editingId ? 'Edit Itinerary' : 'Create New Itinerary'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Duration (Days) *</label>
                <input type="number" name="duration_days" value={formData.duration_days} onChange={handleInputChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Best Season *</label>
                <input type="text" name="best_season" value={formData.best_season} onChange={handleInputChange} placeholder="e.g., Oct-Nov, Mar-Apr" required />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Max Participants *</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                  <option>Easy</option>
                  <option>Moderate</option>
                  <option>Hard</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" />
            </div>

            <div className="form-group">
              <label>Emoji/Icon</label>
              <input type="text" name="image" value={formData.image} onChange={handleInputChange} maxLength="5" />
            </div>

            {/* Highlights */}
            <div className="form-group">
              <label>Highlights</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add highlight" />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addHighlight}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.highlights.map((h, i) => (
                  <span key={i} className="badge" style={{ background: '#e8c9a0', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {h}
                    <button type="button" onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div className="form-group">
              <label>Includes</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} placeholder="Add inclusion" />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addInclude}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.includes.map((inc, i) => (
                  <span key={i} className="badge" style={{ background: '#a8e6a1', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✓ {inc}
                    <button type="button" onClick={() => removeInclude(i)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Excludes */}
            <div className="form-group">
              <label>Excludes</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} placeholder="Add exclusion" />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addExclude}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.excludes.map((exc, i) => (
                  <span key={i} className="badge" style={{ background: '#ffcccb', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✗ {exc}
                    <button type="button" onClick={() => removeExclude(i)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Day-by-Day Plan */}
            <div className="form-group">
              <label>Day-by-Day Plan</label>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '8px' }}>
                  <input type="number" min="1" placeholder="Day" value={dayInput.day} onChange={(e) => setDayInput({...dayInput, day: e.target.value})} />
                  <input type="text" placeholder="Day Title" value={dayInput.title} onChange={(e) => setDayInput({...dayInput, title: e.target.value})} />
                  <input type="text" placeholder="Location" value={dayInput.location} onChange={(e) => setDayInput({...dayInput, location: e.target.value})} />
                </div>
                <textarea style={{ width: '100%', marginTop: '8px' }} placeholder="Day Description" rows="2" value={dayInput.description} onChange={(e) => setDayInput({...dayInput, description: e.target.value})} />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addDayPlan} style={{ marginTop: '8px' }}>Add Day</button>
              </div>
              {formData.dayByDayPlan.map((day, i) => (
                <div key={i} style={{ background: '#f0f4ff', padding: '10px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Day {day.day}: {day.title}</strong> - {day.location}
                  </div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeDayPlan(i)}>Remove</button>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Itinerary' : 'Create Itinerary'}
            </button>
          </form>
        </div>
      )}

      {loading && !showForm && <p>Loading...</p>}

      {/* Itineraries List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {itineraries.map(itinerary => (
          <div key={itinerary._id} className="admin-table" style={{ padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3>{itinerary.image} {itinerary.title}</h3>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>{itinerary.description.substring(0, 100)}...</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.9rem' }}>
                  <div><strong>Duration:</strong> {itinerary.duration_days} days</div>
                  <div><strong>Price:</strong> ₹{itinerary.price}</div>
                  <div><strong>Difficulty:</strong> {itinerary.difficulty}</div>
                  <div><strong>Location:</strong> {itinerary.location}</div>
                  <div><strong>Season:</strong> {itinerary.best_season}</div>
                  <div><strong>Max:</strong> {itinerary.maxParticipants} people</div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ background: itinerary.status === 'active' ? '#a8e6a1' : '#ffcccb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {itinerary.status}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <button className="btn btn-sm btn-accent" onClick={() => handleEdit(itinerary)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(itinerary._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {itineraries.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>No itineraries yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
