// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const Expense = require('./models/Expense');
const Saving = require('./models/Saving');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Expenses API ---
app.post('/api/expenses', upload.single('invoice'), async (req, res) => {
  const email = req.headers['user-email'];
  const { name, date, total, category, description } = req.body;
  const invoice = req.file ? req.file.filename : null;

  if (!name || !date || !total || !category || !email) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newExpense = new Expense({ name, date, total, category, description, invoice, email });
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving expense", error: err.message });
  }
});

app.get('/api/expenses', async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const expenses = await Expense.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err.message });
  }
});

app.get('/api/expenses/category-count', async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const counts = await Expense.aggregate([
      { $match: { email } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const formatted = counts.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {});
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Category count failed", error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

app.put('/api/expenses/:id', upload.single('invoice'), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.invoice = req.file.filename;
    const updated = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// --- Savings API ---
app.get("/api/savings", async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const savings = await Saving.find({ email }).sort({ createdAt: -1 });
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching savings", error: err.message });
  }
});

app.post("/api/savings", async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const data = { ...req.body, email };
    const newSaving = new Saving(data);
    await newSaving.save();
    res.status(201).json(newSaving);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

app.put("/api/savings/:id", async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const updated = await Saving.findOneAndUpdate({ _id: req.params.id, email }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Saving not found or unauthorized" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

app.delete("/api/savings/:id", async (req, res) => {
  const email = req.headers['user-email'];
  try {
    const deleted = await Saving.findOneAndDelete({ _id: req.params.id, email });
    if (!deleted) return res.status(404).json({ message: "Saving not found or unauthorized" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
});

// --- Dashboard Reports ---
const getEmail = (req) => req.headers['user-email'];

app.get("/api/reports/day", async (req, res) => {
  const email = getEmail(req);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const result = await Expense.aggregate([
      { $match: { email, createdAt: { $gte: today } } },
      { $group: { _id: "$category", total: { $sum: "$total" } } }
    ]);
    res.json(result.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {}));
  } catch (err) {
    res.status(500).json({ message: "Day report failed", error: err.message });
  }
});

app.get("/api/reports/week", async (req, res) => {
  const email = getEmail(req);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  try {
    const result = await Expense.aggregate([
      { $match: { email, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, total: { $sum: "$total" } } }
    ]);
    const data = Array(7).fill(0);
    result.forEach(r => data[r._id - 1] = r.total);
    res.json({ days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], expenses: data });
  } catch (err) {
    res.status(500).json({ message: "Week report failed", error: err.message });
  }
});

app.get("/api/reports/month", async (req, res) => {
  const email = getEmail(req);
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  try {
    const result = await Expense.aggregate([
      { $match: { email, createdAt: { $gte: yearStart } } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$total" } } }
    ]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map((month, idx) => {
      const item = result.find(r => r._id === idx + 1);
      return { month, expense: item ? item.total : 0 };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Month report failed", error: err.message });
  }
});

app.get("/api/reports/year", async (req, res) => {
  const email = getEmail(req);
  try {
    const result = await Expense.aggregate([
      { $match: { email, createdAt: { $exists: true } } },
      { $addFields: { createdAtDate: { $toDate: "$createdAt" } } },
      { $group: { _id: { $year: "$createdAtDate" }, total: { $sum: "$total" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(result.map(r => ({ year: r._id, expense: r.total })));
  } catch (err) {
    res.status(500).json({ message: "Year report failed", error: err.message });
  }
});

app.get("/api/reports/custom", async (req, res) => {
  const email = getEmail(req);
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    const result = await Expense.aggregate([
      { $match: { email, createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$category", total: { $sum: "$total" } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Custom report failed", error: err.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('✅ Expense Tracker API is running...');
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
