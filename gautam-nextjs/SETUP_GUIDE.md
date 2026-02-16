# Complete Setup Guide

Complete step-by-step guide for setting up Gautam Lady Shoes Next.js application.

---

## Part 1: Environment Setup

### 1.1 Install Node.js
- Download from https://nodejs.org/ (v18 or higher)
- Verify installation:
```bash
node --version    # Should be v18+
npm --version     # Should be v10+
```

### 1.2 Choose MongoDB Option

You have TWO options. Choose one:

#### Option A: Local MongoDB (Recommended for Development)
1. **Download MongoDB Community Edition**
   - https://www.mongodb.com/try/download/community
   - Choose your OS
   - Follow installation guide for your platform

2. **Start MongoDB**
   - **Windows**: MongoDB starts automatically as a service
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Verify it's running**:
   ```bash
   mongosh              # Should connect successfully
   exit()               # Quit mongosh
   ```

#### Option B: MongoDB Atlas (Cloud - For Production)
1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0 Sandbox)
   - Select AWS provider & closest region
   - Name it: `gautam-ecommerce`
   - Click "Create" (wait 1-3 minutes)

3. **Create Database User**
   - Left sidebar → "Database Access"
   - Click "Add New Database User"
   - Username: `gautam_admin`
   - Password: Generate and save securely
   - Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Left sidebar → "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - IP: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" section
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5+
   - Copy the connection string
   - It looks like: `mongodb+srv://gautam_admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `PASSWORD` with your actual database password

---

## Part 2: Project Setup

### 2.1 Navigate to Project
```bash
cd d:\scrapper\shop\gautam-nextjs
# or on Mac/Linux: cd gautam-nextjs
```

### 2.2 Install Dependencies
```bash
npm install
```

This installs ~500+ packages (may take 2-5 minutes on first install).

### 2.3 Create Environment Configuration

Create a `.env.local` file in `gautam-nextjs` directory (same level as `package.json`):

```env
# Database Configuration
# For local MongoDB (Option A above):
MONGODB_URI=mongodb://localhost:27017/gautam-nextjs

# OR for MongoDB Atlas (Option B above):
# MONGODB_URI=mongodb+srv://gautam_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gautam-nextjs?retryWrites=true&w=majority
# Replace YOUR_PASSWORD with your actual database password

# Authentication
# Generate a random string (min 32 characters)
# You can use: node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=your-super-secret-key-with-32-chars-minimum-replace-this

# Next.js URLs
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

**Important Notes:**
- Don't share or commit `.env.local` (it's in `.gitignore`)
- For production, use Vercel environment variables instead
- MongoDB URI should NOT have spaces

---

## Part 3: Database Initialization

### 3.1 Initialize Collections
```bash
npm run init-db
```

**What this does:**
- Connects to MongoDB
- Creates 4 collections: `users`, `otps`, `carts`, `orders`
- Creates necessary indexes for performance
- Displays database statistics

**Expected output:**
```
Connecting to MongoDB...
✅ Connected to MongoDB
✅ Database initialized successfully

Database Statistics:
- users collection: 0 documents
- otps collection: 0 documents
- carts collection: 0 documents
- orders collection: 0 documents
```

### 3.2 Create Admin User
```bash
npm run create-admin
```

**Expected output:**
```
✓ Admin user created successfully!

Login Credentials:
────────────────────────────────
Email:    admin@gautamlady.com
Password: AdminPassword123!
────────────────────────────────

⚠ IMPORTANT: Change this password immediately after first login!
```

**Save these credentials!** You'll need them to access the admin dashboard.

---

## Part 4: Run the Application

### 4.1 Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 1.23s
```

### 4.2 Access the Application

**Frontend**: http://localhost:3000
- Browse products
- View team
- Explore all pages

**Admin Dashboard**: http://localhost:3000/admin
- Login with: `admin@gautamlady.com` / `AdminPassword123!`
- View analytics
- Manage orders
- Update statuses

### 4.3 Testing Login

**Test Customer Login:**
1. Click "Login" button on navbar
2. Click "Register" tab
3. Fill in details and register
4. After registration, try logging in

**Test Admin Features:**
1. Click "Login" button
2. Use admin credentials: `admin@gautamlady.com` / `AdminPassword123!`
3. After login, purple dashboard icon appears on navbar
4. Click it to access admin dashboard

---

## Part 5: Production Setup

For deploying to production, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps.

Quick checklist:
- ✅ Create MongoDB Atlas cluster
- ✅ Set production environment variables
- ✅ Run security checks
- ✅ Update admin password
- ✅ Configure domain
- ✅ Deploy to Vercel or your hosting

---

## Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**
- **Cause**: MongoDB not running locally
- **Fix**: 
  - Start MongoDB service (see Part 1.2 for your OS)
  - OR switch to MongoDB Atlas (add connection string to `.env.local`)

**Error: `MongoAuthError: authentication failed`**
- **Cause**: Wrong username/password in connection string
- **Fix**: 
  - Check MongoDB Atlas credentials
  - Ensure password is URL-encoded
  - Verify user has correct permissions

**Timeout when connecting to Atlas**
- **Cause**: Network access not configured
- **Fix**: 
  - Go to MongoDB Atlas → Network Access
  - Ensure `0.0.0.0/0` is added for development
  - For production, add your server's IP instead

### Node/npm Issues

**Error: `npm: command not found`**
- **Fix**: Install Node.js from https://nodejs.org/

**Error: `EACCES: permission denied`**
- **Cause**: Permission issue on Mac/Linux
- **Fix**: 
  ```bash
  sudo chown -R $(whoami) ~/.npm
  ```

### Environment Variable Issues

**Error: `MONGODB_URI is not defined`**
- **Cause**: `.env.local` file not created or not in right location
- **Fix**: 
  - Create `.env.local` in `gautam-nextjs` folder (same level as `package.json`)
  - Restart dev server with `npm run dev`

**Changes to `.env.local` not taking effect**
- **Fix**: Restart the dev server
- Verify file is in correct directory: `gautam-nextjs/.env.local`

### Admin User Issues

**Error: `Admin user already exists`**
- **Cause**: Running `npm run create-admin` multiple times
- **Fix**: 
  - One admin per email
  - Use the original credentials: `admin@gautamlady.com` / `AdminPassword123!`
  - To reset: Delete collection in MongoDB and run again

**Can't login with admin credentials**
- **Cause**: Typo in email or password
- **Fix**: 
  - Email: `admin@gautamlady.com` (lowercase)
  - Password: `AdminPassword123!` (case-sensitive)
  - Check caps lock not on

---

## Verification Checklist

After setup, verify everything works:

- [ ] Dev server starts: `npm run dev`
- [ ] http://localhost:3000 loads
- [ ] All 5 pages load (Home, Clothing, Slippers, Collections, Team)
- [ ] Login modal appears when clicking login
- [ ] Can register a new account
- [ ] Can logout after login
- [ ] Admin dashboard loads at /admin with admin credentials
- [ ] Admin dashboard shows analytics and orders
- [ ] Products appear on category pages
- [ ] Cart functionality works (if logged in)

---

## Next Steps

1. **Customize Admin Password**
   - Login with current credentials
   - Go to profile settings
   - Change password immediately

2. **Add Your Content**
   - Update product information
   - Add your team members
   - Customize colors/branding

3. **Deploy to Production**
   - Follow DEPLOYMENT_GUIDE.md
   - Set up MongoDB Atlas
   - Deploy to Vercel

---

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Last Updated**: February 2025
**Questions?** Check detailed guides in `gautam-nextjs/` folder
