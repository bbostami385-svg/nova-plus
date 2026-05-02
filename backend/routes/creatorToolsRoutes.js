import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get creator dashboard
router.get('/dashboard', auth, (req, res) => {
  res.json({ success: true, message: 'Get creator dashboard' });
});

// Get analytics
router.get('/analytics', auth, (req, res) => {
  res.json({ success: true, message: 'Get analytics' });
});

export default router;
