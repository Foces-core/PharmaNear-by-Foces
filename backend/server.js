import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import pharmacyRoutes from './routes/pharmacyRoutes.js'
import stockRoutes from './routes/stockRoutes.js'
import drugRoutes from './routes/drugRoutes.js'


dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://pharmanear-aneu.onrender.com"
];

if (process.env.CORS_ORIGIN) {
  // Support comma-separated origins
  process.env.CORS_ORIGIN.split(",").map(o => o.trim()).forEach(o => allowedOrigins.push(o));
}
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


//Database Connection
connectDB();

//Routes

app.get("/", (req, res) => {
  res.send("server check");
});

app.get("/api/health", (_req, res) => {
  try {
    const state = mongoose.connection.readyState;
    /**
     * 0 = disconnected
     * 1 = connected
     * 2 = connecting
     * 3 = disconnecting
     * 99 = uninitialized
    */

    res.status(200).json({
      status: state === 1 ? "healthy" : "unhealthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        connected: state === 1,
      },
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  }
});

app.use('/api/pharmacy',pharmacyRoutes);
app.use('/api/pharmacy/stock',stockRoutes);
app.use('/api/drugs',drugRoutes);

const port = process.env.PORT || 5000

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
