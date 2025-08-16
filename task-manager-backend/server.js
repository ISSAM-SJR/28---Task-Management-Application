const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../..env') }); // Load .env from parent folder

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes); // ✅ All task routes handled inside taskRoutes.js
app.use('/api/users', userRoutes); // ✅ User routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../task-manager-frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../task-manager-frontend/build/index.html'));
  });
}

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});