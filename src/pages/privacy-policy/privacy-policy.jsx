import React from 'react'
import './privacy-policy.css'

const PrivacyPolicy = () => {

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Privacy Policy</h1>
                <p>Please review our privacy policy below</p>
            </div>

            <div className="pdf-viewer-container">
                <iframe
                    src="/Privacy-Policy.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&download=0&print=0"
                    title="Privacy Policy"
                    className="pdf-viewer"
                    width="100%"
                >
                </iframe>
            </div>
        </div>
    )
}

export default PrivacyPolicy
