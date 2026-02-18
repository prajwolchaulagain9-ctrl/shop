# Admin Dashboard & Features Guide

Complete guide to admin dashboard, authentication, and shopping features.

---

## 🎯 Quick Admin Access

### Prerequisites
- Must have completed initial setup from [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Admin user created with: `npm run create-admn`

### 3-Step Access

**1. Login**
```
Email: admin@gautamlady.com
Password: AdminPassword123!
```

**2. Find Dashboard**
- After login, purple dashboard icon appears on navbar
- Located next to user profile dropdown

**3. Click to Enter**
- URL: http://localhost:3000/admin
- Opens full admin dashboard

---

## 📊 Admin Dashboard Features

### Overview Tab

**Displays Real-Time Metrics:**
- **Total Revenue**: Sum of all completed orders
- **Total Orders**: Count of all orders
- **Total Customers**: Count of registered users
- **Monthly Sales**: Current month revenue

**Charts:**
- **30-Day Revenue Trend**: Line chart showing daily revenue
- **Payment Method Breakdown**: Pie chart of payment methods
- **Order Status Distribution**: Bar chart of order statuses

### Orders Tab

**View All Orders**
- Paginated list (10 orders per page)
- Sort by date, status, customer name
- Filter by status: All, Pending, Processing, Shipped, Delivered, Cancelled

**Order Details**
- Click any order to see full details
- Customer name, email, phone
- Delivery address
- Items ordered with quantities and prices
- Total amount
- Payment status
- Order status
- Order date and timestamps

### Order Management

**Update Order Status**
- Each order has status: Pending → Processing → Shipped → Delivered
- Click order → Change status in dropdown
- Status updates instantly on dashboard

**Update Payment Status**
- Payment status: Pending → Completed
- Click order → Update payment status
- Useful for manual payment verification or adjustments

---

## 🔐 Authentication System

### User Registration

**What Happens:**
1. User fills registration form
2. Email validation
3. Password hashed with bcrypt
4. User account created in database
5. Optional email verification (OTP)

**Registration Fields:**
- First Name (2+ characters)
- Last Name (2+ characters)
- Email (must be valid)
- Phone (optional, Nepali format supported)
- Password (6+ characters)
- Confirm Password (must match)

### User Login

**Flow:**
1. User enters email and password
2. System verifies credentials
3. JWT token generated
4. Token stored in secure HTTP-only cookie
5. User authenticated on frontend

**Login Fields:**
- Email address
- Password
- Remember me (keeps user logged in)

**Security Features:**
- Passwords never sent in plain text
- JWT tokens expire after 24 hours
- HTTP-only cookies prevent JavaScript access
- CSRF protection on forms

### Session Management

**Authenticated Actions:**
- Add items to shopping cart
- Access checkout page
- View order history
- Update profile information
- Access admin dashboard (if admin)

**Auto-Redirect:**
- If user logs out, cart is saved
- Login again to see saved cart
- Can continue shopping from where they left off

---

## 🛒 Shopping Cart System

### How Cart Works

**For Non-Authenticated Users:**
1. Browse products freely
2. Click "Add to Cart"
3. Login modal appears automatically
4. Cannot add items without login

**For Authenticated Users:**
1. Click "Add to Cart" on any product
2. Item added immediately
3. Cart sidebar opens showing added item
4. Can continue shopping or go to checkout

### Cart Features

**Persistent Storage:**
- Cart stored locally on device
- Also synced with user account
- Survives browser refresh
- Survives logout/login

**Cart Operations:**
- ✅ Add items with quantity
- ✅ Remove items
- ✅ Update quantities
- ✅ View total price
- ✅ Clear entire cart

**Cart Sidebar:**
- Shows all items in cart
- Displays quantities and prices
- Shows total amount
- Quick access to checkout

### Checkout Process

**Requirements:**
- Must be logged in
- Must have items in cart
- Must fill delivery address

**Checkout Steps:**
1. Click "Proceed to Checkout"
2. Verify customer details auto-filled from profile
3. Enter/edit delivery address
4. Review order total
5. Proceed to payment
6. Complete payment
7. Order confirmation

**Order Confirmation:**
- Order stored in database
- Order ID generated
- Confirmation email sent
- Accessible in "My Orders" section

---

## 📧 Email & Verification System

### Email OTP Verification

**When Used:**
- User registration (if email verification enabled)
- Password reset process
- Account security verification

**OTP Flow:**
1. System generates 6-digit code
2. Email sent to user
3. User enters code in app
4. Code verified (valid for 10 minutes)
5. Account/action verified

### Email Templates

**Registration Confirmation**
- Sent after successful registration
- Contains account details
- Link to login

**OTP Code**
- Contains 6-digit verification code
- Code valid for 10 minutes
- Do not share with anyone

---

## 🔌 API Endpoints

### Admin Endpoints

All admin endpoints require:
- Valid JWT token
- Admin role in user record

#### Get Dashboard Statistics
```
GET /api/admin/stats

Response:
{
  "totalRevenue": 50000,
  "totalOrders": 150,
  "totalCustomers": 85,
  "monthlyRevenue": 15000,
  "revenueData": [...],          // Last 30 days
  "paymentMethodBreakdown": {...},
  "orderStatusDistribution": {...}
}
```

#### Get Orders List
```
GET /api/admin/orders?page=1&status=all&limit=10

Query Parameters:
- page: Page number (default: 1)
- status: "all", "pending", "processing", "shipped", "delivered", "cancelled"
- limit: Items per page (default: 10)

Response:
{
  "orders": [...],        // Array of orders
  "total": 150,          // Total orders count
  "pages": 15            // Total pages
}
```

#### Update Order or Payment Status
```
PATCH /api/admin/orders/:orderId

Body:
{
  "status": "shipped",           // Order status
  "paymentStatus": "completed"   // Payment status (optional)
}

Response:
{
  "success": true,
  "message": "Order updated successfully",
  "order": {...}
}
```

### Authentication Endpoints

#### Register User
```
POST /api/auth/register

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+977-9841234567",
  "password": "SecurePass123"
}
```

#### Login User
```
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: JWT token in cookie
```

#### Logout User
```
POST /api/auth/logout

Clears authentication cookie
```

### Cart Endpoints

#### Get Cart
```
GET /api/cart

Response:
{
  "items": [
    {
      "productId": "123",
      "name": "Slipper",
      "quantity": 2,
      "price": 500
    }
  ],
  "total": 1000
}
```

#### Add to Cart
```
POST /api/cart

Body:
{
  "productId": "123",
  "quantity": 1
}
```

#### Update Cart
```
PATCH /api/cart

Body:
{
  "productId": "123",
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE /api/cart/:productId
```

---

## 🗄️ Database Collections

### users Collection

**Fields:**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "customer" | "admin",
  verified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- email (unique)
- verificationToken
- resetPasswordToken

### orders Collection

**Fields:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  deliveryAddress: String,
  paymentMethod: "card" | "bank" | "cash",
  paymentStatus: "pending" | "completed" | "failed",
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- userId
- paymentStatus
- orderStatus
- createdAt

### carts Collection

**Fields:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  items: [
    {
      productId: String,
      quantity: Number
    }
  ],
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- userId

### otps Collection

**Fields:**
```javascript
{
  _id: ObjectId,
  email: String,
  code: String,
  expiresAt: Date (TTL: 600 seconds),
  createdAt: Date
}
```

**Indexes:**
- email
- expiresAt (TTL - auto-deletes after expiry)

---

## 🧪 Testing Guide

### Test Admin Features

**Scenario 1: Dashboard Access**
1. Visit http://localhost:3000
2. Click "Login"
3. Enter: `admin@gautamlady.com` / `AdminPassword123!`
4. Purple dashboard icon appears
5. Click it to enter admin dashboard
6. Verify Overview tab shows metrics

**Scenario 2: Manage Orders**
1. In admin dashboard, click "Orders" tab
2. View list of orders (if any exist)
3. Click on an order to see details
4. Try changing order status
5. Try changing payment status
6. Click save to verify changes

**Scenario 3: Analytics**
1. In Overview tab, view charts
2. Hover over chart data points
3. Check 30-day revenue trend
4. Verify payment method breakdown

### Test Customer Features

**Scenario 1: Registration & Login**
1. Visit http://localhost:3000
2. Click "Login" → "Register" tab
3. Fill registration form with new account
4. Submit registration
5. Login with new credentials
6. Verify user is logged in (name appears on navbar)

**Scenario 2: Add to Cart**
1. Browse to product (Slippers, Clothing, etc.)
2. Click "Add to Cart"
3. Verify cart sidebar opens
4. Item appears in cart
5. Quantity can be updated
6. Item can be removed

**Scenario 3: Checkout**
1. Add items to cart
2. Click "Proceed to Checkout"
3. Verify customer details pre-filled
4. Enter delivery address
5. Review order total
6. Proceed to payment
7. Order should be saved (check admin dashboard)

---

## ⚙️ Configuration

### Change Admin Password

**Important**: Do this immediately after first login!

1. Login with admin account
2. Click profile dropdown (top right)
3. Go to Settings/Profile
4. Change Password option
5. Enter old password: `AdminPassword123!`
6. Enter new strong password (12+ chars, mixed case, numbers, symbols)
7. Confirm new password
8. Save changes

### Enable/Disable Features

Edit `.env.local` to control features:

```env
# Email verification (true/false)
ENABLE_EMAIL_VERIFICATION=false

# Payment required for checkout (true/false)
ENABLE_PAYMENT_GATEWAY=true

# Order notifications (true/false)
ENABLE_ORDER_NOTIFICATIONS=true
```

---

## Security Best Practices

### For Customers
- ✅ Don't share login credentials
- ✅ Use strong passwords (12+ chars)
- ✅ Verify email during registration
- ✅ Logout on shared computers
- ✅ Check order status regularly

### For Admin
- ✅ Change default password immediately
- ✅ Use strong admin password (16+ chars)
- ✅ Never share admin credentials
- ✅ Regularly review orders and changes
- ✅ Monitor for suspicious activity
- ✅ Keep MongoDB connection secure

---

## Common Tasks

### Task: Create New Admin
```bash
npm run create-admin
```
Creates another admin user (follow prompts)

### Task: Reset Admin Password
1. Delete admin user from MongoDB
2. Run `npm run create-admin` again
3. New credentials will be provided

### Task: View Database
```bash
mongosh
use gautam-nextjs
db.users.find()        # View all users
db.orders.find()       # View all orders
```

### Task: Export Orders
1. In admin dashboard, view orders
2. Admin dashboard supports data export feature
3. Click export button to download CSV

---

## Troubleshooting

### "Access Denied" when trying to enter admin
- **Cause**: Not logged in as admin
- **Fix**: Verify login credentials, check user role in database

### "Orders not showing" in admin dashboard
- **Cause**: Database connection issue or no orders exist
- **Fix**: 
  - Place test order as customer
  - Verify MongoDB connection in `.env.local`
  - Check browser console for errors

### "Cart not persisting" across sessions
- **Cause**: User not authenticated
- **Fix**: 
  - Login to account
  - Try adding to cart again
  - Cart data syncs with authenticated account

---

**Last Updated**: February 2025
**For Setup Issues**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
**For Deployment**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
