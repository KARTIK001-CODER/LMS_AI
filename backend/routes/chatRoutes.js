const express = require('express');
const { chat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /chat
// Headers: Authorization: Bearer <token>
// Body: { "message": "..." }
router.post('/', authMiddleware, chat);

module.exports = router;
