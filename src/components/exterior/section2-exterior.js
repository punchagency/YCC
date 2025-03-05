import React from 'react'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'

const Section2Exterior = () => {

    const gridData = [
        {
            title: "Essential Maintenance",
            image: shipIcon,

            subtext1: 'Discover expert techniques for teak care, hull cleaning, and polishing.',
            subtext2: 'Simplify your Exterior Department management with service bookings and a worldwide supply network.'
        },
        {
            title: "Safety and Compliance",
            image: crewIcon,

            subtext1: "Maintain stock of essential safety gear, including life jackets, EPIRB's, PLB's and fire suppression with services available worldwide.",
            subtext2: 'Access resources on flag state regulations and maritime safety standards to ensure safety and compliance.'
        },
        {
            title: "Advance Your Career as an Exterior Yacht Crewmen",
            image: shipIcon,

            subtext1: 'Build your skills with training resources on deck maintenance, safety procedures and access to career advancing certifications.',
            subtext2: 'Join our Preferred Crew Network to connect with service providers. Access department management tools wherever you are.'
        },
        {
            title: "Elevate Guest Experiences with Watersports Expertise",
            image: engineeringIcon,
            subtext1: 'Explore top-tier watersports equipment, from jet skis to paddleboards, to keep guests entertained.',
            subtext2: 'Gain watersport expertise for dynamic guest experiences. Expand your exterior capabilities.'
        }
    ]

    return (

        <LandingPageGrid gridData={gridData} />
    )
}

export default Section2Exterior
