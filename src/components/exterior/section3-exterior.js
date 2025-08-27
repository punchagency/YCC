import LandingPageExitCard from '../landing-page-exit-card'

const Section3Exterior = () => {
    const sectionData = {
        title: 'Join Our Crew Network Today',
        subText: "Elevate your career as an Exterior Yacht crew member. Become a member of our Network and gain access to your department management tools.",
        button: {
            text: 'Join Now',
            path: '/get-started'
        }
    } 
  return (
    <LandingPageExitCard sectionData={sectionData} />
  )
}   

export default Section3Exterior
