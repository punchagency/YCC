import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-login.png';
import homeLogo from '../assets/images/crew/homeLogo.png';
import orderLogo from '../assets/images/crew/order1.png';
import financeLogo from '../assets/images/crew/financeLogo.png';
import complianceLogo from '../assets/images/crew/complianceLogo.png';
import reportLogo from '../assets/images/crew/reportLogo.png';
import settingsLogo from '../assets/images/crew/settingsLogo.png';
import helpLogo from '../assets/images/crew/info.png';
import contactLogo from '../assets/images/crew/shape.png';
import logoutLogo from '../assets/images/crew/logout.png';

const MobileSidebar = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`mobile-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="Company Logo" />
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/inventory/dashboard')}>
              <span className="icon"><img src={homeLogo} alt="Dashboard" width={15} height={15} /></span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/calendar')}>
              <span className="icon"><i className="pi pi-calendar"></i></span>
              Calendar
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/inventory/inventory')}>
              <span className="icon"><i className="pi pi-file"></i></span>
              Inventory Management
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/orders')}>
              <span className="icon"><img src={orderLogo} alt="Orders" width={15} height={15} /></span>
              Orders
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/bookings')}>
              <span className="icon"><img src={orderLogo} alt="Bookings" width={15} height={15} /></span>
              Bookings
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/financial-management')}>
              <span className="icon"><img src={financeLogo} alt="Financial" width={15} height={15} /></span>
              Financial Management
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/notifications')}>
              <span className="icon"><img src={complianceLogo} alt="Notifications" width={15} height={15} /></span>
              Notifications
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/reports')}>
              <span className="icon"><img src={reportLogo} alt="Reports" width={15} height={15} /></span>
              Reports
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/settings')}>
              <span className="icon"><img src={settingsLogo} alt="Settings" width={15} height={15} /></span>
              Settings
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/help')}>
              <span className="icon"><img src={helpLogo} alt="Help" width={15} height={15} /></span>
              Help Centre
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation('/crew/contact')}>
              <span className="icon"><img src={contactLogo} alt="Contact" width={15} height={15} /></span>
              Contact Us
            </a>
          </li>
          <li className="logout">
            <a href="#" onClick={() => {
              localStorage.removeItem("token");
              navigate('/login');
            }}>
              <span className="icon"><img src={logoutLogo} alt="Logout" width={15} height={15} /></span>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileSidebar; 