import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get feed
router.get('/feed', auth, (req, res) => {
  res.json({ success: true, message: 'Get feed', posts: [] });
});

// Create post
router.post('/', auth, (req, res) => {
  res.json({ success: true, message: 'Create post' });
});

// Get post
router.get('/:postId', (req, res) => {
  res.json({ success: true, message: 'Get post' });
});

// Like post
router.post('/:postId/like', auth, (req, res) => {
  res.json({ success: true, message: 'Like post' });
});

export default router;
