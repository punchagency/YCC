import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'

const Section2Interior = () => {
    
    const gridData = [
        {
            title: "Master the Art of Luxury Hospitality",
            image: shipIcon,

            subtext1: 'Access resources for fine dining service, table settings, and personalized guest care.',
            subtext2: 'Discover how to create luxurious spaces with the right lighting, flowers and bespoke table settings.'
        },
        {
            title: "Interior Maintenance Made Simple",
            image: crewIcon,

            subtext1: "Learn best practices for cleaning and caring for delicate materials like linens, carpets, and furniture.",
            subtext2: 'Find & book recommended suppliers for cleaning products, décor and organizational tools tailored for yachts.'
        },
        {
            title: "Simplify your Department Management",
            image: shipIcon,

            subtext1: "Manage your service bookings with our worldwide Interior dedicated network.",
            subtext2: 'Order your every Interior department needs through our network & platform.'
        },
        {
            title: "Advance Your Career In Yacht Interior Management",
            image: engineeringIcon,
            subtext1: 'Access training resources focused on leadership, inventory management and guest services.',
            subtext2: 'Join the Preferred Crew Network to access department managing tools, grow your professional network and simplify your life.'
        }
    ]

    return (

        <LandingPageGrid gridData={gridData} />
    )
}

export default Section2Interior 
