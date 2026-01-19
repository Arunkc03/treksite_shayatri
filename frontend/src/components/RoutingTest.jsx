import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function RoutingTest() {
  const navigate = useNavigate()
  const location = useLocation()

  const testRoutes = [
    { path: '/', label: 'Home' },
    { path: '/trails', label: 'Trails' },
    { path: '/climbing', label: 'Climbing' },
    { path: '/activities', label: 'Activities' },
    { path: '/destinations', label: 'Destinations' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleRefreshTest = () => {
    alert(`📍 Current Route: ${location.pathname}\n\n✅ After clicking OK, press F5 to refresh.\n\nIf the page loads without 404, the fix works!`)
  }

  const handleNavigateAndTest = (path) => {
    navigate(path)
    setTimeout(() => {
      alert(`✅ Navigated to: ${path}\n\n📝 Instructions:\n1. Click OK\n2. Press F5 to refresh\n3. Should load without 404\n\nIf it works, the routing is fixed!`)
    }, 100)
  }

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      border: '2px solid #FF6B6B',
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      maxWidth: '400px',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#FF6B6B' }}>🧪 ROUTING TEST</h3>
      
      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#333' }}>
        <strong>Current Route:</strong> {location.pathname}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleRefreshTest}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            backgroundColor: '#4ECDC4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          🔄 Test Refresh Current Route
        </button>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '11px', color: '#666', fontWeight: 'bold' }}>
        Navigate & Test:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {testRoutes.map(route => (
          <button
            key={route.path}
            onClick={() => handleNavigateAndTest(route.path)}
            style={{
              padding: '8px',
              backgroundColor: location.pathname === route.path ? '#FF6B6B' : '#95E1D3',
              color: location.pathname === route.path ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {route.label}
          </button>
        ))}
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        <strong>📋 How to Test:</strong>
        <ol style={{ margin: '8px 0', paddingLeft: '18px' }}>
          <li>Click a route button</li>
          <li>Click OK in the alert</li>
          <li>Press F5 to refresh</li>
          <li>Page should load (not 404)</li>
        </ol>
      </div>
    </div>
  )
}
