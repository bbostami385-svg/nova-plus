import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get notifications
router.get('/', auth, (req, res) => {
  res.json({ success: true, message: 'Get notifications', notifications: [] });
});

// Mark as read
router.put('/:notificationId/read', auth, (req, res) => {
  res.json({ success: true, message: 'Notification marked as read' });
});

export default router;
