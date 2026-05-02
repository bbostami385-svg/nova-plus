import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get conversations
router.get('/conversations', auth, (req, res) => {
  res.json({ success: true, message: 'Get conversations', conversations: [] });
});

// Send message
router.post('/send', auth, (req, res) => {
  res.json({ success: true, message: 'Message sent' });
});

// Get conversation
router.get('/:userId', auth, (req, res) => {
  res.json({ success: true, message: 'Get conversation', messages: [] });
});

export default router;
