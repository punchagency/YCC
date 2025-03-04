import React from 'react'
import collage from '../../assets/images/interior/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'
const Section1Interior = () => {
    const data = {
        title:'Effortlessly elevate your interior service with our AI Assistant',
        image : collage,
        subText1: "Whether you need personalized guest preferences, precise cleaning protocols, or expert guidance on service etiquette. Our AI delivers yacht-specific answers instantly. Stay ahead of every request with organized resources, prioritized tasks, and tailored recommendations—ensuring five-star service with ease.",
        subText2: 'Ask our AI Assistant anything about interior management, and provide details for customized, on-the-spot solutions designed to make your job smoother and more efficient.'
    }
    return (
        <LandingPageInfoSection data={data}/>
    )
}

export default Section1Interior 
