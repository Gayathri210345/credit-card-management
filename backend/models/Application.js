const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  fullname:      { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  fathername:    { type: String },
  address:       { type: String },
  state:         { type: String },
  city:          { type: String },
  pincode:       { type: String },
  occupation:    { type: String },
  annual_income: { type: Number, default: 0 },
  pan_number:    { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);
