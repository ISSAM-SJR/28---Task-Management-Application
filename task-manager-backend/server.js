const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// ✅ Load environment variables from custom file named "..env"
dotenv.config({ path: path.join(__dirname, '..env') });

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ CORS (important for frontend-backend connection)
const allowedOrigins = [
  "http://localhost:5173", // for local frontend (Vite)
  "https://task-manager-frontend.onrender.com" // replace with your Render frontend URL
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

// ✅ Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ✅ Debug log to confirm env is loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// ✅ Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// ✅ Server (fallback port for local dev)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});