const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  currentSavings: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String },
  email: { type: String, required: true } // ✅ required and no default
}, { timestamps: true });

module.exports = mongoose.model('Saving', savingSchema);
