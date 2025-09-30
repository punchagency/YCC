import React from 'react';

const PDFViewer = ({ pdfUrl, title, className = '' }) => {
    return (
        <div className={`pdf-viewer-container ${className}`}>
            <div className="pdf-overlay"></div>

            {/* PDF Iframe */}
            <div className="pdf-iframe-wrapper">
                <iframe
                    src={pdfUrl}
                    className="pdf-iframe"
                    title={title || "PDF Viewer"}
                    width="100%"
                    height="100%"
                    style={{
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        background: 'white',
                        minHeight: '70vh',
                        width: '100%',
                        pointerEvents: 'auto'
                    }}
                />
            </div>

            {/* Note about PDF controls */}
            <div className="pdf-notice">
                <p><small>Use your browser's built-in PDF controls to navigate and zoom</small></p>
            </div>
        </div>
    );
};

export default PDFViewer;
