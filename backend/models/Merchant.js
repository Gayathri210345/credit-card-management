const mongoose = require('mongoose');
const merchantSchema = new mongoose.Schema({
  businessname: { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  address:      { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Merchant', merchantSchema);
