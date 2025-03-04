import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'
const Section2VendorServices = () => {
    
    const gridData = [
        {
            title: "Let Yacht Crew Center Propel Your Business",
            image: shipIcon,

            subtext1: 'Expand your business by connecting directly with yacht crew and managers through our global platform.',
            subtext2: 'Showcase your inventory and secure order requests with ease. while becoming part of a trusted network serving the Luxury Yachting Industry.'
        },
        {
            title: "Join A Comprehensive Vendor Marketplace",
            image: crewIcon,

            subtext1: " Join a global network of yacht crew and vessel managers actively searching for top-tier service providers like you. Showcase your business and be easily found by those who need your expertise.",
            subtext2: 'Conrm bookings directly with crew, manage your invoices seamlessly, and elevate your business by connecting with a worldwide yachting audience.'
        },
        {
            title: "Get Direct Bookings and Orders",
            image: shipIcon,

            subtext1: "Receive and respond to quote requests, Confirm bookings & manage orders effortlessly through our seamless platform.",
            subtext2: 'Yacht Crew Center empowers your business to build a strong reputation. Connecting you directly to a global network of yachting professionals actively seeking trusted service providers.'
        },
        {
            title: "Let Our AI Platform do the Heavy Lifting",
            image: engineeringIcon,
            subtext1: 'By onboarding your inventory & services you’ll receive direct orders and booking requests tailored to real-time needs.',
            subtext2: 'Our AI handles the heavy lifting matching you to customers so you can focus on growing your business.'
        }
    ]

    return (

        <LandingPageGrid gridData={gridData} />
    )
}

export default Section2VendorServices       
