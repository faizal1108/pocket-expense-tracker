const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  email: { type: String, required: true }, // no default, must be sent from frontend
  name: { type: String, required: true },
  date: { type: Date, required: true },
  total: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  invoice: { type: String } // file name of uploaded invoice
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
