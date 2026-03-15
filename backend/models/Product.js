const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  merchant_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  product_name: { type: String, required: true },
  price:        { type: Number, required: true },
  description:  { type: String },
  image_url:    { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
