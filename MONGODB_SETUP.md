# MongoDB Setup Guide

This application now uses MongoDB for data storage instead of in-memory JSON files.

## Prerequisites

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas/register
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

## Setup Steps

### 1. Configure MongoDB Connection

The `.env.local` file has been created with the default local MongoDB connection:

```
MONGODB_URI=mongodb://localhost:27017/dojo-republic
```

**For MongoDB Atlas (Cloud):**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `.env.local`:
  ```
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dojo-republic?retryWrites=true&w=majority
  ```

### 2. Seed the Database

Run the seed script to populate MongoDB with initial data:

```bash
npm run seed:mongodb
```

This will:
- Clear existing data
- Insert users, dojos, players, tournaments, products, etc.
- Hash all passwords

### 3. Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Login Credentials

After seeding, you can login with:

- **Admin**: admin@demo.com / password123
- **Dojo Owner**: owner@demo.com / password123
- **Student**: student@demo.com / password123
- **Coach**: coach@demo.com / password123

## Dynamic Routes Fixed

The following routes now work properly:

- `/dojos/[id]` - Individual dojo details
- `/tournaments/[id]` - Individual tournament details
- `/players/[id]` - Individual player profile
- `/admin/dojos` - Admin dojo management

## Features

✅ MongoDB integration with Mongoose
✅ User authentication with sessions
✅ Dynamic routes for all entities
✅ Admin dashboard for approvals
✅ Data persistence across restarts
✅ Proper database relationships

## Troubleshooting

**Connection Error:**
- Ensure MongoDB is running: `mongod` or check Docker container
- Verify connection string in `.env.local`
- Check firewall settings

**Seed Script Fails:**
- Ensure MongoDB is accessible
- Check data JSON files exist in `data/` folder
- Verify mongoose version compatibility

**Data Not Showing:**
- Run `npm run seed:mongodb` to populate database
- Check browser console for API errors
- Verify MongoDB connection in terminal logs
