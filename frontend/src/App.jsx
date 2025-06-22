import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SideBar from "../src/components/SideBar";
import Home from "../src/pages/Home";
import Expense from "../src/pages/Expense";
import Exist from "./pages/Exist";
import Savings from "./pages/Savings";
import DashBoard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MobileBottomNav from "./components/MobileBottomNav";
import './App.css';

function App() {
  const location = useLocation();
  const isLoggedIn = !!sessionStorage.getItem("userEmail");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Add 'logged-in' class to app-layout if user is logged in and not on auth pages
  const appLayoutClass = `app-layout${isLoggedIn && !isAuthPage ? " logged-in" : ""}`;

  return (
    <>
      {/* Show sidebar and bottom nav only after login */}
      {!isAuthPage && isLoggedIn && <SideBar />}
      {!isAuthPage && isLoggedIn && <MobileBottomNav />}

      <div className={appLayoutClass}>
        <main style={{ padding: '1em' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (inline check) */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <DashBoard /> : <Navigate to="/login" />}
            />
            <Route
              path="/savings"
              element={isLoggedIn ? <Savings /> : <Navigate to="/login" />}
            />
            <Route
              path="/expense"
              element={isLoggedIn ? <Expense /> : <Navigate to="/login" />}
            />
            <Route
              path="/about"
              element={isLoggedIn ? <Exist /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;