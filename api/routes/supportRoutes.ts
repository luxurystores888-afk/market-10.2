// 💬 CUSTOMER SUPPORT & LIVE CHAT API ROUTES
import express from 'express';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../validation';
import { storage } from '../storage';
import { aiShoppingAssistant } from '../services/aiShoppingAssistant'; // Assuming this exists for AI responses

const router = express.Router();

const ticketSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const sessionSchema = z.object({
  category: z.string().optional(),
});

const messageSchema = z.object({
  sessionId: z.number(),
  message: z.string().min(1),
});

// Create support ticket
router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    
    const ticket = await storage.createSupportTicket({
      userId: req.user.id,
      subject,
      description,
      category,
      priority: priority || 'medium',
    });
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create ticket', suggestion: 'Please try again or contact support' });
  }
});

// Get user tickets
router.get('/tickets', authenticate, async (req, res) => {
  try {
    const tickets = await storage.getUserTickets(req.user.id);
    
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tickets', suggestion: 'Please try again or contact support' });
  }
});

// Live chat endpoints
router.post('/chat/sessions', authenticate, async (req, res) => {
  try {
    const { category } = req.body;
    
    const session = await storage.createChatSession({
      userId: req.user.id,
      category,
      agentId: 'ai-assistant', // Default to bot
    });
    
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create chat session', suggestion: 'Please try again or contact support' });
  }
});

router.post('/chat/messages', authenticate, async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    const sentMessage = await storage.sendChatMessage({
      sessionId,
      sender: 'user',
      content: message,
    });

    // If sender is user, generate AI response
    const aiResponse = await aiShoppingAssistant.generateResponse(message); // Assuming method exists
    const aiMessage = await storage.sendChatMessage({
      sessionId,
      sender: 'bot',
      content: aiResponse,
    });

    if (message.toLowerCase().includes('buy')) {
      aiMessage.content += ' [Buy Now: /cart/add?product=123]';
    }

    res.json({ success: true, response: aiMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message', suggestion: 'Please try again or contact support' });
  }
});

export default router;
