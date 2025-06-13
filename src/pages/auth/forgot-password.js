import React from 'react';
import backgroundImage from '../../assets/images/captain_login_bg.jpg'
import logo from '../../assets/images/logo-login.png'
import ForgotPasswordForm from '../../components/forgot-password'
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { isMobile } from '../../components/ResponsiveDevice';
import LandingPageChatbot from '../../components/chatbot/landing-page-chatbot';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const title = "Explore the story behind Yacht Crew Center's journey.";
  return (
    <div style={{ position: 'relative' }}>
      <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 login">
        {/* Left panel removed */}
        
        <div className='flex-1 flex align-items-center justify-content-center right-panel' style={isMobile() ? {
          padding: 0,
          margin: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flex: 1,
          overflow: 'auto',
          minHeight: '0',
          height: 'auto'
        } : { position: 'relative' }}>
          {/* Back Button for desktop (absolute, far left of right panel) */}
          {window.history.length > 1 && !isMobile() && (
            <button
              onClick={() => navigate(-1)}
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
          )}
          <div className='login-right-component' style={isMobile() ? {
            maxWidth: 340,
            width: '100%',
            margin: '0 auto',
            padding: '0 4px 16px 4px', // Remove top padding
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            borderRadius: 12,
            background: 'white',
            height: 'auto',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minHeight: '0'
          } : { position: 'relative', width: '100%' }}>
            {/* Logo for desktop above the form */}
            {!isMobile() && (
              <div className='logo-wraper' style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                <div className='logo'>
                  <img src={logo} alt="Company logo" className='image-full' />
                </div>
              </div>
            )}
            {/* Logo for mobile */}
            {isMobile() && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0 16px 0' }}>
                <img src={logo} alt="Company logo" style={{ maxWidth: 180, height: 'auto' }} />
              </div>
            )}
            <div className='login-heading' style={isMobile() ? { marginTop: 0, marginBottom: 12, textAlign: 'center' } : {}}>
              <h2 className='font-medium mb-1'>Forgot Password</h2>
              <p>Forgot your password? <Link to="/login" style={{ color: '#034D92', fontFamily: 'Inter, sans-serif' }}>Back to Login</Link></p>
            </div>
            <div className='login-form captain-login-form'>
              <ForgotPasswordForm/>
            </div>
          </div>  
        </div>
      </div>
      {/* Chatbot fixed at bottom right */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <LandingPageChatbot />
      </div>
    </div>
  );
};

export default ForgotPassword;