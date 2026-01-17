# eSewa Payment Integration Setup

## Getting Your eSewa Merchant Account

### 1. Register as eSewa Merchant
- Visit: https://esewa.com.np/merchant
- Click on "Become a Merchant" or "Register"
- Fill in your business details
- Submit required documents (PAN, citizenship, business registration)
- Wait for approval (usually 2-5 business days)

### 2. Get Your Merchant Credentials
Once approved, you'll receive:
- **Merchant Code (SCD)**: Your unique merchant identifier
- **Secret Key**: For payment verification (if provided)

### 3. Configure in Your Application

#### Frontend Configuration
Edit `src/components/ESewaPayment.jsx`:
```javascript
const MERCHANT_CODE = 'YOUR_ACTUAL_MERCHANT_CODE' // Replace with your code
const USE_SANDBOX = false // Set to false for production
```

#### Backend Configuration
Edit `Gdback/.env`:
```env
ESEWA_MERCHANT_CODE=YOUR_ACTUAL_MERCHANT_CODE
ESEWA_SECRET_KEY=YOUR_SECRET_KEY_IF_PROVIDED
```

### 4. Testing eSewa Integration

#### Sandbox (Test Mode)
- URL: https://esewa.com.np/epay/test
- Merchant Code: `EPAYTEST`
- Create test account at: https://esewa.com.np
- Use sandbox mode by setting `USE_SANDBOX = true`

#### Production (Live Mode)
- URL: https://esewa.com.np/epay/main
- Use your actual merchant code
- Set `USE_SANDBOX = false`
- Ensure your return URLs are publicly accessible

### 5. Payment Flow

1. User clicks "Pay via eSewa"
2. Backend creates transaction with unique ID
3. User redirects to eSewa payment page
4. User completes payment on eSewa
5. eSewa redirects back to your success/failure URL
6. Backend verifies payment with eSewa API
7. Booking confirmed

### 6. Important URLs to Configure

- **Success URL**: Where users land after successful payment
  - Example: `https://yourdomain.com/payment-success`
  
- **Failure URL**: Where users land if payment fails
  - Example: `https://yourdomain.com/payment-failed`

### 7. eSewa Parameters

Required parameters sent to eSewa:
- `amt`: Total amount
- `psc`: Service charge (0 if not applicable)
- `pdc`: Delivery charge (0 if not applicable)
- `txAmt`: Tax amount (0 if not applicable)
- `tAmt`: Total amount (sum of above)
- `pid`: Unique product/transaction ID
- `scd`: Your merchant code
- `su`: Success return URL
- `fu`: Failure return URL

### 8. Production Checklist

- [ ] Obtained eSewa merchant account
- [ ] Received merchant code from eSewa
- [ ] Updated merchant code in frontend & backend
- [ ] Set `USE_SANDBOX = false` for production
- [ ] Tested payment flow in sandbox
- [ ] Updated return URLs to production domain
- [ ] Implemented payment verification
- [ ] Set up webhook/callback handling
- [ ] Added proper error handling
- [ ] Configured SSL certificate for secure payment

### 9. Support & Resources

- **eSewa Merchant Dashboard**: https://merchant.esewa.com.np
- **eSewa API Documentation**: Contact eSewa support
- **eSewa Support**: merchant@esewa.com.np
- **Phone**: 01-5970032, 01-5970033

### 10. Security Best Practices

1. **Never expose credentials in frontend code**
   - Use environment variables on backend
   - Frontend should only have merchant code, not secret keys

2. **Verify all payments on backend**
   - Don't trust frontend success callbacks
   - Always verify with eSewa API

3. **Use HTTPS in production**
   - eSewa requires secure connections
   - SSL certificate is mandatory

4. **Store transaction records**
   - Log all payment attempts
   - Keep transaction IDs for reconciliation

5. **Handle edge cases**
   - User closes browser mid-payment
   - Network failures
   - Duplicate payments
   - Partial refunds

## Current Configuration

**Mode**: Sandbox (Test)
**Merchant Code**: EPAYTEST (Test merchant)
**Status**: Ready for testing

To go live, replace test credentials with your actual eSewa merchant credentials.
