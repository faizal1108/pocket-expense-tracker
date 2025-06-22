// src/pages/Expense.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../pages/css/Expense.css';
import Human from "../assets/human.gif";
import axiosInstance from "../api/axiosInstance";

const Expense = () => {
  const location = useLocation();
  const editData = location.state?.expense || null;

  const [formData, setFormData] = useState({
    name: editData?.name || '',
    date: editData?.date ? editData.date.slice(0, 10) : '',
    total: editData?.total || '',
    category: editData?.category || '',
    description: editData?.description || '',
  });

  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setInvoiceFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (invoiceFile) {
      payload.append('invoice', invoiceFile);
    }

    try {
      const url = editData
        ? `/expenses/${editData._id}` // ✅ FIXED: removed duplicate /api
        : `/expenses`;

      const method = editData ? 'put' : 'post';

      const response = await axiosInstance({
        method,
        url,
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(`✅ Expense ${editData ? 'updated' : 'saved'} successfully!`);

      setFormData({
        name: '',
        date: '',
        total: '',
        category: '',
        description: '',
      });
      setInvoiceFile(null);
    } catch (err) {
      console.error("❌ Error saving expense:", err);
      alert("Failed to save expense");
    }
  };

  return (
    <div className="expense-container">
      <h2>{editData ? 'Edit Expense' : 'New Expense'}</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="expense-name">Name*</label>
          <input
            type="text"
            id="expense-name"
            name="name"
            placeholder="Enter name"
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-date">Date*</label>
          <input
            type="date"
            id="expense-date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-total">Total*</label>
          <div className="total-inline">
            <input
              type="number"
              id="expense-total"
              name="total"
              placeholder="Enter amount"
              min={0}
              value={formData.total}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <span className="inr-tag">INR</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-category">Category*</label>
          <select
            id="expense-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Type</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Supplies">Supplies</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="expense-description">Description</label>
          <textarea
            id="expense-description"
            name="description"
            placeholder="Add a description..."
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="upload-invoice">Upload Invoice</label>
          <div className="upload-box">
            <label htmlFor="upload-invoice" className="upload-label">
              +
              <p>Upload an invoice</p>
            </label>
            <input
              type="file"
              id="upload-invoice"
              name="invoice"
              hidden
              onChange={handleFileChange}
            />
            {invoiceFile && <p style={{ marginTop: "5px" }}>{invoiceFile.name}</p>}
          </div>
        </div>

        <div className="btn-row">
          <button type="submit" className="btn save">
            {editData ? 'Update' : 'Save'}
          </button>
        </div>
      </form>

      <div className="human-image">
        <img src={Human} alt="Animated character" />
      </div>
    </div>
  );
};

export default Expense;
