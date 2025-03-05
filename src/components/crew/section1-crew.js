import React from 'react'
import collage from '../../assets/images/crew/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'
const Section1Crew = () => {

    const data = {
        title:'Empower Your Career with the AI Assistant',
        image : collage,
        subText1: 'Our AI Assistant is here to support your journey at sea. We have you covered for training, certifications, legal assistance by country and/or port, financial planning, and mental health support. From training resources to legal guidance, access personalized, yacht-specific answers when you need them. Yacht Crew Center, LLC is here to support you with tailored resources and expert guidance.',
        subText2: 'From training and legal assistance to financial planning and mental health support, we’ve got you covered. Stay ahead with tools designed to help crew members thrive. Ask our AI Assistant your crew related questions for tailored support.'
    }
    return (
  <LandingPageInfoSection data={data}/>
    )

}

export default Section1Crew