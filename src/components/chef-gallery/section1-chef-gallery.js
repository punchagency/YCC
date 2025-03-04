import React from 'react'
import collage from '../../assets/images/chef-gallery/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'

const Section1ChefGallery = () => {
    const data = {
        title:'Boost Your Culinary Workflow with our AI Assistant',
        image : collage,
        subText1: "Streamline your galley operations with our AI Assistant. Create provisioning lists, menu templates, and food safety tips tailored to yacht chefs. With auto-categorization of new galley documents, you can focus on creating extraordinary meals while staying organized.",
        subText2: 'Ask our AI Assistant about anything galley-related, and include any extra context to get spot-on support.'
    }
    return (
        <LandingPageInfoSection data={data}/>
    )
}

export default Section1ChefGallery  
