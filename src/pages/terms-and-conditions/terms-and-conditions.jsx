import React from 'react'
import './terms-and-conditions.css';
import PDFViewer from '../../components/PDFViewer';

const TermsAndConditions = () => {
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Terms & Conditions</h1>
                <p>Please review our terms & conditions below</p>
            </div>

            <PDFViewer
                pdfUrl="/Terms-and-Conditions.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&download=0"
                title="Terms & Conditions PDF"
                className="terms-conditions-pdf-viewer"
            />

            <div className="privacy-policy-footer">
                <p>For questions about these terms & conditions, please contact us.</p>
            </div>
        </div>
    )
}

export default TermsAndConditions
