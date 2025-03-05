
import collage from '../../assets/images/captain/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'

const Section1Captain = () => {

    const data = {
        title:' Lead With Confidence Using Your AI Assistant',
        image : collage,
        subText1: 'As a captain, the AI Assistant is your co-pilot for success. Access navigation procedures, compliance resources, and crew management tools seamlessly. Keep your operations smooth and efficient with AI-powered organization and support tailored to your needs. Easily organize and access records, manage scheduling, and stay compliant with certifications and regulatory requirements. As a Yacht Captain, lead with confidence using your AI Agent. You are the leader and ambassador of every voyage. Whether ensuring compliance, coordinating with crew, or delivering exceptional guest experiences, we’ve got you covered.',
        subText2: 'Your role demands expertise and precision. Yacht Crew Center, LLC is here to provide the resources and guidance you need to succeed in this dynamic profession.Submit your question to our AI Assistant, and include any helpful context for the most comprehensive advice possible.'
    }
    return (
  <LandingPageInfoSection data={data}/>
    )
}

export default Section1Captain