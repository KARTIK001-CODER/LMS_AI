const db = require("../db");

const getProfile = (req, res) => {
    const studentId = req.user?.id || req.studentId;
    if (!studentId) return res.status(401).json({ error: "Unauthorized" });
    db.get("SELECT id, full_name, email, phone, date_of_birth, city FROM students WHERE id = ?", [studentId], (err, student) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!student) return res.status(404).json({ error: "Student not found" });
        db.get("SELECT tenth_board, tenth_percentage, twelfth_board, twelfth_percentage FROM education_details WHERE student_id = ?", [studentId], (err, education) => {
            if (err) return res.status(500).json({ error: "Database error" });
            db.get("SELECT c.title, c.duration_months, c.fee, a.status FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.student_id = ?", [studentId], (err, course) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.status(200).json({ personal: student, education: education || null, course: course || null });
            });
        });
    });
};

const updatePersonal = (req, res) => {
    const studentId = req.user?.id || req.studentId;
    if (!studentId) return res.status(401).json({ error: "Unauthorized" });

    const { full_name, phone, city } = req.body;
    if (!full_name && !phone && !city) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    db.run(
        "UPDATE students SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), city = COALESCE(?, city) WHERE id = ?",
        [full_name || null, phone || null, city || null, studentId],
        function (err) {
            if (err) return res.status(500).json({ error: "Database error" });
            if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
            res.status(200).json({ message: "Personal info updated successfully" });
        }
    );
};

const updateEducation = (req, res) => {
    const studentId = req.user?.id || req.studentId;
    if (!studentId) return res.status(401).json({ error: "Unauthorized" });

    const { tenth_board, tenth_percentage, twelfth_board, twelfth_percentage } = req.body;
    if (!tenth_board && !tenth_percentage && !twelfth_board && !twelfth_percentage) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    db.get("SELECT id FROM education_details WHERE student_id = ?", [studentId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (row) {
            db.run(
                "UPDATE education_details SET tenth_board = COALESCE(?, tenth_board), tenth_percentage = COALESCE(?, tenth_percentage), twelfth_board = COALESCE(?, twelfth_board), twelfth_percentage = COALESCE(?, twelfth_percentage) WHERE student_id = ?",
                [tenth_board || null, tenth_percentage || null, twelfth_board || null, twelfth_percentage || null, studentId],
                function (err) {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.status(200).json({ message: "Education details updated successfully" });
                }
            );
        } else {
            db.run(
                "INSERT INTO education_details (student_id, tenth_board, tenth_percentage, twelfth_board, twelfth_percentage) VALUES (?, ?, ?, ?, ?)",
                [studentId, tenth_board || null, tenth_percentage || null, twelfth_board || null, twelfth_percentage || null],
                function (err) {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.status(201).json({ message: "Education details added successfully" });
                }
            );
        }
    });
};

module.exports = { getProfile, updatePersonal, updateEducation };
