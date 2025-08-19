import React from 'react'
import './terms-and-conditions.css'

const TermsAndConditions = () => {

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);


    return (
        <div className="terms-conditions-container">
            <div className="terms-conditions-header">
                <h1>Terms and Conditions</h1>
                <p>Please review our terms and conditions below</p>
            </div>

            <div className="pdf-viewer-container">
                <iframe
                    src="/Terms-and-Conditions.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&download=0&print=0"
                    title="Terms and Conditions"
                    className="pdf-viewer"
                    width="100%"
                >
                </iframe>
            </div>
        </div>
    )
}

export default TermsAndConditions