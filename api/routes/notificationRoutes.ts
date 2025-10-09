import express from 'express';
const router = express.Router();

router.post('/geo', (req, res) => {
  const { lat, lng } = req.body;
  // Mock logic: if near store, send deal
  const notification = (lat > 0 && lng > 0) ? 'Nearby deal: 10% off!' : null;
  res.json({ notification });
});

export default router;
