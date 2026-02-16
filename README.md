# Gautam Lady Shoes - Full Stack E-Commerce Platform

A modern, production-ready e-commerce application for Gautam Lady Shoes built with **Next.js 16**, **MongoDB**, **Tailwind CSS**, and **TypeScript**.

## 🎯 Quick Navigation

**Just want to run it?** → [Quick Start](#-quick-start-2-minutes)  
**Want to manage orders?** → [Admin Dashboard](#-admin-dashboard)  
**Need full setup details?** → See [gautam-nextjs/SETUP_GUIDE.md](gautam-nextjs/SETUP_GUIDE.md)

---

## 📋 Project Overview

### What's Included
- ✅ **5 Public Pages**: Home, Slippers, Clothing, Collections, Team
- ✅ **50+ Products**: With descriptions, prices & images
- ✅ **Admin Dashboard**: Real-time analytics & order management
- ✅ **Authentication**: Login/Register with email & password
- ✅ **Shopping Cart**: Add items, checkout, payment integration
- ✅ **Order Management**: Track orders, payment status, delivery
- ✅ **Database**: MongoDB with collections for users, orders, carts
- ✅ **Responsive Design**: Mobile-first, fully responsive
- ✅ **Production Ready**: Optimized, secure, deployed-ready

### Tech Stack
| Component | Technology |
|-----------|-----------|
| Frontend  | Next.js 16.1.6 + TypeScript |
| Styling   | Tailwind CSS v4 + Framer Motion |
| Database  | MongoDB (local or Atlas) |
| Auth      | JWT + Server-side session management |
| API       | Next.js API Routes |

---

## 🚀 Quick Start (2 Minutes)

### Prerequisites
- Node.js v18+ installed
- npm or yarn available
- MongoDB running locally OR MongoDB Atlas account

### Setup Steps

**1. Navigate to the project:**
```bash
cd gautam-nextjs
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env.local` in `gautam-nextjs/` directory:**
```env
MONGODB_URI=mongodb://localhost:27017/gautam-nextjs
NEXTAUTH_SECRET=your-secret-key-at-least-32-characters
NEXTAUTH_URL=http://localhost:3000
```

**4. Initialize database:**
```bash
npm run init-db
```

**5. Create admin user:**
```bash
npm run create-admin
```

**6. Start development server:**
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 👨‍💼 Admin Dashboard

- **Login**: admin@gautamlady.com / AdminPassword123!
- **Access**: http://localhost:3000/admin (click purple icon after login)
- **Features**: Real-time analytics, order management, payment status

See [ADMIN_FEATURES.md](gautam-nextjs/ADMIN_FEATURES.md) for details.

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [SETUP_GUIDE.md](gautam-nextjs/SETUP_GUIDE.md) | Complete setup & configuration |
| [ADMIN_FEATURES.md](gautam-nextjs/ADMIN_FEATURES.md) | Admin dashboard, auth & cart |
| [DEPLOYMENT_GUIDE.md](gautam-nextjs/DEPLOYMENT_GUIDE.md) | Production deployment |
| [README.md](gautam-nextjs/README.md) | Project structure overview |

---

## 🛠️ Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Run production build
npm run init-db       # Initialize database
npm run create-admin  # Create admin user
npm run lint          # Run linter
```

---

## ✅ Features

- ✅ 5 public pages with 50+ products
- ✅ Admin dashboard with real-time analytics
- ✅ User authentication (register/login)
- ✅ Shopping cart & checkout
- ✅ Order management system
- ✅ Payment integration
- ✅ Fully responsive design
- ✅ MongoDB database
- ✅ Production ready

---

**Version**: 1.0.0  
**Last Updated**: February 2025
