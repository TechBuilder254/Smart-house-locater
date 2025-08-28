# 🏠 Smart House Locator - MongoDB Setup Guide

## 📋 Overview

This guide will help you set up MongoDB Atlas (free tier) for your Smart House Locator application. The app has been upgraded from localStorage to MongoDB for cloud data storage.

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE** tier (M0 Sandbox)
4. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
5. Choose a region close to your users

### 2. Create Database Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### 4. Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### 5. Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `smart_house_locator`

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/smart_house_locator?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

## 🎯 Frontend Setup

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Start the Frontend

```bash
npm run dev
```

The app will start on `http://localhost:3000`

## 📊 Database Schema

The application uses the following MongoDB schema:

```javascript
{
  name: String,           // House name/address
  agentName: String,      // Agent name
  location: {
    latitude: Number,     // GPS latitude
    longitude: Number     // GPS longitude
  },
  notes: String,          // Optional notes
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## 🔄 Migration from localStorage

If you have existing data in localStorage:

1. The app will automatically detect localStorage data
2. A migration modal will appear on first load
3. Click "Migrate to Cloud" to transfer your data
4. Your localStorage data will be safely moved to MongoDB

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/houses` | Get all houses |
| GET | `/api/houses/:id` | Get single house |
| POST | `/api/houses` | Create new house |
| PUT | `/api/houses/:id` | Update house |
| DELETE | `/api/houses/:id` | Delete house |
| DELETE | `/api/houses` | Delete all houses |

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for your frontend domain
- **Input Validation**: All data is validated before saving
- **Error Handling**: Comprehensive error handling and logging

## 📱 Features

### ✅ What's New with MongoDB

- **Cloud Storage**: Data stored in MongoDB Atlas cloud
- **Cross-Device Access**: Access your data from any device
- **Automatic Backups**: MongoDB Atlas provides automatic backups
- **Scalability**: Easy to scale as your data grows
- **Real-time Sync**: Changes sync across all devices instantly
- **Search & Filter**: Advanced search capabilities
- **Data Migration**: Easy migration from localStorage

### 🏠 Core Features

- **GPS Location Capture**: Accurate property location recording
- **Google Maps Integration**: Direct navigation to properties
- **Property Management**: Add, edit, delete properties
- **Search & Filter**: Find properties quickly
- **Responsive Design**: Works on all devices
- **Modern UI**: Beautiful glass morphism design

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend URL)

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables:
   - `REACT_APP_API_URL` (your backend API URL)

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Error**: Check your MongoDB URI and network access
2. **CORS Error**: Verify FRONTEND_URL in backend .env
3. **Authentication Error**: Check database username/password
4. **Rate Limit**: Wait 15 minutes or increase limits

### Debug Commands

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check MongoDB connection
cd server && npm run dev

# Check frontend API calls
# Open browser dev tools and check Network tab
```

## 📞 Support

If you need help:

- **Email**: techbuilder254@gmail.com
- **Phone**: +254 700 021 601
- **GitHub**: techbuilder254

## 🎉 Congratulations!

Your Smart House Locator is now powered by MongoDB! Your data is safely stored in the cloud and accessible from anywhere.

---

**Made with ❤️ by TechBuilder254**
