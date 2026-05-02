import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get sponsorships
router.get('/', auth, (req, res) => {
  res.json({ success: true, message: 'Get sponsorships', sponsorships: [] });
});

// Create sponsorship
router.post('/', auth, (req, res) => {
  res.json({ success: true, message: 'Sponsorship created' });
});

export default router;
