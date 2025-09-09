import React from 'react'
import './privacy-policy.css';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PrivacyPolicy = () => {
    const [numPages, setNumPages] = React.useState();
    const [pageNumber, setPageNumber] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [scale, setScale] = React.useState(1.0);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    }

    function onDocumentLoadError(error) {
        setError(error.message || 'Failed to load PDF');
        setLoading(false);
    }

    function onPageLoadSuccess() {
        setError(null);
    }

    function onPageLoadError(error) {
        setError(error.message || 'Failed to load page');
    }

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(numPages, prev + 1));
    };

    const zoomIn = () => {
        setScale(prev => Math.min(2.0, prev + 0.2));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(0.5, prev - 0.2));
    };

    const resetZoom = () => {
        setScale(1.0);
    };

    // Update container width on resize
    React.useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

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

            {/* PDF Controls */}
            <div className="pdf-controls">
                <div className="pdf-controls-left">
                    <button
                        className="control-btn zoom-btn"
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        title="Zoom Out"
                    >
                        −
                    </button>
                    <span className="zoom-level">{Math.round(scale * 100)}%</span>
                    <button
                        className="control-btn zoom-btn"
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                        title="Zoom In"
                    >
                        +
                    </button>
                    <button
                        className="control-btn reset-btn"
                        onClick={resetZoom}
                        title="Reset Zoom"
                    >
                        Reset
                    </button>
                </div>

                <div className="pdf-controls-center">
                    <button
                        className="control-btn nav-btn"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        title="Previous Page"
                    >
                        ‹ Prev
                    </button>
                    <span className="page-info">
                        Page {pageNumber} of {numPages || '?'}
                    </span>
                    <button
                        className="control-btn nav-btn"
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        title="Next Page"
                    >
                        Next ›
                    </button>
                </div>

                <div className="pdf-controls-right">

                </div>
            </div>

            <div className="pdf-viewer-container" ref={containerRef}>
                {loading && (
                    <div className="pdf-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading PDF...</p>
                    </div>
                )}

                {error && (
                    <div className="pdf-error">
                        <div className="error-icon">⚠️</div>
                        <h3>Error Loading PDF</h3>
                        <p>{error}</p>
                        <button
                            className="retry-btn"
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!error && (
                    <Document
                        file="/Privacy-Policy.pdf"
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<div className="pdf-loading"><div className="loading-spinner"></div><p>Loading PDF...</p></div>}
                        error={<div className="pdf-error"><div className="error-icon">⚠️</div><h3>Error Loading PDF</h3><p>Please try refreshing the page</p></div>}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            onLoadSuccess={onPageLoadSuccess}
                            onLoadError={onPageLoadError}
                            loading={<div className="page-loading"><div className="loading-spinner"></div></div>}
                            error={<div className="page-error">Failed to load page</div>}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            width={containerWidth ? Math.min(containerWidth - 40, 800) : undefined}
                        />
                    </Document>
                )}
            </div>

            <div className="privacy-policy-footer">
                <p>For questions about this privacy policy, please contact us.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy
