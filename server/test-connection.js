require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string exists:', !!process.env.MONGODB_URI);

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });
    console.log('✅ MongoDB connection successful!');
    console.log('Connected to:', mongoose.connection.host);
    await mongoose.disconnect();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check Network Access settings in MongoDB Atlas');
    console.error('4. Verify Database Access permissions');
  }
}

testConnection();
