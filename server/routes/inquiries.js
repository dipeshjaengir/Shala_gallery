import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Inquiry } from '../models/Inquiry.js';
import { requireAdmin } from '../middleware/auth.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/inquiries - Public inquiry submission
router.post('/', inquiryLimiter, async (req, res) => {
  const { fullName, email, inquiryType, artworkTitle, dimensions, budgetRange, message } = req.body;

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return res.status(400).json({ status: 'error', message: 'Full name is required.' });
  }

  if (!email || typeof email !== 'string' || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ status: 'error', message: 'A valid email address is required.' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ status: 'error', message: 'Message details are required.' });
  }

  // Prevent duplicate submissions within 60 seconds
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ipHash = crypto.createHash('sha256').update(`${ip}-${email.trim().toLowerCase()}-${message.trim()}`).digest('hex');

  try {
    const recentDuplicate = await Inquiry.findOne({
      ipHash,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentDuplicate) {
      return res.status(429).json({
        status: 'error',
        message: 'A duplicate inquiry was recently received. Thank you for your patience.',
      });
    }

    const inquiry = await Inquiry.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      inquiryType: typeof inquiryType === 'string' && inquiryType.trim() ? inquiryType.trim() : 'Custom Commission',
      artworkTitle: typeof artworkTitle === 'string' ? artworkTitle.trim() : '',
      dimensions: typeof dimensions === 'string' ? dimensions.trim() : '',
      budgetRange: typeof budgetRange === 'string' ? budgetRange.trim() : '',
      message: message.trim(),
      status: 'unread',
      ipHash,
    });

    // Privacy-safe log: Mask customer personal data from server logs
    console.log(`[Inquiries] New genuine inquiry received (ID: ${inquiry._id}, type: ${inquiry.inquiryType})`);

    res.status(201).json({
      status: 'ok',
      message: 'Your inquiry has been received. Asma will review your request personally.',
    });
  } catch (error) {
    console.error('[Inquiry Error]', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Unable to process your inquiry right now. Please reach out to shalagallery@gmail.com directly.',
    });
  }
});

// GET /api/inquiries - Protected Admin View
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        status: 'ok',
        count: 0,
        data: [],
      });
    }
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({
      status: 'ok',
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error('[Admin Inquiries Error]', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve inquiries.' });
  }
});

// PATCH /api/inquiries/:id - Protected Admin Status Update
router.patch('/:id', requireAdmin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid inquiry identifier.' });
  }

  const { status } = req.body;
  const allowedStatuses = ['unread', 'read', 'responded', 'archived'];

  if (!status || typeof status !== 'string' || !allowedStatuses.includes(status)) {
    return res.status(400).json({ status: 'error', message: 'Invalid status value.' });
  }

  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Inquiry not found.' });
    }
    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update inquiry status.' });
  }
});

// DELETE /api/inquiries/:id - Protected Admin Delete
router.delete('/:id', requireAdmin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid inquiry identifier.' });
  }

  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Inquiry not found.' });
    }
    res.json({ status: 'ok', message: 'Inquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete inquiry.' });
  }
});

export default router;
