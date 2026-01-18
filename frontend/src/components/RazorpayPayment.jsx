import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RazorpayPayment({ activity, numParticipants, totalAmount, onClose, onBack, onSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load Razorpay script
      const res = await loadRazorpay()
      if (!res) {
        setError('Failed to load payment gateway')
        setLoading(false)
        return
      }

      // Create order on backend
      const orderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convert to paise (cents)
          activityId: activity.id,
          activityName: activity.name,
          numParticipants: numParticipants,
          userEmail: user?.email || 'guest@example.com',
          userName: user?.name || 'Guest User'
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay checkout
      const options = {
        key: 'rzp_test_1IfVUUFbuB1gWF', // Razorpay Test Key ID
        amount: Math.round(totalAmount * 100),
        currency: 'USD',
        name: 'Orophiletrek Adventures',
        description: `${activity.name} - ${numParticipants} participant(s)`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                activityId: activity.id,
                numParticipants: numParticipants
              })
            })

            if (verifyResponse.ok) {
              onSuccess()
              onClose()
            } else {
              setError('Payment verification failed')
            }
          } catch (err) {
            setError('Payment verification error: ' + err.message)
          }
          setLoading(false)
        },
        prefill: {
          email: user?.email || '',
          contact: '9876543210'
        },
        theme: {
          color: '#2d5016'
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Razorpay Payment</h2>

        <div className="payment-details">
          <div className="detail-row">
            <span>Activity:</span>
            <span>{activity.name}</span>
          </div>
          <div className="detail-row">
            <span>Participants:</span>
            <span>{numParticipants}</span>
          </div>
          <div className="detail-row">
            <span>Price per person:</span>
            <span>${activity.price}</span>
          </div>
          <div className="detail-row total">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="payment-info">
          <p className="sandbox-notice">
            🔒 Using Razorpay Test Mode - No actual payment will be charged
          </p>
        </div>

        <div className="payment-actions">
          <button 
            className="pay-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Redirecting to Razorpay...' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
          <button 
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
