import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/status", (req, res) => {
  res.json({ status: "API is running" });
});

// Routes
app.use("/api/posts", postsRouter);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
