import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import LandingPageGrid from '../landing-page-grid'

const Section2ChefGallery = () => {
    
    const gridData = [
        {
            title: "Provisioning Resources  for Gourmet Creations",
            image: shipIcon,

            subtext1: 'Find trusted suppliers for fresh produce, specialty foods, and premium meats.',
            subtext2: 'Join the Preferred Crew Network to connect with Chefs , secure new opportunities, and grow in your profession.'
        },
        {
            title: "AI Support for Yacht Chefs and Galley Management",
            image: crewIcon,

            subtext1: "Transform your culinary workflow with GPT-powered assistance. Instantly retrieve yacht-specific recipes, provisioning checklists, and food safety guidelines",
            subtext2: 'AI auto-classifies new galley documents and enhances your ability to deliver exceptional meals while staying organized in the most demanding kitchens.'
        },
        {
            title: "Advance Your Career as a Yacht Chef",
            image: shipIcon,

            subtext1: "Access training programs and resources to enhance your skills in culinary arts, food presentation, and dietary customization.",
            subtext2: 'Find & book recommended suppliers for cleaning products, décor and organizational tools tailored for yachts'
        },
        {
            title: "Food Safety and Hygiene Best Practices",
            image: engineeringIcon,
            subtext1: 'Learn guidelines for safe storage and handling of ingredients in marine environments.',
            subtext2: 'Stay up to date with food safety certifications and onboard hygiene standards.'
        }
    ]

    return (

        <LandingPageGrid gridData={gridData} />
    )
}

export default Section2ChefGallery  
