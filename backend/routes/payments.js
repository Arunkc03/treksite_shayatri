const express = require('express')
const crypto = require('crypto')
const axios = require('axios')
const router = express.Router()

// Razorpay credentials - Replace with your actual credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1IfVUUFbuB1gWF'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'bYPPLfVc1IK0qpBvRZLbXp6m'

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, activityId, activityName, numParticipants, userEmail, userName } = req.body

    // Create order via Razorpay API
    const orderResponse = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amount, // Amount in paise
        currency: 'USD',
        receipt: `receipt_${Date.now()}`,
        notes: {
          activityId,
          activityName,
          numParticipants,
          userEmail,
          userName
        }
      },
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET
        }
      }
    )

    res.json({
      orderId: orderResponse.data.id,
      amount: orderResponse.data.amount,
      currency: orderResponse.data.currency
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Verify Razorpay Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, activityId, numParticipants, gateway } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' })
    }

    // Payment verified successfully
    // TODO: Save booking to database with payment details
    res.json({
      success: true,
      message: 'Razorpay payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      activityId,
      numParticipants,
      gateway: 'razorpay'
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

module.exports = router

