import React from 'react'
import RazorpayPayment from './RazorpayPayment'

export default function PaymentGatewaySelector({ activity, numParticipants, totalAmount, onClose, onSuccess }) {
  return (
    <RazorpayPayment
      activity={activity}
      numParticipants={numParticipants}
      totalAmount={totalAmount}
      onClose={onClose}
      onBack={onClose}
      onSuccess={onSuccess}
    />
  )
}
