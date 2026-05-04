import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from "mongoose";

import authRoutes from './routes/authRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// ✅ CORS must come FIRST, before any other middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow all origins for development flexibility
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, allow specific origins
    const allowedOrigins = [
      "https://freelancer-mern-backend.onrender.com"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use('/auth', authRoutes);
app.use('/freelancer', freelancerRoutes);
app.use('/project', projectRoutes);
app.use('/application', applicationRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => console.log("DB connection error:", err));