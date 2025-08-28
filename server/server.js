const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check your internet connection and MongoDB Atlas settings');
    console.error('Trying alternative connection method...');
    
    // Try alternative connection method
    try {
      const alternativeUri = process.env.MONGODB_URI.replace('mongodb+srv://', 'mongodb://');
      console.log('Trying alternative connection string...');
      const conn = await mongoose.connect(alternativeUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      });
      console.log(`MongoDB Connected (alternative): ${conn.connection.host}`);
    } catch (altError) {
      console.error('Alternative connection also failed:', altError.message);
      process.exit(1);
    }
  }
};

// House Schema
const houseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  agentName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better performance
houseSchema.index({ name: 'text', agentName: 'text' });
houseSchema.index({ createdAt: -1 });

const House = mongoose.model('House', houseSchema);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart House Locator API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all houses
app.get('/api/houses', async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { agentName: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const houses = await House.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await House.countDocuments(query);
    
    res.json({
      success: true,
      data: houses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch houses',
      error: error.message
    });
  }
});

// Get single house
app.get('/api/houses/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    
    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }
    
    res.json({
      success: true,
      data: house
    });
  } catch (error) {
    console.error('Error fetching house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch house',
      error: error.message
    });
  }
});

// Create new house
app.post('/api/houses', async (req, res) => {
  try {
    const { name, agentName, location, notes } = req.body;
    
    // Validation
    if (!name || !agentName || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, agentName, and location (latitude, longitude)'
      });
    }
    
    const house = new House({
      name,
      agentName,
      location,
      notes: notes || ''
    });
    
    const savedHouse = await house.save();
    
    res.status(201).json({
      success: true,
      message: 'House saved successfully',
      data: savedHouse
    });
  } catch (error) {
    console.error('Error creating house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save house',
      error: error.message
    });
  }
});

// Update house
app.put('/api/houses/:id', async (req, res) => {
  try {
    const { name, agentName, location, notes } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (agentName) updateData.agentName = agentName;
    if (location) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;
    
    updateData.updatedAt = new Date();
    
    const house = await House.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }
    
    res.json({
      success: true,
      message: 'House updated successfully',
      data: house
    });
  } catch (error) {
    console.error('Error updating house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update house',
      error: error.message
    });
  }
});

// Delete house
app.delete('/api/houses/:id', async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    
    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }
    
    res.json({
      success: true,
      message: 'House deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete house',
      error: error.message
    });
  }
});

// Delete all houses
app.delete('/api/houses', async (req, res) => {
  try {
    await House.deleteMany({});
    
    res.json({
      success: true,
      message: 'All houses deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting all houses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all houses',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Smart House Locator API ready!`);
  });
};

startServer();
