# Frontend Integration Guide

## Overview
Backend security improvements require minor frontend adjustments. This guide shows exactly what needs to change.

---

## 1. Remove localStorage Token Management

### Files to Update
- Any component using `localStorage.getItem('auth_token')`
- Any component passing `token` prop to API calls

### What to Remove
```javascript
// ❌ DELETE THIS
const token = localStorage.getItem('auth_token');
localStorage.setItem('auth_token', newToken);
localStorage.removeItem('auth_token');
```

### Why
Tokens are now in httpOnly cookies (more secure, automatic).

---

## 2. Update API Calls

### Old Pattern ❌
```javascript
const response = await fetch('/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### New Pattern ✓
```javascript
const response = await fetch('/api/admin/stats', {
  credentials: 'include'  // Send cookies automatically
});
```

### Files Likely Affected
- `components/AdminDashboard.tsx` ✅ (already updated)
- `components/admin/OrdersTable.tsx` ✅ (already updated)
- Any custom components making authenticated API calls

---

## 3. Update Registration Flow

### Old Behavior ❌
After successful registration, user was automatically logged in.

### New Behavior ✓
After registration, user must verify email before logging in.

### Updated Response
```javascript
// Registration success response
{
  success: true,
  message: "Account created successfully. Please verify your email...",
  user: { ... },
  requiresVerification: true  // NEW field
}
```

### UI Changes Needed
**LoginModal or Registration Component**:

```javascript
const handleRegister = async (data) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (result.success) {
    // NEW: Check if verification required
    if (result.requiresVerification) {
      // Show OTP verification form
      setStep('verify-otp');
      setEmailToVerify(data.email);
    } else {
      // Old users might not need verification
      // Refresh auth state
      refreshUser();
    }
  }
};
```

---

## 4. Handle OTP Verification

### Flow
1. User registers → receives OTP email
2. User enters OTP in verification form
3. On success → redirect to login
4. User logs in → now allowed (email verified)

### Sample OTP Verification Component

```javascript
function OTPVerification({ email, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const handleVerify = async () => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Email verified! User can now login
        onSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Verification failed');
    }
  };
  
  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit code sent to {email}</p>
      <input 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        placeholder="000000"
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## 5. Handle Login Errors

### New Error: Email Not Verified

```javascript
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  
  const result = await response.json();
  
  if (!result.success) {
    // Check for specific error
    if (response.status === 403) {
      // Email not verified
      setError('Please verify your email before logging in');
      // Optionally: offer to resend OTP
      setShowResendOTP(true);
    } else {
      setError(result.message);
    }
  } else {
    // Login successful
    refreshUser(); // Fetch user data
  }
};
```

---

## 6. Handle Rate Limiting

### New Response: Too Many Requests (429)

```javascript
const response = await fetch('/api/auth/login', { ... });

if (response.status === 429) {
  const result = await response.json();
  // result.message contains retry time
  // e.g., "Too many login attempts. Please try again in 900 seconds."
  
  setError(result.message);
  // Optionally: disable form for that duration
  setIsBlocked(true);
  setTimeout(() => setIsBlocked(false), 15 * 60 * 1000);
}
```

### User-Friendly Display

```javascript
function formatRetryTime(seconds) {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

// In error message
<p>Too many attempts. Try again in {formatRetryTime(resetIn)}</p>
```

---

## 7. Logout Flow

### Old ❌
```javascript
const logout = () => {
  localStorage.removeItem('auth_token');
  setUser(null);
};
```

### New ✓
```javascript
const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setUser(null);
  }
};
```

**Updated in**: [lib/contexts/AuthContext.tsx](gautam-nextjs/lib/contexts/AuthContext.tsx) ✅

---

## 8. Price Display Utilities (Optional)

If you want consistent price formatting:

```javascript
import { parsePrice, formatPrice } from '@/lib/utils/pricing';

// Parse price string to number
const price = parsePrice('NPR 1,200'); // 1200

// Format number as price
const displayPrice = formatPrice(1200); // "NPR 1,200"
```

---

## 9. Testing Your Changes

### Test Authentication Flow
```bash
1. Clear all cookies and localStorage
2. Register new account → should NOT auto-login
3. Check email → enter OTP
4. Login → should succeed
5. Navigate to admin page → should see data
6. Logout → should redirect to login
7. Try login with unverified email → should fail
```

### Test Rate Limiting
```bash
1. Try login with wrong password 5 times → should work
2. Try 6th time → should get "Too many attempts"
3. Wait ~1 second, try again → still blocked
4. Different email/username → should work (per-IP limit)
```

### Test Order Creation
```bash
1. Add items to cart
2. Proceed to checkout
3. Complete order → should work
4. (Dev tools) Try changing price in request → should fail
```

---

## 10. Environment Setup for Developers

### .env.local
```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local
MONGODB_URI=mongodb://localhost:27017/gautam-dev
JWT_SECRET=dev-secret-key-change-in-production
RESEND_API_KEY=re_... # Get from resend.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Install & Run
```bash
npm install
npm run dev
```

---

## 11. Troubleshooting

### Issue: "User not authenticated" after login
**Cause**: Cookies not being sent  
**Fix**: Add `credentials: 'include'` to all fetch calls

### Issue: CORS errors in development
**Cause**: Cookie sameSite policy  
**Fix**: Ensure frontend and backend on same domain/port, or use `sameSite: 'none'` in dev

### Issue: Registration succeeds but no OTP email
**Cause**: Email service not configured  
**Fix**: 
1. Check `RESEND_API_KEY` in `.env.local`
2. For dev, check Resend dashboard logs
3. Verify email format is valid

### Issue: Admin dashboard shows "Forbidden"
**Cause**: User not admin or cookie expired  
**Fix**:
1. Check user role in MongoDB: `db.users.find({ email: 'admin@example.com' })`
2. Update role: `db.users.updateOne({ email: '...' }, { $set: { role: 'admin' } })`
3. Re-login to get fresh cookie

---

## 12. Breaking Changes Summary

| Feature | Before | After | Action Required |
|---------|--------|-------|-----------------|
| Auth token storage | localStorage | httpOnly cookie | Update API calls |
| Registration | Auto-login | Requires verification | Add OTP flow |
| API authentication | `Authorization: Bearer` | `credentials: 'include'` | Update fetch calls |
| Admin checks | Client-side only | Server-enforced | None (automatic) |
| Order pricing | Client-calculated | Server-validated | None (automatic) |

---

## 13. Code Snippets Reference

### Complete Auth Context Hook Example

```javascript
import { useAuth } from '@/lib/contexts/AuthContext';

function MyComponent() {
  const { user, loading, isAuthenticated, login, logout, refreshUser } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Check if email verified
  const isVerified = user?.isEmailVerified;
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Complete Login Form Example

```javascript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, refreshUser } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      await refreshUser(); // Fetch user data
      // Redirect or close modal
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Support

**Questions?** Check:
1. [PRODUCTION_READINESS_SUMMARY.md](PRODUCTION_READINESS_SUMMARY.md) - Complete changes
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Security patterns
3. Backend code - All endpoints have updated patterns

**Last Updated**: February 17, 2026
