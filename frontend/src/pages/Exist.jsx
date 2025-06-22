import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/Exist.css";
import axiosInstance from "../api/axiosInstance";

function Exist() {
  const [expenses, setExpenses] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
    fetchCategoryCounts();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch expenses", err);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const res = await axiosInstance.get("/expenses/category-count");
      setCategoryCounts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch category counts", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this expense?")) return;
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchCategoryCounts();
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Delete failed");
    }
  };

  const handleEdit = (expense) => {
    navigate("/expense", { state: { expense } });
  };

  const categories = [
    { icon: "🍔", name: "Food" },
    { icon: "✈️", name: "Travel" },
    { icon: "📦", name: "Supplies" },
    { icon: "🎮", name: "Entertainment" },
    { icon: "⚡", name: "Utilities" },
    { icon: "🩺", name: "Health" },
    { icon: "🎓", name: "Education" },
    { icon: "🛍️", name: "Shopping" },
    { icon: "🏠", name: "Rent" },
    { icon: "📁", name: "Other" },
  ];

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = [item.name, item.category, item.description]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));

    const itemDate = new Date(item.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return matchesSearch && (!from || itemDate >= from) && (!to || itemDate <= to);
  });

  return (
    <div className="dashboard-container">
      {/* Left: Categories Card */}
      <div className="card">
        <h2 className="card-title">Categories</h2>
        <ul className="task-list">
          {categories.map((cat) => (
            <li key={cat.name}>
              <span className="icon">{cat.icon}</span>
              <span className="label">{cat.name}</span>
              <span className="value">{categoryCounts[cat.name] || 0}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Expense Table */}
      <div className="card">
        <h2 className="card-title">All Expenses</h2>

        {/* Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Search by name, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <div className="date-filters">
            <label>
              From:{" "}
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </label>
            <label>
              To:{" "}
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Table */}
        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Category</th>
              <th>Total</th>
              <th>Description</th>
              <th>Invoice</th>
              <th>Buyed Date</th>
              <th>Added Date</th>
              <th>Updated Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "1rem" }}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <span className={`badge ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>₹{item.total}</td>
                  <td>{item.description}</td>
                  <td>
                    {item.invoice ? (
                      <a
                        href={`http://localhost:5000/uploads/${item.invoice}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.invoice}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
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

export default Exist;
