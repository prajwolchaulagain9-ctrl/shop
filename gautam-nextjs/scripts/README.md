# Database Initialization

This folder contains scripts for initializing and managing the database.

## Scripts

### init-db.js / init-db.ts
Initializes the database by creating all required collections and indexes.

**What it does:**
- Connects to MongoDB
- Creates collections: Users, OTPs, Carts, Orders
- Creates indexes for optimal query performance
- Displays database statistics

## Usage

### Run the initialization script:

```bash
npm run init-db
```

Or directly with Node.js:

```bash
node scripts/init-db.js
```

### Using TypeScript version:

```bash
npx tsx scripts/init-db.ts
```

## Requirements

Make sure you have set up your `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
```

## Output

The script will display:
- Connection status
- Existing collections
- Collection creation progress
- Collection statistics (document counts)
- Final list of all collections

## Collections Created

1. **users** - User accounts with authentication
2. **otps** - One-Time Passwords for verification
3. **carts** - Shopping cart data (legacy)
4. **orders** - Order records with payment information

## Indexes Created

### Users Collection
- email (unique)
- verificationToken
- resetPasswordToken

### OTPs Collection
- email
- expiresAt (TTL index for automatic cleanup)

### Carts Collection
- userId
- sessionId

### Orders Collection
- userId
- sessionId
- paymentStatus
- orderStatus
- createdAt (descending)

## Notes

- This script is idempotent - safe to run multiple times
- Running it won't delete existing data
- It only ensures collections and indexes exist
- Existing indexes will be updated if schema changes
