import React from 'react'
import collage from '../../assets/images/engineering/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'

const Section1Engineering = () => {
    const data = {
        title:'Optimize Yacht  Maintenance with our AI Assistant',
        image : collage,
        subText1: 'This AI Engineering Agent supports you with instant access to troubleshooting guides. Allows you to manage your department with service bookings & supplier sourcing. Help train the future of Engineering management.',
        subText2: 'Got an engineering question? Ask our AI Agent and add any relevant details to get precise answers.'
    }
    return (
  <LandingPageInfoSection data={data}/>
    )

}

export default Section1Engineering      
