import React from 'react'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'

const Section2Crew = () => {
    const gridData = [
        {
            title: "Training and  Certification Resources",
           image: shipIcon,
      
            subtext1: 'Access courses and certifications to build your skills and meet industry standards.',
            subtext2: 'Explore training options for all crew roles, from deckhands to captains.'
        },
        {
         title: "Financial Planning  and Career Development",
            image: crewIcon,
      
        subtext1: 'Find tailored financial solutions for yacht crew, including retirement planning and asset protection.',
            subtext2: 'Access resources to help you manage your income and plan for the future.' 
         },
         {
             title: "Legal and Compliance Support",
  image: shipIcon,
       
         subtext1: 'Get help with visa requirements, wage disputes, and injury claims.',
             subtext2: 'Stay informed about international labor laws and flag state regulations.'
          },
        {
            title: "Mental Health  and Wellness Services",
            image: engineeringIcon,
              subtext1: 'Access resources for managing stress, staying connected, and maintaining a healthy work-life balance.',
            subtext2: 'Explore counseling options and support networks tailored to yacht crew.'
        }
    ]

    return (

   <LandingPageGrid gridData={gridData} />
    )
}

export default Section2Crew