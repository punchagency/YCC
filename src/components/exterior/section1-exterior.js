import React from 'react'
import collage from '../../assets/images/exterior/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'

const Section1Exterior = () => {

    const data = {
        title:'Boost Your Efficiency With Your Exterior AI Assistant',
        image : collage,
        subText1:"Our Exterior AI Assistant is your go-to resource for all things exterior related. Access yacht-specific procedures, exterior specific services and supply providers. With auto-categorization of new documents and quick retrieval of SOP's, you'll always have the right tools to excel in your role.",
        subText2: "From maintaining the pristine condition of your Yacht's Exterior. To ensuring Watersports Equipment is ready for use. Your skills define the Yacht's standard of excellence. We provide resources, connections and guidance to help you in your role.  From maintaining pristine condition of your Yacht's Exterior to ensuring Watersports Equipment and Jetskis."
    }
    return (
  <LandingPageInfoSection data={data}/>
    )

}

export default Section1Exterior
