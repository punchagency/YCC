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
    <div 
      className="mobile-sidebar-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 9999,
        display: isOpen ? 'block' : 'none',
        overflow: 'auto'
      }}
    >
      <div 
        className="sidebar-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}
      >
        <div className="logo" style={{ maxWidth: '150px' }}>
          <img src={logo} alt="Company Logo" style={{ width: '100%' }} />
        </div>
        <button 
          className="close-btn" 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#666',
            padding: '0 10px'
          }}
        >×</button>
      </div>
      
      <ul 
        className="sidebar-menu"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          width: '100%'
        }}
      >
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/inventory/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={homeLogo} alt="Dashboard" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Dashboard</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <i className="pi pi-calendar" style={{ fontSize: '20px' }}></i>
            </span>
            <span style={{ fontSize: '16px' }}>Calendar</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/inventory/inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <i className="pi pi-file" style={{ fontSize: '20px' }}></i>
            </span>
            <span style={{ fontSize: '16px' }}>Inventory Management</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={orderLogo} alt="Orders" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Orders</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={orderLogo} alt="Bookings" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Bookings</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/financial-management')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={financeLogo} alt="Financial" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Financial Management</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={complianceLogo} alt="Notifications" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Notifications</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={reportLogo} alt="Reports" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Reports</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={settingsLogo} alt="Settings" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Settings</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/help')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={helpLogo} alt="Help" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Help Centre</span>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={() => handleNavigation('/crew/contact')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 20px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #f5f5f5',
              width: '100%'
            }}
          >
            <span 
              className="icon"
              style={{
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px'
              }}
            >
              <img src={contactLogo} alt="Contact" width={20} height={20} />
            </span>
            <span style={{ fontSize: '16px' }}>Contact Us</span>
          </a>
        </li>
      </ul>
      
      <div 
        className="sidebar-footer"
        style={{
          padding: '20px',
          borderTop: '1px solid #eee',
          backgroundColor: 'white',
          position: 'sticky',
          bottom: 0
        }}
      >
        <a 
          href="#" 
          onClick={() => {
            localStorage.removeItem("token");
            navigate('/login');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#f44336',
            fontWeight: '500'
          }}
        >
          <span 
            className="icon"
            style={{
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px'
            }}
          >
            <img src={logoutLogo} alt="Logout" width={20} height={20} />
          </span>
          <span style={{ fontSize: '16px' }}>Log Out</span>
        </a>
      </div>
    </div>
  );
};

export default MobileSidebar; 