import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function Map({
  route,
  center = [40.7128, -74.0060],
  zoom = 12,
  originAddress,
  destinationAddress,
  originCoords, // [lat, lng]
  destinationCoords, // [lat, lng]
  showUserLocation = false,
  enableSearch = false
}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersLayer = useRef(null)
  const addressRouteLayer = useRef(null)
  const [geocodeError, setGeocodeError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [destinationLocal, setDestinationLocal] = useState(null)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    // Initialize map
    map.current = L.map(mapContainer.current).setView([center[0], center[1]], zoom)

    // Add OpenStreetMap tile layer (free, no token needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 2
    }).addTo(map.current)

    // Layer groups for dynamic overlays
    markersLayer.current = L.layerGroup().addTo(map.current)
    addressRouteLayer.current = L.layerGroup().addTo(map.current)

    // Add route polyline if provided
    if (route && route.length > 0) {
      // Convert route format if needed (from [lng, lat] to [lat, lng])
      const routeLatLng = route.map(coord => {
        // If first value is between -180 and 180, assume it's [lng, lat]
        if (coord[0] >= -180 && coord[0] <= 180 && coord[1] >= -90 && coord[1] <= 90) {
          return [coord[1], coord[0]] // swap to [lat, lng]
        }
        return coord // assume already [lat, lng]
      })

      L.polyline(routeLatLng, {
        color: '#3465c5',
        weight: 4,
        opacity: 0.9,
        dashArray: '0'
      }).addTo(map.current)

      // Add start and end markers
      if (routeLatLng.length > 0) {
        L.marker(routeLatLng[0], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).addTo(map.current).bindPopup('Start Point')

        L.marker(routeLatLng[routeLatLng.length - 1], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).addTo(map.current).bindPopup('End Point')
      }

      // Fit bounds to route
      const bounds = L.latLngBounds(routeLatLng)
      map.current.fitBounds(bounds, { padding: [50, 50] })
    } else {
      // Add center marker if no route
      L.marker([center[0], center[1]]).addTo(map.current)
    }

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [route, center, zoom])

  // Geocode addresses and render origin/destination markers and a line between
  useEffect(() => {
    if (!map.current) return

    // Clear previous markers/lines from this feature
    markersLayer.current?.clearLayers()
    addressRouteLayer.current?.clearLayers()
    setGeocodeError(null)

    // Resolve coordinates from provided props
    const resolveCoords = async () => {
      // Helper to geocode a single address
      const geocode = async (q) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Orophiletrek-App/1.0 (contact: info@orophiletrek.com)'
          }
        })
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) throw new Error('Address not found')
        const { lat, lon, display_name } = data[0]
        return { lat: parseFloat(lat), lng: parseFloat(lon), label: display_name }
      }

      try {
        let origin = null
        let dest = null

        // Prefer explicit coordinates if provided
        if (Array.isArray(originCoords) && originCoords.length === 2) {
          origin = { lat: originCoords[0], lng: originCoords[1], label: 'Origin' }
        } else if (originAddress) {
          origin = await geocode(originAddress)
        } else if (userLocation) {
          origin = { lat: userLocation.lat, lng: userLocation.lng, label: 'Your Location' }
        }

        // Destination: prefer locally searched destination first
        if (destinationLocal && destinationLocal.lat && destinationLocal.lng) {
          dest = { lat: destinationLocal.lat, lng: destinationLocal.lng, label: destinationLocal.label || 'Destination' }
        } else if (Array.isArray(destinationCoords) && destinationCoords.length === 2) {
          dest = { lat: destinationCoords[0], lng: destinationCoords[1], label: 'Destination' }
        } else if (destinationAddress) {
          dest = await geocode(destinationAddress)
        }

        // If neither provided, nothing to render here
        if (!origin && !dest) return

        // Add markers
        const added = []
        const addMarker = (pt, title) => {
          if (!pt) return
          const marker = L.marker([pt.lat, pt.lng]).bindPopup(title || pt.label || '')
          marker.addTo(markersLayer.current)
          added.push([pt.lat, pt.lng])
        }

        addMarker(origin, 'Origin')
        addMarker(dest, 'Destination')

        // Draw a straight line between origin and destination if both present
        if (origin && dest) {
          const line = L.polyline(
            [ [origin.lat, origin.lng], [dest.lat, dest.lng] ],
            { color: '#16a34a', weight: 4, opacity: 0.9 }
          )
          line.addTo(addressRouteLayer.current)
        }

        // Fit bounds to show all points or center on the single marker
        if (added.length >= 2) {
          const bounds = L.latLngBounds(added)
          map.current.fitBounds(bounds, { padding: [40, 40] })
        } else if (added.length === 1) {
          map.current.setView(added[0], Math.max(zoom, 13))
        }
      } catch (err) {
        setGeocodeError(err.message)
        // No throw; keep map usable
      }
    }

    resolveCoords()
    // Only rerun when address/coord inputs change
  }, [originAddress, destinationAddress, originCoords, destinationCoords, destinationLocal, userLocation, zoom])

  // Get user's current location if requested
  useEffect(() => {
    if (!showUserLocation) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setUserLocation({ lat: latitude, lng: longitude, accuracy })
        // Draw user marker and accuracy circle on map
        if (map.current && markersLayer.current) {
          const userMarker = L.marker([latitude, longitude]).bindPopup('You are here')
          userMarker.addTo(markersLayer.current)
          if (accuracy) {
            const circle = L.circle([latitude, longitude], { radius: accuracy, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 })
            circle.addTo(markersLayer.current)
          }
        }
      },
      () => {
        // ignore errors silently
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }, [showUserLocation])

  // Search submit handler
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Orophiletrek-App/1.0 (contact: info@orophiletrek.com)'
        }
      })
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      if (!data || !data.length) throw new Error('Place not found')
      const { lat, lon, display_name } = data[0]
      setDestinationLocal({ lat: parseFloat(lat), lng: parseFloat(lon), label: display_name })
      setGeocodeError(null)
    } catch (err) {
      setGeocodeError(err.message)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {enableSearch && (
        <form onSubmit={handleSearch} style={{ position: 'absolute', zIndex: 1000, top: 10, left: 10, right: 10, display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          />
          <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none' }}>Search</button>
        </form>
      )}
      <div 
        ref={mapContainer} 
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}
      />
      {geocodeError && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: '#fff', border: '1px solid #fecaca', color: '#b91c1c', padding: '6px 10px', borderRadius: 6 }}>
          {geocodeError}
        </div>
      )}
    </div>
  )
}
