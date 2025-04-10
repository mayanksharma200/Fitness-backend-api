import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import postsRouter from "./routes/posts.js";

const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS with environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable if you need to pass cookies/authentication
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use("/api/posts", postsRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Forbidden - CORS policy' });
  }
  
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'ALL'}`);
});

export default app;