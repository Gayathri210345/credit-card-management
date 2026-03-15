const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  product_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount:      { type: Number, required: true },
  type:        { type: String, enum: ['purchase','repayment'], default: 'purchase' },
  status:      { type: String, enum: ['completed','failed'], default: 'completed' }
}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);
