import React from 'react';
import backgroundImage from '../../assets/images/captain_login_bg.jpg'
import logo from '../../assets/images/logo-login.png'

const Signup = () => {
  const title = "Explore the story behind Yacht Crew Center's journey.";
  return (
    <div className="flex flex-row h-screen align-content-start justify-content-center gap-0 login">
        <div className='flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className='login-content'>
              <h2 className='font-semibold text-white m-0 mb-5'>{title}</h2>
          </div>
        </div>
        <div className='flex-1 flex align-items-center justify-content-center right-panel'>
          <div className='login-right-component'>
              <div className='logo-wraper'>
                 <div className='logo'>
                      <img src={logo} alt="Company logo" className='image-full' />
                 </div>
              </div>
              <div className='login-heading'>
                  <h2 className='font-medium mb-1'>Sign UP</h2>
                  <p>Don’t have an account? Create new!</p>
              </div>
              <div className='login-form captain-login-form'>

              </div>
          </div>  
        </div>
    </div>  
  );
};

export default Signup;