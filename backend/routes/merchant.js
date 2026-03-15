const router  = require('express').Router();
const protect = require('../middleware/auth');
const Product     = require('../models/Product');
const Transaction = require('../models/Transaction');

/* ─── Dashboard ─────────────────────────────────── */
router.get('/dashboard', protect(['merchant']), async (req, res) => {
  try {
    const products = await Product.find({ merchant_id: req.user.id });
    const txns = await Transaction.find({ merchant_id: req.user.id, type: 'purchase', status: 'completed' })
      .populate('product_id', 'product_name price')
      .populate('customer_id', 'fullname email')
      .sort({ createdAt: -1 });
    const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
    res.json({
      totalProducts: products.length,
      totalSales:    txns.length,
      totalRevenue,
      recentSales:   txns.slice(0, 10)
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Add product ───────────────────────────────── */
router.post('/products', protect(['merchant']), async (req, res) => {
  try {
    const { product_name, price, description, image_url } = req.body;
    if (!product_name || !price)
      return res.status(400).json({ message: 'Product name and price are required.' });
    const product = await Product.create({
      merchant_id: req.user.id, product_name,
      price: parseFloat(price), description, image_url
    });
    res.json({ message: 'Product added successfully!', product });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Get my products ───────────────────────────── */
router.get('/products', protect(['merchant']), async (req, res) => {
  try {
    const products = await Product.find({ merchant_id: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Update product ────────────────────────────── */
router.put('/products/:id', protect(['merchant']), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, merchant_id: req.user.id },
      { ...req.body }, { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated!', product });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

/* ─── Delete product ────────────────────────────── */
router.delete('/products/:id', protect(['merchant']), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, merchant_id: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
