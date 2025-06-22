import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../components/css/SideBar.css';

import dashboardIconDark from '../assets/icons/dark icon/dashboard.svg';
import walletIconDark from '../assets/icons/dark icon/walet.svg';
import newIconDark from '../assets/icons/dark icon/new.svg';
import existIconDark from '../assets/icons/dark icon/exist.svg';
import savingsIconDark from '../assets/icons/dark icon/savingsIcon.svg';
import logoutIconDark from '../assets/icons/dark icon/logout.svg';
import arrowDownDark from '../assets/icons/dark icon/arrow down.svg';
import LogoIcon from "../assets/icons/dark icon/payment Icon.svg";
import IconFace from "../assets/icons/dark icon/iconFace.svg";

import { logout } from "../services/authService";

const SideBar = () => {
  const [isView, setIsView] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) setEmail(userEmail);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleSubMenu = () => setIsView(prev => !prev);
  const handleMobileToggle = () => setIsMobileOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  // For highlighting active links
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isMobileOpen && <div className="sidebar-backdrop" onClick={handleMobileToggle}></div>}

      <nav id="sidebar" className={isMobileOpen ? "sidebar-open" : ""}>
        <ul>
          {/* User Icon and Username */}
          <li style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
            <img src={IconFace} alt="User Icon" width={60} className='Icon' />
            <span>
              Hello
            </span>
          </li>

          {/* Dashboard */}
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
              <img src={dashboardIconDark} alt="Dashboard" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Expense + Submenu */}
          <li style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
            <button
              className="dropdown-btn"
              onClick={handleSubMenu}
              aria-expanded={isView}
              style={{ width: '100%' }}
            >
              <img src={walletIconDark} alt="Expense" />
              <span>Expense</span>
              <img src={arrowDownDark} alt="Toggle" style={{ marginLeft: "auto" }} />
            </button>
            {isView && (
              <>
                <Link
                  to="/expense"
                  className={`submenu-link${isActive('/expense') ? ' active' : ''}`}
                  onClick={() => { setIsMobileOpen(false); setIsView(false); }}
                  style={{ paddingLeft: 38, paddingTop: 6, paddingBottom: 6 }}
                >
                  <img src={newIconDark} alt="New" />
                  <span>New</span>
                </Link>
                <Link
                  to="/about"
                  className={`submenu-link${isActive('/about') ? ' active' : ''}`}
                  onClick={() => { setIsMobileOpen(false); setIsView(false); }}
                  style={{ paddingLeft: 38, paddingTop: 6, paddingBottom: 6 }}
                >
                  <img src={existIconDark} alt="Existing" />
                  <span>Existing</span>
                </Link>
              </>
            )}
          </li>

          {/* Savings */}
          <li>
            <Link to="/savings" className={isActive('/savings') ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
              <img src={savingsIconDark} alt="Savings" />
              <span>Savings</span>
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button className="dropdown-btn" onClick={handleLogout}>
              <img src={logoutIconDark} alt="Logout" />
              <span>Logout</span>
            </button>
          </li>
        </ul>

        <ul>
          <li style={{ gap: 8 }}>
            <img src={LogoIcon} alt="Logo" />
            <span className="sidebar-logo-text">TRACKER</span>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideBar;