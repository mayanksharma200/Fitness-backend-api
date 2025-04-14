import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import postsRouter from "./routes/posts.js";

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const staticAllowedOrigins = [
  "http://localhost:5173", // Local development
  "https://fitnessclub121.vercel.app", // Your Vercel frontend
  "https://fitness-backend-api.vercel.app",
  "https://www.fitnesss.club/", // Your backend (if needed)
];

const envAllowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const allowedOrigins = [...staticAllowedOrigins, ...envAllowedOrigins];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("Blocked by CORS:", origin);
      }
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preflight support
app.options("*", cors(corsOptions));

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/posts", postsRouter);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const isCorsError = err.message === "Not allowed by CORS";
  res.status(isCorsError ? 403 : 500).json({
    message: isCorsError ? "Forbidden - CORS policy" : "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Allowed origins: ${
      allowedOrigins.length ? allowedOrigins.join(", ") : "ALL"
    }`
  );
});

export default app;
