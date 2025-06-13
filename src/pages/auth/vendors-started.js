import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/crew/back.png";
// import logo from "../../assets/images/start-logo.svg";
// import captain from "../../assets/images/captain1.svg";
import hod from "../../assets/images/HOD.svg";
import crew from "../../assets/images/mechanic1.svg";

const VendorStarted = ({ name }) => {
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation
  // const title = "Explore the story behind Yacht Crew Center's journey.";
  // const description =
  //   "The Vessel Compliance and Maintenance Management System is designed to digitize and automate the management of vessel compliance, maintenance, and financial operations. Tailored for captains, managers, and crew members, it aims to enhance operational efficiency and ensure regulatory compliance.";

  // Define the options for the user roles
  const roles = [
    // {
    //   image: captain,
    //   alt: "captain",
    //   newText: "Captain",
    //   text: "captain",
    //   path: "/crew/signup",
    // },
    {
      image: hod,
      alt: "service providers",
      newText: "Service Provider",
      text: "service_provider",
      path: "/service/signup",
    },
    {
      image: crew,
      alt: "vendor",
      newText: "Vendor",
      text: "vendor",
      path: "/vendor/signup",
    },
    // {
    //   image: crew,
    //   alt: "crew",
    //   newText: "Crew Member",
    //   text: "crew_member",
    //   path: "/crew/signup",
    // },
  ];

  // Function to handle navigation
  const handleRoleSelect = (path, role) => {
    console.log("navigating to:", path, "with role ", role);
    localStorage.setItem("selectedRole", role);
    navigate(path, { state: { role } }); // Pass the role as state
  };

  //  useEffect(() => {
  //    const storedRole = localStorage.getItem("selectedRole");
  //    if (storedRole) {
  //      const selectedRoleObj = roles.find((role) => role.text === storedRole);
  //      if (selectedRoleObj) {
  //        navigate(selectedRoleObj.path, { state: { role: storedRole } });
  //      }
  //    }
  //  }, [navigate]);

  return (
    <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 get-started">
      <div
        className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* <div className="border-circle mb-3 bg-white font-bold flex align-items-center justify-content-center logo">
          <img src={logo} alt="Company logo" className="image-full" />
        </div> */}
        {/* <div className="get-started-content">
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="text-white m-0 line-height-3">{description}</p>
        </div> */}
      </div>
      <div className="flex-1 flex align-items-center justify-content-center right-panel">
        <div className="get-started-right-component">
          <h6>Welcome,</h6>
          <h2>Lets, Get started</h2>
          <p className="font-medium">
            Please select your preferred option to proceed with the
            registration.
          </p>
          <div className="get-started-right-component-content">
            <ul>
              {roles.map((role, index) => (
                <li
                  key={index}
                  onClick={() => handleRoleSelect(role.path, role.text)}
                >
                  <div className="content">
                    <div className="icons">
                      <img
                        src={role.image}
                        alt={role.alt}
                        className="image-full"
                      />
                    </div>
                    <div className="text">
                      <p>Are you a</p>
                      {role.newText}
                    </div>
                  </div>
                  <div className="arrow">
                    <div className="arrow-wraper">
                      <i className="pi pi-angle-right"></i>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStarted;
