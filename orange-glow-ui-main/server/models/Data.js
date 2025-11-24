const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  type: { type: String, default: 'other' }, // patient, visit, drug, prescription, transaction, complaint
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better query performance
DataSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Data', DataSchema);