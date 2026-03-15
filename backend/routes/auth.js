const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Admin      = require('../models/Admin');
const Customer   = require('../models/Customer');
const Merchant   = require('../models/Merchant');
const Application = require('../models/Application');

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

/* ─── Admin seed (run once) ─────────────────────── */
router.post('/admin/seed', async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists. Login with admin / admin123' });
    const hash = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hash });
    res.json({ message: 'Admin created! Username: admin  Password: admin123' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin login ───────────────────────────────── */
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(400).json({ message: 'Invalid username or password' });
    res.json({ token: sign({ id: admin._id, role: 'admin', name: admin.username }) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Customer register ─────────────────────────── */
router.post('/customer/register', async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;
    if (!fullname || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    // Must have an approved application
    const approved = await Application.findOne({ email: email.toLowerCase(), status: 'approved' });
    if (!approved)
      return res.status(400).json({ message: 'Your application must be approved before registering.' });

    const exists = await Customer.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'Email already registered. Please login.' });

    const hash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ fullname, email: email.toLowerCase(), phone, password: hash });
    res.json({ message: 'Registration successful! You can now login.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Customer login ────────────────────────────── */
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer || !(await bcrypt.compare(password, customer.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json({
      token: sign({ id: customer._id, role: 'customer', name: customer.fullname, email: customer.email })
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Merchant register ─────────────────────────── */
router.post('/merchant/register', async (req, res) => {
  try {
    const { businessname, email, password, address } = req.body;
    if (!businessname || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const exists = await Merchant.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'Email already registered.' });
    const hash = await bcrypt.hash(password, 10);
    await Merchant.create({ businessname, email: email.toLowerCase(), password: hash, address });
    res.json({ message: 'Merchant registered successfully! You can now login.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Merchant login ────────────────────────────── */
router.post('/merchant/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const merchant = await Merchant.findOne({ email: email.toLowerCase() });
    if (!merchant || !(await bcrypt.compare(password, merchant.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json({
      token: sign({ id: merchant._id, role: 'merchant', name: merchant.businessname })
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
