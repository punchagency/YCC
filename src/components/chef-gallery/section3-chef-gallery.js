import LandingPageExitCard from '../landing-page-exit-card'

const Section3ChefGallery = () => {
    const sectionData = {
        title: 'Join Our Crew Network Today',
        subText:"Elevate your career as a Chef. Become a member of our verified Crew Network and gain access to exclusive resources, job opportunities, and management tools dedicated to your success.",
        button: {
            text: 'Join Now',
            path: '/get-started'
        }
    } 
  return (
    <LandingPageExitCard sectionData={sectionData} />
  )
}

export default Section3ChefGallery          