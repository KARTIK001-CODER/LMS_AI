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
module.exports = { getProfile };
