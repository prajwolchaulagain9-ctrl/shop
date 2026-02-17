# Quick Reference: Key Security Changes

## Authentication Flow Changes

### Before ✗
```javascript
// Client stores JWT in localStorage
localStorage.setItem('auth_token', token);
fetch('/api/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### After ✓
```javascript
// Server sets httpOnly cookie automatically
// Client just needs credentials: 'include'
fetch('/api/admin/stats', {
  credentials: 'include'  // Cookies sent automatically
});
```

---

## Registration Flow Changes

### Before ✗
- User registers → Immediately logged in
- No email verification required

### After ✓
- User registers → Account created (unverified)
- Must verify email via OTP
- Can only login after verification

**Code**: [app/api/auth/register/route.ts](gautam-nextjs/app/api/auth/register/route.ts#L91)

---

## Order Creation Changes

### Before ✗
```javascript
// Client sends total, server trusts it
const order = { 
  items, 
  totalAmount: clientCalculatedTotal  // ⚠️ Can be manipulated
};
```

### After ✓
```javascript
// Server calculates total from catalog
const calculation = calculateOrderTotal(items);
if (Math.abs(serverTotal - clientTotal) > 1) {
  throw new Error('Price mismatch - possible manipulation');
}
// Use server total, not client total
```

**Code**: [app/api/orders/create/route.ts](gautam-nextjs/app/api/orders/create/route.ts#L20-L55)

---

## Admin Endpoints

### Before ✗
```javascript
// Payment verification - NO AUTH CHECK!
export async function PUT(req: NextRequest) {
  const { orderId, verified } = await req.json();
  // Anyone can verify payments ⚠️
}
```

### After ✓
```javascript
export async function PUT(req: NextRequest) {
  // Verify admin first
  const admin = await requireAdmin(req);
  if (!admin) {
    return forbiddenResponse();
  }
  // Now process payment verification
}
```

**Code**: [app/api/payment/verify/bank/route.ts](gautam-nextjs/app/api/payment/verify/bank/route.ts#L58-L64)

---

## Rate Limiting

### Usage
```javascript
import { checkRateLimit, getClientIp, RateLimitPresets } from '@/lib/utils/rateLimit';

const ip = getClientIp(request);
const result = checkRateLimit({
  identifier: ip,
  namespace: 'login',
  ...RateLimitPresets.LOGIN, // 5 attempts per 15 min
});

if (!result.allowed) {
  return NextResponse.json(
    { message: `Too many attempts. Try again in ${result.resetIn}s` },
    { status: 429 }
  );
}
```

**Available Presets**:
- `LOGIN`: 5 per 15 min
- `REGISTER`: 3 per hour  
- `SEND_OTP`: 3 per hour
- `VERIFY_OTP`: 5 per 15 min

**Code**: [lib/utils/rateLimit.ts](gautam-nextjs/lib/utils/rateLimit.ts)

---

## Environment Variables

### Required
```bash
MONGODB_URI=mongodb://...
JWT_SECRET=your-super-secret-key-32-chars-minimum
RESEND_API_KEY=re_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Optional (Payment Gateways)
```bash
ESEWA_MERCHANT_CODE=EPAYTEST
KHALTI_SECRET_KEY=your_key
```

**Validation**: Automatically checked on app startup via [lib/utils/validateEnv.ts](gautam-nextjs/lib/utils/validateEnv.ts)

---

## Testing Checklist

### Authentication
```bash
# Test registration flow
1. Register new user
2. Check email for OTP
3. Verify OTP
4. Login (should work now)
5. Try login before verification (should fail)
```

### Rate Limiting
```bash
# Test login rate limit
1. Try 6 incorrect login attempts
2. 6th attempt should be blocked with 429 status
3. Wait 15 minutes or test with different IP
```

### Price Validation
```bash
# Test order price validation
1. Add items to cart
2. Intercept checkout request (browser DevTools)  
3. Change totalAmount to 1
4. Submit - should be rejected with "Price mismatch"
```

### Admin Protection
```bash
# Test admin endpoints
1. Logout (clear cookies)
2. Try accessing /api/admin/stats
3. Should get 403 Forbidden
4. Login as admin - should work
```

---

## Common Issues & Solutions

### Issue: "JWT_SECRET environment variable is required"
**Solution**: Add `JWT_SECRET=your-secret-key` to `.env.local`

### Issue: Login works but immediately logged out
**Solution**: Check cookies are enabled, verify `credentials: 'include'` in fetch calls

### Issue: OTP email not received
**Solution**: 
1. Check `RESEND_API_KEY` is set
2. For development, use resend.dev test domain
3. For production, verify domain at resend.com

### Issue: Rate limit resets on server restart
**Solution**: Expected behavior with in-memory storage. Use Redis for persistence.

### Issue: Orders rejected with "Product not found"
**Solution**: Ensure product IDs in cart match IDs in [src/data/products.ts](gautam-nextjs/src/data/products.ts)

---

## Migration Notes

### Frontend Changes Needed

**AuthContext** - Remove token state:
```diff
- const [token, setToken] = useState(null);
- localStorage.setItem('auth_token', token);
+ // Cookies handled automatically
```

**API Calls** - Add credentials:
```diff
- headers: { Authorization: `Bearer ${token}` }
+ credentials: 'include'
```

**No Breaking Changes** for users - authentication still works, just more secure!

---

## Performance Tips

1. **Database Indexes**: Already added to User, Order, OTP models
2. **Rate Limit Memory**: In-memory store cleans up expired entries every 5 min
3. **Cookie Size**: httpOnly cookie is ~200 bytes (negligible)

---

## Security Best Practices Applied

✅ httpOnly cookies (prevents XSS token theft)  
✅ Secure flag in production (HTTPS only)  
✅ SameSite=lax (CSRF protection)  
✅ Short token expiry (7 days, refresh recommended)  
✅ Rate limiting (brute force protection)  
✅ Server-side validation (price integrity)  
✅ Hashed sensitive data (OTPs)  
✅ Required fields validation (data integrity)  
✅ Email verification (prevents fake accounts)  
✅ Security headers (multiple attack vectors)  

---

**Last Updated**: February 17, 2026  
**Version**: 1.0.0
