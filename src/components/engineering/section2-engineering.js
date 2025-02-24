import React from 'react'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'
const Section2Engineering = () => {

    const gridData = [
        {
            title: "Maintenance and Repair Essentials",
           image: shipIcon,
      
            subtext1: 'Access trusted suppliers for your engine room needs.',
            subtext2: 'Access top-tier engineering services through our global network of trusted professionals.'
        },
        {
         title: "Cutting-Edge  Technology and Tools",
            image: crewIcon,
      
        subtext1: 'Stay up to date with the latest diagnostics, calibration equipment, and technical innovations.',
            subtext2: 'Discover tools and systems for efficient troubleshooting and system upgrades.' 
         },
         {
             title: "Safety and Compliance for Engineers",
  image: shipIcon,
       
         subtext1: 'Learn how to meet international safety standards, including flag state regulations and MLC compliance.',
             subtext2: 'Stay up to date with changing practices — Access resources for maintaining safety equipment and online access to their data in one place.'
          },
        {
            title: "Training and Certification Programs",
            image: engineeringIcon,
              subtext1: 'Advance your skills with career progression courses, and advanced technical systems.',
            subtext2: 'Prepare for certifications with access to our coach resources. Simplify your career management and focus on your development.'
        }
    ]

    return (

   <LandingPageGrid gridData={gridData} />
    )

}

export default Section2Engineering          
