import React from 'react'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'

const Section2Captain = () => {
    const gridData = [
        {
            title: "Compliance And Certification for Captains",
           image: shipIcon,
      
            subtext1: 'Access resources for flag state regulations, licensing, and certification renewals.',
            subtext2: 'Stay updated on international maritime laws and safety requirements for seamless operations.'
        },
        {
         title: "Enhancing Guest Experiences at Sea",
            image: crewIcon,
      
        subtext1: 'Discover connections for creating tailored itineraries, coordinating private events, and managing luxury guest services.',
            subtext2: 'Access resources for managing guest preferences, entertainment options, and VIP experiences.' 
         },
        {
            title: "Leadership and Crew Management",
            image: engineeringIcon,
              subtext1: 'Learn techniques for recruiting, training, and leading a cohesive crew.',
            subtext2: 'Gain insights into conflict resolution, team-building, and maintaining morale onboard.'
        },
        {
            title: "Stay Ahead of the Game",
 image: shipIcon,
      
        subtext1: 'Keep your skills sharp with tools for social media & promotion.',
            subtext2: ' Learn what AI can do for your vessel.Explore the future of a Globally Connected Network.'  }
    ]

    return (

   <LandingPageGrid gridData={gridData} />
    )
}

export default Section2Captain