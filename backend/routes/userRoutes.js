import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:userId', auth, (req, res) => {
  res.json({ success: true, message: 'Get user profile' });
});

// Update user profile
router.put('/:userId', auth, (req, res) => {
  res.json({ success: true, message: 'Update user profile' });
});

// Follow user
router.post('/:userId/follow', auth, (req, res) => {
  res.json({ success: true, message: 'Follow user' });
});

// Unfollow user
router.delete('/:userId/follow', auth, (req, res) => {
  res.json({ success: true, message: 'Unfollow user' });
});

export default router;
