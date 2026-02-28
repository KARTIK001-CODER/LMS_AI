const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const DB_PATH = path.join(__dirname, "kalviumlabs_forge.sqlite");

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        console.error("   Looked for DB at:", DB_PATH);
    } else {
        console.log("✅ Connected to SQLite database at:", DB_PATH);
    }
});

module.exports = db;