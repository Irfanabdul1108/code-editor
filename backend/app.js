const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

const allowedOrigins = [
  'https://code-editor-hyt1.vercel.app'  // ✅ no /login here
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Export app instance (DO NOT listen here)
module.exports = app;
