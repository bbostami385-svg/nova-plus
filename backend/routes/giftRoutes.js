import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get gifts
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get gifts', gifts: [] });
});

// Send gift
router.post('/send', auth, (req, res) => {
  res.json({ success: true, message: 'Gift sent' });
});

export default router;
