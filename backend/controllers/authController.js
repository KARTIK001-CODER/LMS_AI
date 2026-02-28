const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

console.log("[authController] DB object loaded:", typeof db, "- serialize:", typeof db.serialize);
const register = (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    console.log("[register] Checking email:", email);

    db.get("SELECT id FROM students WHERE email = ?", [email], (err, row) => {
        if (err) {
            console.error("[register] db.get error:", err.message);
            return res.status(500).json({ error: "Database error", detail: err.message });
        }

        if (row) {
            return res.status(400).json({ error: "Email already exists" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("[register] bcrypt.hash error:", err.message);
                return res.status(500).json({ error: "Error hashing password", detail: err.message });
            }

            console.log("[register] Inserting user:", email);


            db.run(
                "INSERT INTO students (full_name, email, password) VALUES (?, ?, ?)",
                [full_name, email, hashedPassword],
                function (err) {

                    if (err) {
                        console.error("[register] db.run error:", err.message);
                        return res.status(500).json({ error: "Database error", detail: err.message });
                    }

                    console.log("[register] Inserted! New row ID:", this.lastID);
                    return res.status(201).json({
                        message: "User registered successfully",
                        id: this.lastID,
                    });
                }
            );
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("[login] Fetching user:", email);
    db.get("SELECT * FROM students WHERE email = ?", [email], (err, user) => {
        if (err) {
            console.error("[login] db.get error:", err.message);
            return res.status(500).json({ error: "Database error", detail: err.message });
        }

        if (!user) {
            console.log("[login] No user found for email:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("[login] User found:", user.id, "| password field starts with:", user.password ? user.password.substring(0, 7) : "NULL");
        const isBcryptHash = user.password && user.password.startsWith("$2");

        if (isBcryptHash) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("[login] bcrypt.compare error:", err.message);
                    return res.status(500).json({ error: "Error comparing passwords", detail: err.message });
                }

                if (!isMatch) {
                    console.log("[login] Password mismatch for user:", user.id);
                    return res.status(401).json({ error: "Invalid email or password" });
                }

                return issueToken(res, user);
            });
        } else {
            console.log("[login] Legacy plaintext password detected — comparing directly");

            if (password !== user.password) {
                console.log("[login] Plaintext mismatch for user:", user.id);
                return res.status(401).json({ error: "Invalid email or password" });
            }
            bcrypt.hash(password, 10, (hashErr, newHash) => {
                if (!hashErr) {
                    db.run(
                        "UPDATE students SET password = ? WHERE id = ?",
                        [newHash, user.id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error("[login] Failed to upgrade password hash:", updateErr.message);
                            } else {
                                console.log("[login] Upgraded plaintext password to bcrypt for user:", user.id);
                            }
                        }
                    );
                }
            });

            return issueToken(res, user);
        }
    });
};

function issueToken(res, user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("[login] JWT_SECRET is not set in environment!");
        return res.status(500).json({ error: "Server configuration error: missing JWT_SECRET" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "1h" }
    );

    console.log("[login] Token issued for user:", user.id);

    return res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
        },
    });
}

module.exports = { register, login };