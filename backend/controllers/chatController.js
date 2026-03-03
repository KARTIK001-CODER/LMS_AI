const db = require('../db');
const { runSqlAgent } = require('../agents/sqlAgent');
const { ChatGroq } = require('@langchain/groq');
const { ChatOpenAI } = require('@langchain/openai');

const msg = (text) => ({ reply: text });
const lower = (s) => (s || '').toLowerCase();
const extractValue = (m) => { const x = m.match(/\b(?:to|as|:|is)\s+([\w\s.%@+\-]+)$/i); return x ? x[1].trim() : null; };
const isUpdate = (m) => /\b(update|change|set)\b/i.test(m);
const isRead = (m) => /\b(what|show|tell|get|my)\b/i.test(m);
const matchKey = (msg, map) => { const m = lower(msg); return Object.keys(map).sort((a, b) => b.length - a.length).find(k => m.includes(k)) || null; };

const isSummary = (m) => {
    const t = lower(m);
    return ['summarize my profile', 'summary of my profile', 'profile summary', 'brief of my profile',
        'brief overview', 'profile overview', 'tell me about my profile', 'overview of my profile',
        'about my profile', 'describe my profile', 'what is my profile', "what's my profile"
    ].some(p => t.includes(p));
};

const isAnalytical = (m) => {
    const t = lower(m);
    return (
        t.includes('better than') || t.includes('compare') || t.includes('vs') ||
        t.includes('difference between') || t.includes('higher than') || t.includes('lower than') ||
        t.includes('academically') || t.includes('how am i doing') || t.includes('how have i done') ||
        (t.includes('duration') && t.includes('fee')) || (t.includes('course') && t.includes('fee')) ||
        (t.includes('course') && t.includes('duration')) || t.includes('about my education') ||
        t.includes('education details') || t.includes('performance') || t.includes('academic')
    );
};

const STUDENT_FIELDS = { 'full name': 'full_name', name: 'full_name', 'phone number': 'phone', mobile: 'phone', phone: 'phone', city: 'city', location: 'city' };
const EDUCATION_FIELDS = { 'tenth percentage': 'tenth_percentage', '10th percentage': 'tenth_percentage', 'tenth %': 'tenth_percentage', '10th %': 'tenth_percentage', 'twelfth percentage': 'twelfth_percentage', '12th percentage': 'twelfth_percentage', 'twelfth %': 'twelfth_percentage', '12th %': 'twelfth_percentage', 'tenth board': 'tenth_board', '10th board': 'tenth_board', 'twelfth board': 'twelfth_board', '12th board': 'twelfth_board' };
const STUDENT_READ_FIELDS = { 'full name': 'full_name', 'my name': 'full_name', name: 'full_name', email: 'email', phone: 'phone', 'phone number': 'phone', mobile: 'phone', city: 'city', location: 'city' };
const READ_FIELDS = { ...EDUCATION_FIELDS, course: 'course', status: 'status', enrolled: 'course', application: 'status' };

const getLLM = () => process.env.GROQ_API_KEY
    ? new ChatGroq({ model: 'llama-3.3-70b-versatile', temperature: 0.3 })
    : new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.3 });

const dbGet = (sql, p) => new Promise((res, rej) => db.get(sql, p, (e, row) => e ? rej(e) : res(row)));
const dbAll = (sql, p) => new Promise((res, rej) => db.all(sql, p, (e, rows) => e ? rej(e) : res(rows)));
const dbRun = (sql, p) => new Promise((res, rej) => db.run(sql, p, function (e) { e ? rej(e) : res(this.changes); }));

const handleSummary = async (studentId, res) => {
    try {
        const [student, education, applications] = await Promise.all([
            dbGet(`SELECT full_name, email, phone, city FROM students WHERE id = ?`, [studentId]),
            dbGet(`SELECT tenth_board, tenth_percentage, twelfth_board, twelfth_percentage FROM education_details WHERE student_id = ?`, [studentId]),
            dbAll(`SELECT c.title as course_title, c.duration_months, c.fee, a.status FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.student_id = ?`, [studentId]),
        ]);

        const lines = [];
        if (student) {
            if (student.full_name) lines.push(`Name: ${student.full_name}`);
            if (student.email) lines.push(`Email: ${student.email}`);
            if (student.phone) lines.push(`Phone: ${student.phone}`);
            if (student.city) lines.push(`City: ${student.city}`);
        }
        if (education) {
            if (education.tenth_board) lines.push(`10th Board: ${education.tenth_board}`);
            if (education.tenth_percentage) lines.push(`10th: ${education.tenth_percentage}%`);
            if (education.twelfth_board) lines.push(`12th Board: ${education.twelfth_board}`);
            if (education.twelfth_percentage) lines.push(`12th: ${education.twelfth_percentage}%`);
        }
        applications?.forEach(a => {
            if (a.course_title) lines.push(`Course: ${a.course_title}${a.duration_months ? ` (${a.duration_months} months)` : ''}${a.fee ? `, Fee: ₹${a.fee}` : ''}${a.status ? `, Status: ${a.status}` : ''}`);
        });

        const profileContext = lines.length > 0 ? lines.join('\n') : 'No profile information available.';
        const prompt = `You are a helpful AI for a Student LMS. Write a short, warm 3-5 sentence summary for the student directly (use "you/your"). Use ONLY the info below. Do not mention databases or missing fields explicitly.\n\n${profileContext}`;

        const response = await getLLM().invoke(prompt);
        const text = (response.content || '').trim();
        return res.json(msg(text || "I wasn't able to generate a summary right now."));
    } catch (err) {
        console.error('[summary] error:', err.message);
        return res.status(500).json(msg('Sorry, I ran into an issue preparing your summary.'));
    }
};

const updateStudentField = (studentId, column, value, res) =>
    db.run(`UPDATE students SET ${column} = ? WHERE id = ?`, [value, studentId], (err) =>
        err ? res.status(500).json(msg('Update failed.'))
            : res.json(msg(`Updated your ${column.replace(/_/g, ' ')} to "${value}" successfully.`))
    );

const updateEducationField = (studentId, column, value, res) =>
    db.get('SELECT student_id FROM education_details WHERE student_id = ?', [studentId], (err, row) => {
        if (err) return res.status(500).json(msg('Update failed.'));
        const sql = row
            ? `UPDATE education_details SET ${column} = ? WHERE student_id = ?`
            : `INSERT INTO education_details (student_id, ${column}) VALUES (?, ?)`;
        const params = row ? [value, studentId] : [studentId, value];
        db.run(sql, params, (e) => e
            ? res.status(500).json(msg('Update failed.'))
            : res.json(msg(`Updated your ${column.replace(/_/g, ' ')} to "${value}" successfully.`))
        );
    });

const readStudentField = (studentId, column, res) =>
    db.get(`SELECT full_name, email, phone, city FROM students WHERE id = ?`, [studentId], (err, row) => {
        if (err || !row) return res.json(msg("I couldn't find your profile."));
        const v = row[column];
        return res.json(msg(!v ? `Your ${column.replace(/_/g, ' ')} hasn't been recorded yet.` : `Your ${column.replace(/_/g, ' ')} is: ${v}`));
    });

const readEducationField = (studentId, column, res) =>
    db.get(`SELECT tenth_board, tenth_percentage, twelfth_board, twelfth_percentage FROM education_details WHERE student_id = ?`, [studentId], (err, row) => {
        if (err || !row) return res.json(msg("No education details on file yet."));
        const v = row[column];
        const label = column.replace(/_/g, ' ');
        return res.json(msg(!v ? `Your ${label} hasn't been recorded yet.` : `Your ${label} is ${v}${column.includes('percentage') ? '%' : ''}.`));
    });

const readCourse = (studentId, includeStatus, res) =>
    db.get(`SELECT c.title, c.duration_months, a.status FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.student_id = ?`, [studentId], (err, row) => {
        if (err || !row) return res.json(msg("No active course application on file."));
        return res.json(msg(includeStatus
            ? `Your application status for "${row.title}" is: ${row.status}.`
            : `You are enrolled in "${row.title}" (${row.duration_months} months).`
        ));
    });

const handleRuleBasedFallback = (studentId, m, res, agentError = false) => {
    if (isUpdate(m)) {
        const value = extractValue(m);
        if (value) {
            const sk = matchKey(m, STUDENT_FIELDS);
            if (sk) return updateStudentField(studentId, STUDENT_FIELDS[sk], value, res);
            const ek = matchKey(m, EDUCATION_FIELDS);
            if (ek) return updateEducationField(studentId, EDUCATION_FIELDS[ek], value, res);
        }
    }
    if (isRead(m)) {
        const srk = matchKey(m, STUDENT_READ_FIELDS);
        if (srk) return readStudentField(studentId, STUDENT_READ_FIELDS[srk], res);
        const rk = matchKey(m, READ_FIELDS);
        if (rk) {
            const f = READ_FIELDS[rk];
            if (f === 'course') return readCourse(studentId, false, res);
            if (f === 'status') return readCourse(studentId, true, res);
            return readEducationField(studentId, f, res);
        }
    }
    return res.json(msg(agentError
        ? "I couldn't generate an answer. I can help with: name, email, phone, city, 10th/12th board & percentage, course, and status."
        : "I can help you view or update your profile — try asking about your name, phone, city, education, course, or status."
    ));
};

async function routeToAgent(studentId, m, res) {
    try {
        const reply = await runSqlAgent(studentId, m);
        if (reply) return res.json(msg(reply));
        return handleRuleBasedFallback(studentId, m, res, false);
    } catch (err) {
        console.error('[chat] agent error:', err.message);
        return handleRuleBasedFallback(studentId, m, res, true);
    }
}

const chat = async (req, res) => {
    const studentId = req.user?.id || req.studentId;
    if (!studentId) return res.status(401).json(msg('Unauthorized.'));

    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json(msg('Please send a message.'));

    const m = message.trim();

    if (isSummary(m)) return handleSummary(studentId, res);
    if (isAnalytical(m)) return routeToAgent(studentId, m, res);

    const hasValue = !!extractValue(m);
    const isDeterministicUpdate = isUpdate(m) && hasValue && (matchKey(m, STUDENT_FIELDS) || matchKey(m, EDUCATION_FIELDS));
    const isDeterministicRead = isRead(m) && (matchKey(m, STUDENT_READ_FIELDS) || matchKey(m, READ_FIELDS));

    if (isDeterministicUpdate || isDeterministicRead) return handleRuleBasedFallback(studentId, m, res);

    return routeToAgent(studentId, m, res);
};

module.exports = { chat };
