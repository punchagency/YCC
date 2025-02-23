import React from 'react'
import LandingPageExitCard from '../landing-page-exit-card'

const Section3Captain = () => {

    const sectionData = {
        title: 'Join Our Crew Network Today',
        subText: 'Elevate your career as a Captain. Become a member of our verified Crew Network and gain access to exclusive resources, job opportunities, and a supportive community dedicated to your success.',
        button: {
            text: 'Join Now'
        }
    } 
  return (
    <LandingPageExitCard sectionData={sectionData} />
  )
}

export default Section3Captain