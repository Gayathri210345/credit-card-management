const router      = require('express').Router();
const protect     = require('../middleware/auth');
const Application = require('../models/Application');
const Customer    = require('../models/Customer');
const Merchant    = require('../models/Merchant');
const Transaction = require('../models/Transaction');

/* ─── Dashboard stats ───────────────────────────── */
router.get('/dashboard', protect(['admin']), async (req, res) => {
  try {
    const [total, pending, approved, rejected, customers, merchants, revenue] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
      Customer.countDocuments(),
      Merchant.countDocuments(),
      Transaction.aggregate([{ $match: { type: 'purchase', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);
    res.json({ total, pending, approved, rejected, customers, merchants, revenue: revenue[0]?.total || 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── All applications ──────────────────────────── */
router.get('/applications', protect(['admin']), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const apps = await Application.find(filter).sort({ createdAt: -1 });
    res.json(apps);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Update application status ─────────────────── */
router.patch('/applications/:id/status', protect(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status))
      return res.status(400).json({ message: 'Invalid status value' });
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: `Application ${status} successfully`, app });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── All customers ─────────────────────────────── */
router.get('/customers', protect(['admin']), async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── All merchants ─────────────────────────────── */
router.get('/merchants', protect(['admin']), async (req, res) => {
  try {
    const merchants = await Merchant.find().select('-password').sort({ createdAt: -1 });
    res.json(merchants);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
