import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { sosAPI } from '../lib/apiClient'

export default function EmergencySOS() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [sosId, setSosId] = useState(null)
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: '', phone: '', email: '' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const watchId = React.useRef(null)

  // Handle emergency contact input changes
  const handleContactChange = (index, field, value) => {
    const newContacts = [...emergencyContacts]
    newContacts[index][field] = value
    setEmergencyContacts(newContacts)
  }

  const addContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '', email: '' }])
  }

  const removeContact = (index) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index))
  }

  // Initiate SOS
  const handleInitiateSOS = async () => {
    if (!emergencyContacts.some(c => c.phone || c.email)) {
      alert('Please add at least one emergency contact')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // When backend is ready, uncomment:
      // const session = await sosAPI.initiateSOS(emergencyContacts)
      // setSosId(session.id)

      setIsActive(true)

      // Start tracking location
      if (navigator.geolocation) {
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setCurrentLocation({ lat: latitude, lng: longitude })

            // Send location to backend
            if (sosId) {
              // sosAPI.updateLocation(sosId, latitude, longitude)
              //   .catch(err => console.error('Failed to update location:', err))
            }
          },
          (error) => {
            console.error('Geolocation error:', error)
            setError('Unable to access location')
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to initiate SOS:', err)
    } finally {
      setLoading(false)
    }
  }

  // Cancel SOS
  const handleCancelSOS = async () => {
    if (!window.confirm('Cancel SOS and stop sharing location?')) return

    setLoading(true)
    setError(null)
    try {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current)
      }

      // When backend is ready, uncomment:
      // if (sosId) {
      //   await sosAPI.cancelSOS(sosId)
      // }

      setIsActive(false)
      setSosId(null)
      setCurrentLocation(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to cancel SOS:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sos-section">
      <h2>Emergency SOS — Share Your Location</h2>
      <p className="sos-description">
        Activate SOS to share your live location with emergency contacts. Use only in emergencies.
      </p>

      {error && <p className="error-text">Error: {error}</p>}

      {!isActive ? (
        <div className="sos-setup">
          <h3>Emergency Contacts</h3>
          <div className="contacts-list">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="contact-form">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={contact.name}
                  onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contact.email}
                  onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                />
                {emergencyContacts.length > 1 && (
                  <button
                    onClick={() => removeContact(idx)}
                    className="remove-btn"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addContact} className="add-contact-btn" type="button">
            + Add Another Contact
          </button>

          <button
            onClick={handleInitiateSOS}
            disabled={loading}
            className="sos-activate-btn"
          >
            {loading ? 'Activating SOS...' : '🚨 Activate SOS'}
          </button>
        </div>
      ) : (
        <div className="sos-active">
          <div className="sos-status">
            <span className="sos-badge">🚨 SOS ACTIVE</span>
            <p className="status-text">Your location is being shared with emergency contacts in real-time</p>
          </div>

          {currentLocation && (
            <div className="live-location">
              <p><strong>Current Location:</strong></p>
              <p>
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
              <p className="location-link">
                <a
                  href={`https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </p>
            </div>
          )}

          <div className="contacts-notified">
            <p><strong>Contacts Notified:</strong></p>
            <ul>
              {emergencyContacts.map((contact, idx) => (
                <li key={idx}>
                  {contact.name} {contact.phone && `(${contact.phone})`}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCancelSOS}
            disabled={loading}
            className="sos-cancel-btn"
          >
            {loading ? 'Canceling...' : 'Cancel SOS'}
          </button>
        </div>
      )}
    </div>
  )
}
