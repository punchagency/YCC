import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import backgroundImageCaptain from "../../assets/images/captain_login_bg.jpg";
// import backgroundImageCrew from "../../assets/images/crew_bg.jpg";
import logo from "../../assets/images/logo-login.png";
import LoginForm from "../../components/login";
import { useLocation } from "react-router-dom";
import backgroundImage from "../../assets/images/crew/back.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 989;
}

const Login = () => {
  // const title = "Explore the story behind Yacht Crew Center's journey.";
  const location = useLocation();
  const role = location.state?.role || "Guest"; // Default to 'Guest' if no role is passed
  const navigate = useNavigate();

  // const getBackgroundImage = (role) => {
  //   switch (role) {
  //     case "Captain":
  //       return backgroundImageCaptain;
  //     case "Crew Member":
  //       return backgroundImageCrew;
  //     default:
  //       return backgroundImageCaptain; // Default image
  //   }
  // };

  // const backgroundImage = getBackgroundImage(role);

  // const title = `Welcome, ${role}! Explore the story behind Yacht Crew Center's journey.`;
  return (
    <div className="flex flex-column lg:flex-row h-screen align-content-start justify-content-center gap-0 login" style={{ 
      position: 'relative', 
      height: isMobile() ? '100vh' : '100vh',
      overflow: isMobile() ? 'hidden' : 'hidden',
      padding: isMobile() ? '0' : undefined 
    }}>
      {/* Background image section (only show on desktop) */}
      {!isMobile() && (
        <div
          className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {/* Logo for mobile/tablet (show instead of background) */}
      {isMobile() && (
        <div className="logo-wraper" style={{ 
          width: '100%', 
          padding: '0 16px 0 16px',
          textAlign: 'center',
          background: 'white',
          flexShrink: 0,
          maxHeight: 'none',
          marginBottom: 0,
          marginTop: 0
        }}>
          <div className="logo" style={{ 
            maxWidth: 320,
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 0
          }}>
            <img src={logo} alt="Company logo" className="image-full" style={{ maxHeight: 120, width: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      )}
      {/* Back Button for mobile/tablet (fixed at top) */}
      {window.history.length > 1 && isMobile() && (
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
            onClick={() => navigate(-1)}
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
      )}
      {/* Back Button for desktop (absolute in container) */}
      {window.history.length > 1 && !isMobile() && (
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#034D92',
            margin: '16px 0 0 16px',
            position: 'absolute',
            zIndex: 10
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      )}
      <div className="flex-1 flex align-items-center justify-content-center right-panel" style={isMobile() ? { 
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        overflow: 'auto',
        minHeight: '0',
        height: 'auto'
      } : {}}>
        <div className="login-right-component" style={isMobile() ? { 
          maxWidth: 340, 
          width: '100%', 
          margin: '0 auto', 
          padding: '0 4px 0 4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
          borderRadius: 12, 
          background: 'white',
          height: 'auto',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: '0',
          marginTop: 0,
          marginBottom: 0
        } : {}}>
          {/* Logo for desktop above the form */}
          {!isMobile() && (
            <div className="logo-wraper">
              <div className="logo">
                <img src={logo} alt="Company logo" className="image-full" />
              </div>
            </div>
          )}
          <div className="login-heading" style={isMobile() ? { marginBottom: 8, marginTop: 0, textAlign: 'center' } : {}}>
            <h2 className="font-medium mb-1">Sign in</h2>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" state={{ role }} style={{ color: '#034D92' }}>
                Create new!
              </Link>
            </p>
          </div>
          <div className="login-form captain-login-form" style={isMobile() ? { marginTop: 0, marginBottom: 0 } : {}}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
