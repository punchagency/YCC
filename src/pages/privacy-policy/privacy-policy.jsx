import React from 'react'
import './privacy-policy.css';
import PDFViewer from '../../components/PDFViewer';

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

            <PDFViewer
                pdfUrl={`/Privacy-Policy.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&download=0`}
                title="Privacy Policy PDF"
                className="privacy-policy-pdf-viewer"
            />

            <div className="privacy-policy-footer">
                <p>For questions about this privacy policy, please contact us.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy
