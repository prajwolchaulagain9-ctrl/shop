# Gautam Lady Shoes - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Authentication System](#authentication-system)
10. [Component Structure](#component-structure)
11. [Styling & UI](#styling--ui)
12. [Mobile Optimization](#mobile-optimization)
13. [Deployment Guide](#deployment-guide)
14. [Development Workflow](#development-workflow)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Gautam Lady Shoes** is a full-stack e-commerce web application built with Next.js 15, featuring traditional Nepalese slippers and clothing. The platform includes a complete authentication system with email verification, product catalog management, and responsive design optimized for desktop, tablet, and mobile devices.

### Key Highlights
- **Type:** E-commerce Platform
- **Target Audience:** Customers interested in traditional Nepalese products
- **Authentication:** JWT-based with email OTP verification
- **Database:** MongoDB Atlas
- **Email Service:** Resend API
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15.1.4 (React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.1
- **Animations:** Framer Motion 11.15.0
- **Fonts:** Google Fonts (Playfair Display, Lato)

### Backend
- **Runtime:** Node.js (via Next.js API Routes)
- **Database:** MongoDB (via Mongoose 8.9.4)
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 2.4.3
- **Email Service:** Resend 4.0.1

### Third-Party Services
- **Email Validation:** Abstract API
- **Email Delivery:** Resend
- **Database Hosting:** MongoDB Atlas
- **Deployment:** Vercel (recommended)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript
- **CSS Framework:** Tailwind CSS with custom configuration

---

## Project Architecture

```
gautam-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/                 # Authentication endpoints
│   │       ├── check-email/      # Check email existence
│   │       ├── login/            # User login
│   │       ├── logout/           # User logout
│   │       ├── me/               # Get current user
│   │       ├── refresh/          # Refresh JWT token
│   │       ├── register/         # User registration
│   │       ├── send-otp/         # Send OTP email
│   │       ├── verify-email/     # Validate email with Abstract API
│   │       └── verify-otp/       # Verify OTP code
│   ├── clothing/                 # Clothing products page
│   ├── collections/              # Collections page
│   ├── slippers/                 # Slippers products page
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Homepage
├── components/                   # React Components
│   ├── Footer.tsx                # Site footer
│   ├── HeroSection.tsx           # Homepage hero
│   ├── LoginModal.tsx            # Login/Register modal
│   ├── Navbar.tsx                # Navigation bar
│   ├── ProductCard.tsx           # Product display card
│   ├── RootLayoutClient.tsx      # Client-side layout wrapper
│   └── Sidebar.tsx               # Mobile sidebar menu
├── lib/                          # Utility libraries
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── db/                       # Database configuration
│   │   └── connect.ts            # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── OTP.ts                # OTP model
│   │   └── User.ts               # User model
│   └── utils/                    # Utility functions
│       └── jwt.ts                # JWT token utilities
├── src/                          # Source files
│   └── data/                     # Static data
│       └── products.ts           # Product catalog data
├── public/                       # Static assets
│   ├── browserconfig.xml         # Windows tile configuration
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt                # SEO robots file
│   └── sw.js                     # Service worker
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Features

### 1. **Authentication System**
- **User Registration:**
  - Multi-step registration with form validation
  - Real-time email validation using Abstract API
  - Email existence check to prevent duplicates
  - 6-digit OTP verification sent via Resend
  - Password strength validation (minimum 6 characters)
  - Phone number format validation (Nepal format)
  - Terms & Conditions acceptance required

- **User Login:**
  - Email and password authentication
  - "Remember me" functionality
  - JWT token generation (7-day expiration)
  - Automatic token refresh
  - Password visibility toggle

- **Session Management:**
  - JWT stored in HTTP-only cookies
  - Automatic token refresh on protected routes
  - Logout functionality
  - Persistent authentication state

### 2. **Product Catalog**
- **Categories:**
  - Traditional Slippers (Flat, Block Heel, Medium Heel, Small Heel)
  - Traditional Clothing (Daura Suruwal, Gunyu Choli, Kurta variations)
  - Other Collections

- **Product Display:**
  - Grid layout with responsive columns
  - Product cards with images, names, prices
  - Blur effect and "Login to View" overlay for non-authenticated users
  - Category-specific pages

### 3. **User Interface**
- **Navigation:**
  - Fixed navbar with scroll effect
  - Mobile-responsive sidebar with category submenus
  - Login/Logout button based on auth state

- **Homepage Sections:**
  - Hero section with call-to-action
  - Featured slippers section
  - Featured clothing section
  - Collections showcase
  - About section with company story
  - Contact information
  - Interactive Google Maps integration

- **Modal System:**
  - Login/Register modal with tabbed interface
  - OTP verification step
  - Real-time form validation
  - Success/Error message display

### 4. **Mobile Optimization**
- **PWA Support:**
  - Web app manifest for installability
  - Service worker for offline capability
  - Apple touch icons
  - Theme color configuration

- **Touch Optimization:**
  - 44x44px minimum tap targets (iOS standard)
  - 48x48px touch targets on mobile (Android standard)
  - Momentum scrolling
  - No double-tap zoom
  - Safe area support for notched devices

- **Responsive Design:**
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px, 1280px
  - Adaptive font sizes
  - Optimized image loading (WebP, AVIF)

### 5. **Email System**
- **OTP Emails:**
  - Professional HTML email templates
  - 6-digit random OTP generation
  - 10-minute expiration
  - Maximum 5 verification attempts
  - Branded design with company colors

### 6. **Security Features**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication
- HTTP-only cookies
- Email verification before registration
- Rate limiting on OTP attempts
- Environment variable protection

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Resend API account
- Abstract API account
- Git installed

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd gautam-nextjs
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create `.env.local` file in root directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=gautam-lady-shoes

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email Validation
ABSTRACT_API_KEY=your_abstract_api_key

# Email Service
RESEND_API_KEY=your_resend_api_key
```

### Step 4: MongoDB Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Replace in MONGODB_URI

### Step 5: Get API Keys

**Resend API:**
1. Sign up at [resend.com](https://resend.com)
2. Create API key in dashboard
3. Copy to RESEND_API_KEY

**Abstract API:**
1. Sign up at [abstractapi.com](https://www.abstractapi.com/api/email-validation-api)
2. Get free API key
3. Copy to ABSTRACT_API_KEY

### Step 6: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### Step 7: Build for Production
```bash
npm run build
npm start
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `random_secret_key_here` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000` |
| `ABSTRACT_API_KEY` | Email validation API key | `abc123...` |
| `RESEND_API_KEY` | Email delivery API key | `re_abc123...` |

### Security Notes
- Never commit `.env.local` to version control
- Use strong, random JWT_SECRET in production
- Rotate API keys periodically
- Use different keys for staging/production

---

## Database Schema

### User Model (`lib/models/User.ts`)

```typescript
{
  firstName: String (required, min: 2)
  lastName: String (required, min: 2)
  email: String (required, unique, lowercase)
  phone: String (optional)
  password: String (required, min: 6, select: false)
  isEmailVerified: Boolean (default: false)
  role: String (enum: ['customer', 'admin'], default: 'customer')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:** email (unique)

### OTP Model (`lib/models/OTP.ts`)

```typescript
{
  email: String (required, lowercase, indexed)
  otp: String (required, 6 digits)
  expiresAt: Date (required, TTL indexed)
  attempts: Number (default: 0, max: 5)
  verified: Boolean (default: false)
  createdAt: Date (auto)
}
```

**Indexes:** 
- email (standard)
- expiresAt (TTL - auto-deletes after 10 minutes)

---

## API Endpoints

### POST `/api/auth/register`
Register new user account.

**Request:**
```json
{
  "firstName": "Ram",
  "lastName": "Gautam",
  "email": "ram@example.com",
  "phone": "+977-9851234567",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { "_id": "...", "firstName": "Ram", ... }
}
```

---

### POST `/api/auth/login`
Authenticate user.

**Request:**
```json
{
  "email": "ram@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... }
}
```

Sets HTTP-only cookie with JWT token.

---

### POST `/api/auth/logout`
Clear authentication.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`
Get current user.

**Headers:** Cookie with JWT token

**Response (200):**
```json
{
  "success": true,
  "user": { "_id": "...", "firstName": "Ram", ... }
}
```

---

### POST `/api/auth/send-otp`
Send OTP to email.

**Request:**
```json
{
  "email": "ram@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "expiresIn": 600
}
```

---

### POST `/api/auth/verify-otp`
Verify OTP code.

**Request:**
```json
{
  "email": "ram@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

---

### POST `/api/auth/verify-email`
Validate email with Abstract API.

**Request:**
```json
{
  "email": "ram@example.com"
}
```

**Response (200):**
```json
{
  "valid": true,
  "quality_score": 0.85
}
```

---

### POST `/api/auth/check-email`
Check if email exists in database.

**Request:**
```json
{
  "email": "ram@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "exists": false,
  "message": "Email is available"
}
```

---

## Authentication System

### JWT Token Flow

```
Registration:
1. Validate form → 2. Check email exists → 3. Send OTP
4. Verify OTP → 5. Hash password → 6. Save user → 7. Auto-login

Login:
1. Validate credentials → 2. Compare hash → 3. Generate JWT
4. Set cookie → 5. Return user data

Protected Routes:
1. Read cookie → 2. Verify JWT → 3. Fetch user → 4. Grant access

Token Refresh:
1. Check expiration → 2. Generate new token → 3. Update cookie
```

### AuthContext Provider

**State:**
```typescript
{
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}
```

**Methods:**
- `login(email, password)` - Authenticate
- `register(userData)` - Create account
- `logout()` - Clear session
- `refreshUser()` - Reload data

**Usage:**
```typescript
const { isAuthenticated, user, login } = useAuth();
```

---

## Component Structure

### Navbar (`components/Navbar.tsx`)
- Fixed navigation with scroll effect
- Conditional Login/Logout button
- Mobile sidebar toggle
- Authentication state integration

### Sidebar (`components/Sidebar.tsx`)
- Slide-in mobile menu
- Category dropdowns
- Touch-optimized
- Keyboard navigation

### LoginModal (`components/LoginModal.tsx`)
- Login/Register tabs
- Multi-step registration
- Real-time email validation
- OTP verification
- Form validation
- Error messages

### ProductCard (`components/ProductCard.tsx`)
- Product display
- Authentication gate (blur/overlay)
- Lazy loading
- Responsive layout

### HeroSection (`components/HeroSection.tsx`)
- Homepage banner
- Animated text
- Call-to-action button

### Footer (`components/Footer.tsx`)
- Multi-column layout
- Quick links
- Contact info
- Copyright

---

## Styling & UI

### Tailwind Config
**Custom Theme:**
```javascript
{
  fontFamily: {
    playfair: ['var(--font-playfair)', 'serif'],
    lato: ['var(--font-lato)', 'sans-serif']
  },
  colors: {
    red: { 900: '#8b0000' },
    amber: { 500: '#daa520' }
  }
}
```

### Color Scheme
- Primary: Dark Red (#8b0000)
- Accent: Golden (#daa520)
- Text: Dark Gray (#333)
- Background: Off-white (#fefefe)

### Typography
- Headings: Playfair Display
- Body: Lato
- Base size: 15px mobile, 16px desktop

---

## Mobile Optimization

### PWA Features
- App manifest for installation
- Service worker for offline
- Push notifications ready
- Background sync

### Touch Targets
- iOS: 44x44px minimum
- Android: 48x48px minimum
- Proper padding and spacing

### Responsive Design
- Breakpoints: 640px, 768px, 1024px
- Mobile-first approach
- Adaptive typography
- Optimized images (WebP, AVIF)

### Safe Area Support
- Notch compatibility
- Padding for iOS/Android edges
- Orientation handling

---

## Deployment Guide

### Vercel Deployment

**1. Push to GitHub:**
```bash
git add .
git commit -m "Deploy"
git push origin main
```

**2. Import to Vercel:**
- Visit vercel.com
- Import GitHub repository
- Auto-detects Next.js

**3. Add Environment Variables:**
```
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=https://your-site.vercel.app
ABSTRACT_API_KEY=...
RESEND_API_KEY=...
```

**4. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Site live at `your-project.vercel.app`

### MongoDB Atlas Setup
- Network Access: Add 0.0.0.0/0
- Database User: Ensure read/write permissions
- Connection: Use MongoDB Atlas URI

---

## Development Workflow

### Start Development
```bash
npm run dev
```

### Code Guidelines
- Use TypeScript types
- Try-catch async functions
- Validate all inputs
- Never expose secrets
- Lazy load components
- Use semantic HTML

### Git Workflow
```bash
git checkout -b feature/name
git add .
git commit -m "Message"
git push origin feature/name
```

---

## Troubleshooting

### MongoDB Connection Failed
- Check MONGODB_URI
- Verify network access (0.0.0.0/0)
- Ensure cluster is active
- Verify credentials

### JWT Token Invalid
- Clear browser cookies
- Check JWT_SECRET matches
- Verify token not expired
- Check cookie settings

### Emails Not Sending
- Verify RESEND_API_KEY
- Check Resend dashboard
- Ensure sender verified
- Check rate limits

### OTP Verification Fails
- Check not expired (10 min)
- Verify attempts < 5
- Check MongoDB record
- Email must match

### Build Errors
```bash
rm -rf node_modules
npm install
npm run build
```

---

## Performance

### Optimization
- Next.js Image component
- Code splitting
- Service worker caching
- Lazy loading
- WebP/AVIF images

### Bundle Analysis
```bash
npm run build
# Check .next/static size
```

---

## Security

- [x] Strong JWT secret
- [x] Password hashing
- [x] HTTP-only cookies
- [x] Input validation
- [x] XSS prevention
- [x] CSRF protection
- [x] Rate limiting

---

## Future Enhancements

1. **Admin Dashboard** - Product/user management
2. **Shopping Cart** - Add to cart, checkout
3. **User Profile** - Edit info, order history
4. **Search & Filter** - Product search
5. **Reviews** - Ratings and reviews
6. **Notifications** - Push/email alerts
7. **Multi-language** - Nepali support
8. **Analytics** - Google Analytics

---

## Support

### Versions
- Next.js: 15.1.4
- React: 19.0.0
- TypeScript: 5.0.0
- Tailwind: 3.4.1

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [MongoDB Docs](https://mongodb.com/docs)

---

**End of Documentation**
