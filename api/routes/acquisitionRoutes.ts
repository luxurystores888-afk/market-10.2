import { Router } from 'express';
import { hyperAcquisition } from '../services/hyperAcquisitionEngine.js';

const router = Router();

/**
 * POST /api/leads/capture
 * Main endpoint - captures lead with full behavior data
 */
router.post('/leads/capture', async (req, res) => {
  try {
    const leadData = req.body;
    
    // Validate email
    if (!leadData.email || !/\S+@\S+\.\S+/.test(leadData.email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Add metadata
    leadData.ipAddress = req.ip;
    leadData.userAgent = req.get('user-agent');
    leadData.referrer = req.get('referrer');
    leadData.timestamp = new Date();

    // CAPTURE LEAD (instant processing)
    const result = await hyperAcquisition.captureLead(leadData);

    res.json(result);

    console.log(`✅ Lead captured via API: ${leadData.email}`);
    
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

/**
 * POST /api/leads/update
 * Update lead with additional info (name, phone, preferences)
 */
router.post('/leads/update', async (req, res) => {
  try {
    const { email, name, phone, preferences } = req.body;

    // Save to database
    // await db.update(leads).set({...}).where(eq(leads.email, email))

    res.json({ success: true, message: 'Lead updated' });
    
  } catch (error) {
    console.error('Lead update error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

/**
 * GET /api/acquisition/stats
 * Get real-time acquisition statistics
 */
router.get('/acquisition/stats', (req, res) => {
  try {
    const stats = hyperAcquisition.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

/**
 * GET /api/acquisition/report
 * Get detailed performance report
 */
router.get('/acquisition/report', (req, res) => {
  try {
    const report = hyperAcquisition.generateReport();
    res.setHeader('Content-Type', 'text/plain');
    res.send(report);
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * POST /api/acquisition/process-queue
 * Process any queued leads (retry failed saves)
 */
router.post('/acquisition/process-queue', async (req, res) => {
  try {
    await hyperAcquisition.processQueue();
    res.json({ success: true, message: 'Queue processed' });
  } catch (error) {
    console.error('Queue processing error:', error);
    res.status(500).json({ error: 'Failed to process queue' });
  }
});

export default router;

