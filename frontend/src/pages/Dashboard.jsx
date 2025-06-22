import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "../pages/css/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Dashboard() {
  const [dayData, setDayData] = useState({});
  const [weekData, setWeekData] = useState({});
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setHasError(false);
    const userEmail = sessionStorage.getItem("userEmail");

    try {
      const [dayRes, weekRes, monthRes, yearRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/day", {
          headers: { "user-email": userEmail }
        }),
        axios.get("http://localhost:5000/api/reports/week", {
          headers: { "user-email": userEmail }
        }),
        axios.get("http://localhost:5000/api/reports/month", {
          headers: { "user-email": userEmail }
        }),
        axios.get("http://localhost:5000/api/reports/year", {
          headers: { "user-email": userEmail }
        })
      ]);

      setDayData(dayRes.data);
      setWeekData(weekRes.data);
      setMonthData(monthRes.data);
      setYearData(yearRes.data);
    } catch (err) {
      toast.error("❌ Failed to fetch dashboard reports");
      setHasError(true);
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const dashboard = document.querySelector(".analytics-dashboard-grid");
    if (!dashboard) return;

    html2canvas(dashboard, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("dashboard-report.pdf");
    });
  };

  const dataDoughnut = {
    labels: Object.keys(dayData),
    datasets: [
      {
        label: "Today's Expenses",
        data: Object.values(dayData),
        backgroundColor: ["#5e63ff", "#ff6384", "#36a2eb", "#ffce56", "#28c76f"],
        hoverOffset: 10
      }
    ]
  };

  const dataBarWeek = {
    labels: weekData.days || [],
    datasets: [
      {
        label: "Expenses",
        data: weekData.expenses || [],
        backgroundColor: "#ea5455",
        borderRadius: 8
      }
    ]
  };

  const dataBarMonth = {
    labels: monthNames,
    datasets: [
      {
        label: "Expenses",
        data: monthData.map((m) => m.expense),
        backgroundColor: "#ea5455",
        borderRadius: 10
      }
    ]
  };

  const dataLineYear = {
    labels: yearData.map((y) => y.year),
    datasets: [
      {
        label: "Expenses",
        data: yearData.map((y) => y.expense || 0),
        borderColor: "#ea5455",
        fill: false,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="analytics-main-content p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="analytics-dashboard-title text-2xl font-semibold mb-4">📊 Pro Dashboard Analytics</h1>

      {hasError && (
        <div className="text-center mb-4">
          <p className="text-red-500">Something went wrong fetching reports.</p>
          <button onClick={fetchReports} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">🔁 Retry</button>
        </div>
      )}

      {/* <div className="text-center mb-4">
        <button onClick={handleDownloadPDF} className="bg-green-600 text-white px-4 py-2 rounded">📄 Download PDF</button>
      </div> */}

      <div className="analytics-dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="analytics-card bg-white dark:bg-[#1f1f1f] rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">🍩 Today's Expenses</h3>
          {loading ? <p>Loading...</p> : <Doughnut data={dataDoughnut} />}
        </div>

        <div className="analytics-card bg-white dark:bg-[#1f1f1f] rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">📅 Weekly Report</h3>
          {loading ? <p>Loading...</p> : <Bar data={dataBarWeek} />}
        </div>

        {/* Uncomment below if needed */}
        {/* <div className="analytics-card bg-white dark:bg-[#1f1f1f] rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">📈 Monthly Report</h3>
          {loading ? <p>Loading...</p> : <Bar data={dataBarMonth} />}
        </div>

        <div className="analytics-card bg-white dark:bg-[#1f1f1f] rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">📆 Yearly Overview</h3>
          {loading ? <p>Loading...</p> : <Line data={dataLineYear} />}
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
