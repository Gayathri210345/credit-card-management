const router      = require('express').Router();
const protect     = require('../middleware/auth');
const Application = require('../models/Application');
const Customer    = require('../models/Customer');
const Transaction = require('../models/Transaction');
const Product     = require('../models/Product');

/* ─── Submit CC application (public) ────────────── */
router.post('/apply', async (req, res) => {
  try {
    const { fullname, email, phone, fathername, address, state, city, pincode, occupation, annual_income, pan_number } = req.body;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test((pan_number || '').toUpperCase()))
      return res.status(400).json({ message: 'Invalid PAN format. Use: ABCDE1234F' });
    const existing = await Application.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: 'An application already exists for this email.' });
    const app = await Application.create({
      fullname, email: email.toLowerCase(), phone, fathername, address,
      state, city, pincode, occupation, annual_income: parseFloat(annual_income) || 0,
      pan_number: pan_number.toUpperCase()
    });
    res.json({ message: 'Application submitted successfully! Please wait for admin approval.', app });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Helper: compute credit info ───────────────── */
async function getCreditInfo(customerId, email) {
  const app = await Application.findOne({ email, status: 'approved' });
  if (!app) return { approved: false };
  const credit_limit = (app.annual_income || 0) * 3;
  const [purchases, repayments] = await Promise.all([
    Transaction.find({ customer_id: customerId, type: 'purchase', status: 'completed' }),
    Transaction.find({ customer_id: customerId, type: 'repayment', status: 'completed' })
  ]);
  const total_spent   = purchases.reduce((s, t) => s + t.amount, 0);
  const total_repaid  = repayments.reduce((s, t) => s + t.amount, 0);
  const outstanding   = Math.max(0, total_spent - total_repaid);
  const available     = Math.max(0, credit_limit - outstanding);
  return { approved: true, credit_limit, total_spent, total_repaid, outstanding, available_credit: available, app };
}

/* ─── Get my application ────────────────────────── */
router.get('/application', protect(['customer']), async (req, res) => {
  try {
    const app = await Application.findOne({ email: req.user.email });
    res.json(app);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Dashboard ─────────────────────────────────── */
router.get('/dashboard', protect(['customer']), async (req, res) => {
  try {
    const info = await getCreditInfo(req.user.id, req.user.email);
    res.json(info);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── All products (for browsing) ───────────────── */
router.get('/products', protect(['customer']), async (req, res) => {
  try {
    const products = await Product.find().populate('merchant_id', 'businessname').sort({ createdAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Make purchase ─────────────────────────────── */
router.post('/purchase', protect(['customer']), async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const info = await getCreditInfo(req.user.id, req.user.email);
    if (!info.approved)
      return res.status(400).json({ message: 'No approved credit card found.' });
    if (product.price > info.available_credit)
      return res.status(400).json({ message: `Insufficient credit. Available: ₹${info.available_credit.toFixed(2)}, Required: ₹${product.price}` });

    const txn = await Transaction.create({
      customer_id: req.user.id,
      merchant_id: product.merchant_id,
      product_id:  product._id,
      amount:      product.price,
      type:        'purchase',
      status:      'completed'
    });
    res.json({ message: `Payment successful for "${product.product_name}"`, txn, product });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Make repayment ────────────────────────────── */
router.post('/repay', protect(['customer']), async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Please enter a valid repayment amount.' });
    const txn = await Transaction.create({
      customer_id: req.user.id,
      amount,
      type:   'repayment',
      status: 'completed'
    });
    res.json({ message: `Repayment of ₹${amount.toFixed(2)} successful!`, txn });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Transaction history ───────────────────────── */
router.get('/transactions', protect(['customer']), async (req, res) => {
  try {
    const txns = await Transaction.find({ customer_id: req.user.id })
      .populate('product_id', 'product_name')
      .populate('merchant_id', 'businessname')
      .sort({ createdAt: -1 });
    res.json(txns);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
