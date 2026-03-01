const db = require('../db');
const { runSqlAgent, summarizeProfile } = require('../agents/sqlAgent');

const msg = (text) => ({ reply: text });

const lower = (s) => (s || '').toLowerCase();


const extractValue = (message) => {
    const match = message.match(/\b(?:to|as|:|is)\s+([\w\s.%@+\-]+)$/i);
    return match ? match[1].trim() : null;
};
const isUpdate = (m) => /\b(update|change|set)\b/i.test(m);
const isRead = (m) => /\b(what|show|tell|get|my)\b/i.test(m);
const isSummary = (m) => {
    const text = lower(m);
    return text.includes('summarize my profile') || text.includes('brief overview');
};
const STUDENT_FIELDS = {
    'full name': 'full_name',
    'name': 'full_name',
    'phone number': 'phone',
    'mobile': 'phone',
    'phone': 'phone',
    'city': 'city',
    'location': 'city',
};
const EDUCATION_FIELDS = {
    'tenth percentage': 'tenth_percentage',
    '10th percentage': 'tenth_percentage',
    'tenth %': 'tenth_percentage',
    '10th %': 'tenth_percentage',
    'twelfth percentage': 'twelfth_percentage',
    '12th percentage': 'twelfth_percentage',
    'twelfth %': 'twelfth_percentage',
    '12th %': 'twelfth_percentage',
    'tenth board': 'tenth_board',
    '10th board': 'tenth_board',
    'twelfth board': 'twelfth_board',
    '12th board': 'twelfth_board',
};
const STUDENT_READ_FIELDS = {
    'full name': 'full_name',
    'my name': 'full_name',
    'name': 'full_name',
    'email': 'email',
    'phone': 'phone',
    'phone number': 'phone',
    'mobile': 'phone',
    'city': 'city',
    'location': 'city',
};
const READ_FIELDS = {
    'tenth percentage': 'tenth_percentage',
    '10th percentage': 'tenth_percentage',
    'tenth %': 'tenth_percentage',
    '10th %': 'tenth_percentage',
    'twelfth percentage': 'twelfth_percentage',
    '12th percentage': 'twelfth_percentage',
    'twelfth %': 'twelfth_percentage',
    '12th %': 'twelfth_percentage',
    'tenth board': 'tenth_board',
    '10th board': 'tenth_board',
    'twelfth board': 'twelfth_board',
    '12th board': 'twelfth_board',
    'course': 'course',
    'status': 'status',
    'enrolled': 'course',
    'application': 'status',
};

const matchKey = (message, map) => {
    const m = lower(message);
    return Object.keys(map)
        .sort((a, b) => b.length - a.length)
        .find((key) => m.includes(key)) || null;
};


const handleSummary = async (studentId, res) => {
    try {
        const student = await new Promise((resolve, reject) => {
            db.get(`SELECT id, full_name, email, phone, city FROM students WHERE id = ?`, [studentId], (err, row) => err ? reject(err) : resolve(row));
        });
        const education = await new Promise((resolve, reject) => {
            db.get(`SELECT tenth_board, tenth_percentage, twelfth_board, twelfth_percentage FROM education_details WHERE student_id = ?`, [studentId], (err, row) => err ? reject(err) : resolve(row));
        });
        const applications = await new Promise((resolve, reject) => {
            db.all(`SELECT c.title as course_title, c.duration_months, c.fee, a.status FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.student_id = ?`, [studentId], (err, rows) => err ? reject(err) : resolve(rows));
        });

        const profileData = {
            personal: student || {},
            education: education || "No education details provided for this student.",
            applications: applications || []
        };

        const summaryText = await summarizeProfile(profileData);
        return res.json(msg(summaryText));
    } catch (error) {
        console.error("Summary error:", error);
        return res.status(500).json(msg("Failed to summarize profile."));
    }
};

const updateStudentField = (studentId, column, value, res) => {
    const sql = `UPDATE students SET ${column} = ? WHERE id = ?`;
    db.run(sql, [value, studentId], (err) => {
        if (err) {
            console.error('[chat] updateStudentField error:', err.message);
            return res.status(500).json(msg('Sorry, something went wrong while updating your profile.'));
        }
        const label = column.replace(/_/g, ' ');
        return res.json(msg(`Updated your ${label} to "${value}" successfully.`));
    });
};

const updateEducationField = (studentId, column, value, res) => {
    db.get(
        'SELECT student_id FROM education_details WHERE student_id = ?',
        [studentId],
        (err, row) => {
            if (err) {
                console.error('[chat] education lookup error:', err.message);
                return res.status(500).json(msg('Sorry, something went wrong while updating education details.'));
            }

            if (row) {
                const sql = `UPDATE education_details SET ${column} = ? WHERE student_id = ?`;
                db.run(sql, [value, studentId], (err) => {
                    if (err) {
                        return res.status(500).json(msg('Sorry, something went wrong while updating education details.'));
                    }
                    const label = column.replace(/_/g, ' ');
                    return res.json(msg(`Updated your ${label} to "${value}" successfully.`));
                });
            } else {
                const sql = `INSERT INTO education_details (student_id, ${column}) VALUES (?, ?)`;
                db.run(sql, [studentId, value], (err) => {
                    if (err) {
                        return res.status(500).json(msg('Sorry, something went wrong while saving education details.'));
                    }
                    const label = column.replace(/_/g, ' ');
                    return res.json(msg(`Saved your ${label} as "${value}" successfully.`));
                });
            }
        }
    );
};
const readStudentField = (studentId, column, res) => {
    db.get(
        `SELECT full_name, email, phone, city FROM students WHERE id = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error('[chat] readStudentField error:', err.message);
                return res.status(500).json(msg('Sorry, I could not read your profile.'));
            }
            if (!row) return res.json(msg("I couldn't find your profile."));

            const value = row[column];
            const label = column.replace(/_/g, ' ');
            if (value === null || value === undefined || value === '') {
                return res.json(msg(`Your ${label} hasn't been recorded yet.`));
            }
            return res.json(msg(`Your ${label} is: ${value}`));
        }
    );
};
const readEducationField = (studentId, column, res) => {
    db.get(
        `SELECT tenth_board, tenth_percentage, twelfth_board, twelfth_percentage
         FROM education_details WHERE student_id = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error('[chat] readEducationField error:', err.message);
                return res.status(500).json(msg('Sorry, I could not read your education details.'));
            }
            if (!row) return res.json(msg("I don't have any education details on file for you yet."));

            const value = row[column];
            const label = column.replace(/_/g, ' ');
            if (value === null || value === undefined || value === '') {
                return res.json(msg(`Your ${label} hasn't been recorded yet.`));
            }
            const isPercentage = column.includes('percentage');
            return res.json(msg(`Your ${label} is ${value}${isPercentage ? '%' : ''}.`));
        }
    );
};

const readCourse = (studentId, includeStatus, res) => {
    db.get(
        `SELECT c.title, c.duration_months, a.status
         FROM applications a
         JOIN courses c ON a.course_id = c.id
         WHERE a.student_id = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error('[chat] readCourse error:', err.message);
                return res.status(500).json(msg('Sorry, I could not fetch your course details.'));
            }
            if (!row) {
                return res.json(msg("You don't have an active course application on file."));
            }
            if (includeStatus) {
                return res.json(msg(`Your application status for "${row.title}" is: ${row.status}.`));
            }
            return res.json(msg(`You are enrolled in "${row.title}" (${row.duration_months} months).`));
        }
    );
};

const handleRuleBasedFallback = (studentId, m, res, agentError = false) => {
    if (isUpdate(m)) {
        const value = extractValue(m);
        if (value) {
            const studentKey = matchKey(m, STUDENT_FIELDS);
            if (studentKey) return updateStudentField(studentId, STUDENT_FIELDS[studentKey], value, res);

            const educationKey = matchKey(m, EDUCATION_FIELDS);
            if (educationKey) return updateEducationField(studentId, EDUCATION_FIELDS[educationKey], value, res);
        }
    }

    if (isRead(m)) {
        const studentReadKey = matchKey(m, STUDENT_READ_FIELDS);
        if (studentReadKey) return readStudentField(studentId, STUDENT_READ_FIELDS[studentReadKey], res);

        const readKey = matchKey(m, READ_FIELDS);
        if (readKey) {
            const field = READ_FIELDS[readKey];
            if (field === 'tenth_percentage' || field === 'twelfth_percentage') return readEducationField(studentId, field, res);
            if (field === 'tenth_board' || field === 'twelfth_board') return readEducationField(studentId, field, res);
            if (field === 'course') return readCourse(studentId, false, res);
            if (field === 'status') return readCourse(studentId, true, res);
        }
    }

    const messageOut = agentError
        ? "I could not generate an answer right now. I can help you with: viewing or updating your name, email, phone, city, 10th/12th board & percentage, course, and application status."
        : "I can help you view or update your profile details — try asking about your name, phone, city, 10th/12th percentage, course, or application status.";

    return res.json(msg(messageOut));
};


const chat = async (req, res) => {
    const studentId = req.user?.id || req.studentId;
    if (!studentId) {
        return res.status(401).json(msg('Unauthorized.'));
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json(msg('Please send a message.'));
    }

    const m = message.trim();
    if (isSummary(m)) {
        return await handleSummary(studentId, res);
    }
    const hasValue = !!extractValue(m);
    const isDeterministicUpdate = isUpdate(m) && hasValue &&
        (matchKey(m, STUDENT_FIELDS) || matchKey(m, EDUCATION_FIELDS));
    const isDeterministicRead = isRead(m) &&
        (matchKey(m, STUDENT_READ_FIELDS) || matchKey(m, READ_FIELDS));

    if (isDeterministicUpdate || isDeterministicRead) {
        return handleRuleBasedFallback(studentId, m, res);
    }
    try {
        const reply = await runSqlAgent(studentId, m);
        return res.json(msg(reply));
    } catch (error) {
        console.error("Langchain SQL Agent Failed:", error);
        return handleRuleBasedFallback(studentId, m, res, true);
    }
};

module.exports = { chat };
