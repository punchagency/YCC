
import collage from '../../assets/images/captain/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'

const Section1Captain = () => {

    const data = {
        title:' Lead With Confidence Using Your AI Assistant',
        image : collage,
        subText1: 'As a Yacht Captain, lead with confidence using your AI Agent. You are the leader and ambassador of every voyage. Whether ensuring compliance, coordinating with crew, or delivering exceptional guest experiences, we’ve got you covered.',
        subText2: 'Your role demands expertise and precision. Yacht Crew Center is here to provide the resources and guidance you need to succeed in this dynamic profession.Submit your question to our AI Assistant, and include any helpful context for the most comprehensive advice possible.'
    }
    return (
  <LandingPageInfoSection data={data}/>
    )
}

export default Section1Captain