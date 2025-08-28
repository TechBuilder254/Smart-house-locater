# 🏠 Local MongoDB Setup Guide

## 📋 Overview
If MongoDB Atlas connection issues persist, we can use a local MongoDB installation instead.

## 🚀 Quick Setup Steps

### 1. Install MongoDB Community Edition

**For Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Compass (GUI tool) when prompted

**For macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**For Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mongodb
```

### 2. Start MongoDB Service

**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB`

**macOS:**
```bash
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Update Connection String

Replace your MongoDB Atlas connection string with:
```
mongodb://localhost:27017/smart_house_locator
```

### 4. Update .env File

Update your `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/smart_house_locator
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
```

### 5. Test Connection

Run the connection test:
```bash
node connection-test.js
```

## 🎉 Benefits of Local MongoDB

- ✅ No network connectivity issues
- ✅ Faster connection speeds
- ✅ No data transfer limits
- ✅ Full control over your data
- ✅ Works offline

## 🔄 Migration from Atlas

If you later want to migrate back to MongoDB Atlas:
1. Export your local data
2. Import to MongoDB Atlas
3. Update connection string

## 📞 Support

If you need help with local MongoDB setup, let me know!
