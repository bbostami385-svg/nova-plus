import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get achievements
router.get('/', auth, (req, res) => {
  res.json({ success: true, message: 'Get achievements', achievements: [] });
});

// Get badges
router.get('/badges', auth, (req, res) => {
  res.json({ success: true, message: 'Get badges', badges: [] });
});

export default router;
