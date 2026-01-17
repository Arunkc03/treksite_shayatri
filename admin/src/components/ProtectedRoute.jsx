import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (!user) return <Navigate to="/signin" replace />
  
  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="page">
        <h2>Access Denied</h2>
        <p>You do not have admin privileges to access this page.</p>
      </div>
    )
  }
  
  return children
}
