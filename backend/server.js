const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const db = require("./db");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});