const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const allowedOrigins = [
  "http://localhost:5173",
  "https://lms-ai-murex.vercel.app" 
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
  optionsSuccessStatus: 200 
}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("AI LMS Backend is running");
});

app.get("/debug/tables", (req, res) => {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table';",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});