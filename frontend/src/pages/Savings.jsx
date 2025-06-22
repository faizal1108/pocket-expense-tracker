import React, { useEffect, useState } from "react";
import "../pages/css/Savings.css";
import axiosInstance from "../api/axiosInstance";

function Savings() {
  const [savings, setSavings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    goalAmount: '',
    currentSavings: '',
    targetDate: '',
    category: '',
    description: ''
  });

  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const res = await axiosInstance.get("/savings");
      setSavings(res.data);
    } catch (err) {
      console.error("❌ Error fetching savings", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axiosInstance.put(`/savings/${editingId}`, formData);
        alert("✅ Saving goal updated");
      } else {
        await axiosInstance.post("/savings", formData);
        alert("✅ Saving goal added");
      }

      setFormData({
        name: '',
        goalAmount: '',
        currentSavings: '',
        targetDate: '',
        category: '',
        description: ''
      });
      setEditingId(null);
      fetchSavings();
    } catch (err) {
      console.error("❌ Error saving goal", err);
      alert("Failed to save");
    }
  };

  const handleEdit = (saving) => {
    setFormData({
      name: saving.name,
      goalAmount: saving.goalAmount,
      currentSavings: saving.currentSavings,
      targetDate: saving.targetDate?.slice(0, 10),
      category: saving.category,
      description: saving.description,
    });
    setEditingId(saving._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saving goal?")) return;
    try {
      await axiosInstance.delete(`/savings/${id}`);
      fetchSavings();
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  const filteredSavings = savings.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const itemDate = new Date(item.targetDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return matchesSearch && (!from || itemDate >= from) && (!to || itemDate <= to);
  });

  return (
    <div className="dashboard-container">
      {/* Form + Calculator */}
      <div className="card-wrapper">
        <div className="card form-card">
          <h2 className="card-title">{editingId ? "Update Saving Goal" : "New Saving Goal"}</h2>
          <form className="savings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Goal Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Goal Amount*</label>
                <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} required min={0} />
              </div>
              <div className="form-group">
                <label>Now Savings*</label>
                <input type="number" name="currentSavings" value={formData.currentSavings} onChange={handleChange} required min={0} />
              </div>
            </div>

            <div className="form-group">
              <label>Target Date*</label>
              <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Category*</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="" disabled>Select</option>
                <option value="Electronics">Electronics</option>
                <option value="Vacation">Vacation</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} />
            </div>

            <button className="btn-save" type="submit">
              {editingId ? "Update" : "Save"}
            </button>
          </form>
        </div>

        {/* Mini Calculator */}
        <div className="calculator-card">
          <h3>📊 Savings Estimator</h3>
          <div className="form-group">
            <label>Monthly Saving (₹)</label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="E.g., 500"
            />
          </div>
          <div className="form-group">
            <label>Months</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="E.g., 6"
            />
          </div>
          <p className="calc-result">Total: ₹{monthly * months || 0}</p>

          <button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                goalAmount: monthly * months,
              }))
            }
            style={{
              marginTop: '10px',
              padding: '6px 10px',
              background: '#5e63ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Use as Goal Amount
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="card table-card">
        <h2 className="card-title">All Savings</h2>

        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="date-filters">
            <label>From:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label>To:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        <table className="savings-table">
          <thead>
            <tr>
              <th>Goal Name</th>
              <th>Category</th>
              <th>Now</th>
              <th>Goal</th>
              <th>Description</th>
              <th>Target Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSavings.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No data found</td>
              </tr>
            ) : (
              filteredSavings.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.currentSavings}</td>
                  <td>₹{item.goalAmount}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.targetDate).toLocaleDateString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Savings;
