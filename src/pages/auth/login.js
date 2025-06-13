import React from "react";
import { Link } from "react-router-dom";
// import backgroundImageCaptain from "../../assets/images/captain_login_bg.jpg";
// import backgroundImageCrew from "../../assets/images/crew_bg.jpg";
import logo from "../../assets/images/logo-login.png";
import LoginForm from "../../components/login";
import { useLocation } from "react-router-dom";
import backgroundImage from "../../assets/images/crew/back.png";

const Login = () => {
  // const title = "Explore the story behind Yacht Crew Center's journey.";
  const location = useLocation();
  const role = location.state?.role || "Guest"; // Default to 'Guest' if no role is passed

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
    <div className="flex flex-column lg:flex-row h-screen align-content-start justify-content-center gap-0 login">
      <div
        className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* <div className="login-content">
          <h2 className="font-semibold text-white m-0 mb-5">{title}</h2>
        </div> */}
      </div>
      <div className="flex-1 flex align-items-center justify-content-center right-panel">
        <div className="login-right-component">
          <div className="logo-wraper">
            <div className="logo">
              <img src={logo} alt="Company logo" className="image-full" />
            </div>
          </div>
          <div className="login-heading">
            <h2 className="font-medium mb-1">Sign in</h2>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" state={{ role }}>
                Create new!
              </Link>
            </p>
          </div>
          <div className="login-form captain-login-form">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
