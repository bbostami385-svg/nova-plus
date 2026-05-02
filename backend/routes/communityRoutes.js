import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get groups
router.get('/groups', (req, res) => {
  res.json({ success: true, message: 'Get groups', groups: [] });
});

// Create group
router.post('/groups', auth, (req, res) => {
  res.json({ success: true, message: 'Group created' });
});

// Get hashtags
router.get('/hashtags', (req, res) => {
  res.json({ success: true, message: 'Get hashtags', hashtags: [] });
});

export default router;
