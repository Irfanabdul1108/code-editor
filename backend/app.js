const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const connectDB = require('./config/db'); // make sure this is correct
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS SETUP – Allow local + deployed frontend
const allowedOrigins = [
  'http://localhost:5173', // Local Vite dev server
  'https://code-editor-i27d.vercel.app' // Your deployed frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
