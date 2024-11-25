import React from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/images/get_started_bg.jpg'
import logo from '../../assets/images/start-logo.svg'
import captain from '../../assets/images/captain1.svg'
import hod from '../../assets/images/HOD.svg'
import crew from '../../assets/images/mechanic1.svg'


const GetStarted = ({ name }) => {
  const title = 'Explore the story behind Yacht Crew Center\'s journey.';
  const description = 'The Vessel Compliance and Maintenance Management System is designed to digitize and automate the management of vessel compliance, maintenance, and financial operations. Tailored for captains, managers, and crew members, it aims to enhance operational efficiency and ensure regulatory compliance.';

  // Define the options for the user roles
  const roles = [
    { image: captain, alt: 'captain', text: 'Captain/Manager', path: '/login' },
    { image: hod, alt: 'hod', text: 'Head of Department', path: '' },
    { image: crew, alt: 'crew', text: 'Crew Member', path: '' }
  ]

  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Function to handle navigation
  const handleRoleSelect = (path) => {
    navigate(path); // Navigate to the selected path
  };

  return (
    <div className="flex flex-row h-screen align-content-start justify-content-center gap-0 get-started">
       <div className='flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="border-circle mb-3 bg-white font-bold flex align-items-center justify-content-center logo" style={{ width: '181px', height: '181px' }}>
              <img src={logo} alt="Company logo" className='image-full' />
          </div>
          <div className='get-started-content'>
              <h2 className='font-semibold text-white m-0 mb-5'>{title}</h2>
              <p className='text-white m-0 line-height-3'>{description}</p>
          </div>
       </div>
       <div className='flex-1 flex align-items-center justify-content-center right-panel'>
          <div className='get-started-right-component'>
              <h6>Welcome,</h6>
              <h2>Lets, Get started</h2>
              <p className='font-medium'>Please select your preferred option to proceed with the registration.</p>
              <div className='get-started-right-component-content'>
                  <ul>
                  {roles.map((role, index) => (
                    <li key={index} onClick={() => handleRoleSelect(role.path)}>
                      <div className='content'>
                        <div className='icons'>
                          <img src={role.image} alt={role.alt} className='image-full' />
                        </div>
                        <div className='text'>
                          <p>Are you a</p>
                          {role.text}
                        </div>
                      </div>
                      <div className='arrow'>
                        <div className='arrow-wraper'>
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

export default GetStarted;