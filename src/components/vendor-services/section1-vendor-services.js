import collage from '../../assets/images/vendor-services/section1.png'
import LandingPageInfoSection from '../landing-page-info-section'
const Section1VendorServices = () => {
    const data = {
        title:'Managing Your Business Just Got Easier with the Yacht Crew Center.',
        image : collage,
        subText1: "Yacht Crew Center’s platform streamlines order and booking management. Ensuring you receive direct requests from those who need your expertise. By onboarding your business, you gain access to a global network, increased visibility, and secure consistent work. All while our system handles the heavy lifting.",
        subText2: 'Our platform connects your services and inventory directly to a global network of yacht crew, professionals actively seeking trusted partners like you. With your business listed in a comprehensive directory, you’ll gain visibility across the yachting industry, driving growth and securing consistent orders.',
        button: {
            text: 'Apply Now',
            link: '/vendor-services'
        }
 
    }
    return (
        <LandingPageInfoSection data={data}/>
    )
}

export default Section1VendorServices   
