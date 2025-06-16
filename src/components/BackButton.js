import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from './ResponsiveDevice';

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = onClick || (() => navigate(-1));

  // Don't show back button for crew and admin routes
  if (location.pathname.startsWith('/crew/') || location.pathname.startsWith('/admin/')) {
    return null;
  }

  // Desktop: absolute at far left of container
  // Mobile: fixed at top left of viewport
  if (isMobile()) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        background: 'transparent',
        width: '100vw',
        padding: '16px 0 0 16px',
      }}>
        <button
          onClick={handleClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#000',
            fontSize: 28
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      </div>
    );
  }
  // Desktop
  return (
    <button
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#034D92',
        position: 'absolute',
        top: 16,
        left: 0,
        zIndex: 10,
        fontSize: 28,
        paddingLeft: 16
      }}
      aria-label="Back"
    >
      <ArrowBackIcon />
    </button>
  );
};

export default BackButton; 