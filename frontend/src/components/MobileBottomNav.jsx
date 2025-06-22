import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import dashboardIconDark from '../assets/icons/dark icon/dashboard.svg';
import walletIconDark from '../assets/icons/dark icon/walet.svg';
import savingsIconDark from '../assets/icons/dark icon/savingsIcon.svg';
import logoutIconDark from '../assets/icons/dark icon/logout.svg';
import newIconDark from '../assets/icons/dark icon/new.svg';
import existIconDark from '../assets/icons/dark icon/exist.svg';
import "./css/MobileBottomNav.css"
const MobileBottomNav = () => {
  const location = useLocation();
  const [showExpenseMenu, setShowExpenseMenu] = useState(false);

  return (
    <>
      <nav className="mobile-bottom-nav">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          <img src={dashboardIconDark} alt="Dashboard" />
          <span>Dashboard</span>
        </Link>
        <button
          className={location.pathname.startsWith("/expense") || location.pathname === "/about" ? "active" : ""}
          onClick={() => setShowExpenseMenu((open) => !open)}
          style={{ background: "none", border: "none", outline: "none", padding: 0 }}
        >
          <img src={walletIconDark} alt="Expense" />
          <span>Expense</span>
        </button>
        <Link to="/savings" className={location.pathname === "/savings" ? "active" : ""}>
          <img src={savingsIconDark} alt="Savings" />
          <span>Savings</span>
        </Link>
        <Link to="/logout">
          <img src={logoutIconDark} alt="Logout" />
          <span>Logout</span>
        </Link>
      </nav>

      {showExpenseMenu && (
        <div className="mobile-bottom-submenu-backdrop" onClick={() => setShowExpenseMenu(false)}>
          <div className="mobile-bottom-submenu" onClick={e => e.stopPropagation()}>
            <Link to="/expense" className={location.pathname === "/expense" ? "active" : ""}>
              <img src={newIconDark} alt="New" />
              <span>New</span>
            </Link>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
              <img src={existIconDark} alt="Exist" />
              <span>Exist</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;