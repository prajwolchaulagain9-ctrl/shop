# Checkout & Payment System Documentation

## Overview
This system provides a complete checkout and payment flow with support for multiple payment methods:
- Cash on Delivery (COD)
- eSewa (Nepal's digital wallet)
- Khalti (Nepal's digital wallet)
- Bank Transfer

## System Flow

### 1. Shopping Cart (localStorage)
- Items are stored locally in the browser
- No database interaction until checkout
- Cart persists across page reloads
- Users can add, update, remove items

### 2. Checkout Process
When user clicks "Proceed to Checkout":
1. Redirected to `/checkout` page
2. Fill in delivery information:
   - Full Name (required)
   - Email (optional)
   - Phone Number (required)
   - Delivery Address (required)
3. Select payment method
4. Place order

### 3. Payment Processing

#### Cash on Delivery (COD)
- Order is created immediately in database
- Payment status: `verified`
- Order status: `pending`
- User sees success page
- Cart is cleared

#### eSewa Payment
1. Order created with payment status: `pending`
2. User redirected to eSewa payment gateway
3. After payment:
   - Success → Redirected to `/api/payment/verify/esewa?q=su&oid={orderId}&refId={refId}`
   - Failure → Redirected to `/api/payment/verify/esewa?q=fu&oid={orderId}`
4. System verifies payment with eSewa server
5. On verification success:
   - Payment status: `verified`
   - Order status: `processing`
   - Redirect to `/payment/success?orderId={orderId}`
6. On failure:
   - Payment status: `failed`
   - Redirect to `/payment/failed?reason=verification_failed`

#### Khalti Payment
1. System initiates payment with Khalti API
2. Receives payment URL from Khalti
3. User redirected to Khalti payment page
4. After payment, Khalti redirects to `/api/payment/verify/khalti?pidx={pidx}&...`
5. System verifies with Khalti server
6. Updates order accordingly
7. Redirects to success/failure page

#### Bank Transfer
1. Order created with payment status: `pending`
2. User redirected to `/payment/bank?orderId={orderId}`
3. Bank details displayed with copy buttons
4. User makes manual bank transfer
5. User enters transaction ID
6. Submits to `/api/payment/verify/bank` (POST)
7. Order awaits admin verification
8. Admin can verify using PUT `/api/payment/verify/bank`

## Database Schema

### Order Model
```typescript
{
  userId?: string,              // Optional, for logged-in users
  sessionId: string,            // Session identifier
  items: [                      // Array of order items
    {
      productId: string,
      name: string,
      price: string,
      image: string,
      quantity: number
    }
  ],
  totalAmount: number,          // Total order amount
  paymentMethod: 'cod' | 'esewa' | 'khalti' | 'bank',
  paymentStatus: 'pending' | 'verified' | 'failed',
  transactionId?: string,       // Payment gateway transaction ID
  customerDetails: {
    name: string,
    email?: string,
    phone: string,
    address: string
  },
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Order Management
- `POST /api/orders/create` - Create order (used for COD)
- `GET /api/orders/[orderId]` - Get order details

### Payment
- `POST /api/payment/initiate` - Initiate online payment (eSewa, Khalti, Bank)
- `GET /api/payment/verify/esewa` - eSewa payment callback
- `GET /api/payment/verify/khalti` - Khalti payment callback
- `POST /api/payment/verify/bank` - Submit bank transfer details
- `PUT /api/payment/verify/bank` - Admin verify bank transfer

### Cart (Legacy - now using localStorage)
- `GET /api/cart` - Fetch cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/confirm` - Confirm cart (deprecated)

## Pages

### User Pages
- `/checkout` - Checkout page with forms and payment selection
- `/payment/success` - Payment success page
- `/payment/failed` - Payment failure page
- `/payment/bank` - Bank transfer instructions
- `/orders/[orderId]` - Order details page

## Environment Variables

Required environment variables (see `.env.example`):

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Base URL for callbacks
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# eSewa
ESEWA_MERCHANT_CODE=EPAYTEST  # Use production code for live

# Khalti
KHALTI_PUBLIC_KEY=your_khalti_public_key
KHALTI_SECRET_KEY=your_khalti_secret_key
```

## Payment Gateway Setup

### eSewa
1. Register at https://esewa.com.np/
2. Get merchant code
3. For testing, use `EPAYTEST`
4. For production, use your merchant code
5. Test URL: https://uat.esewa.com.np/epay/main
6. Production URL: https://esewa.com.np/epay/main

### Khalti
1. Register at https://khalti.com/
2. Create app in merchant dashboard
3. Get public and secret keys
4. Configure return URL
5. Test URL: https://khalti.com/api/v2/
6. Use test keys for development

### Bank Transfer
1. Configure your bank details in `/app/payment/bank/page.tsx`
2. Update the `bankDetails` object:
   ```typescript
   const bankDetails = {
     bankName: 'Your Bank Name',
     accountName: 'Your Store Name',
     accountNumber: '1234567890',
     branchName: 'Main Branch',
   };
   ```

## Testing the System

### 1. Test COD
1. Add items to cart
2. Go to checkout
3. Fill in delivery details
4. Select "Cash on Delivery"
5. Place order
6. Should see success page
7. Check database - order should have:
   - `paymentStatus: 'verified'`
   - `paymentMethod: 'cod'`

### 2. Test eSewa
1. Use test merchant code `EPAYTEST`
2. After redirecting to eSewa:
   - Success: Click "Success" button
   - Failure: Click "Failure" button
3. Verify redirects work correctly

### 3. Test Khalti
1. Use test credentials from Khalti dashboard
2. Use test card numbers provided by Khalti
3. Complete payment flow

### 4. Test Bank Transfer
1. Select bank payment
2. View bank details page
3. Submit dummy transaction ID
4. Order should be pending verification

## Admin Tasks

### Verifying Bank Transfers
Use PUT request to verify:
```bash
curl -X PUT http://localhost:3000/api/payment/verify/bank \
  -H "Content-Type: application/json" \
  -d '{"orderId": "ORDER_ID", "verified": true}'
```

## Security Considerations

1. **Payment Verification**: Always verify payments on server-side
2. **Environment Variables**: Never expose secret keys to client
3. **Order Validation**: Validate order data before saving
4. **Session Management**: Use secure session cookies
5. **HTTPS**: Use HTTPS in production for payment redirects

## Troubleshooting

### Payment Gateway Returns Error
- Check environment variables
- Verify merchant codes/keys
- Check callback URLs match configuration

### Order Not Created
- Check MongoDB connection
- Verify all required fields are provided
- Check console for validation errors

### Bank Transfer Not Working
- Ensure transaction ID is provided
- Check if order exists in database
- Verify payment method is 'bank'

## Future Enhancements

1. Email notifications for orders
2. SMS notifications via Twilio/SNS
3. Admin dashboard for order management
4. Order tracking system
5. Invoice generation
6. Multiple shipping addresses
7. Promo codes and discounts
8. Inventory management
9. Return and refund system
10. Customer order history page
