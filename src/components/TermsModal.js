// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import CloseIcon from '@mui/icons-material/Close';
// import DownloadIcon from '@mui/icons-material/Download';

// const TermsModal = ({ isOpen, onClose, pdfUrl, title, fileName }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = pdfUrl;
//     link.download = fileName || 'terms-and-conditions.pdf';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleIframeLoad = () => {
//     setIsLoading(false);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             zIndex: 9999,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '20px',
//           }}
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             style={{
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               width: '100%',
//               maxWidth: '90vw',
//               maxHeight: '90vh',
//               display: 'flex',
//               flexDirection: 'column',
//               overflow: 'hidden',
//               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '20px 24px',
//               borderBottom: '1px solid #e0e0e0',
//               backgroundColor: '#f8f9fa',
//             }}>
//               <div>
//                 <h2 style={{
//                   margin: 0,
//                   fontSize: '20px',
//                   fontWeight: '600',
//                   color: '#034D92',
//                 }}>
//                   {title || 'Terms and Conditions'}
//                 </h2>
//                 <p style={{
//                   margin: '4px 0 0 0',
//                   fontSize: '14px',
//                   color: '#666',
//                 }}>
//                   Please review the complete terms and conditions
//                 </p>
//               </div>
//               <div style={{ display: 'flex', gap: '8px' }}>
//                 <button
//                   onClick={handleDownload}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '6px',
//                     padding: '8px 12px',
//                     border: '1px solid #034D92',
//                     borderRadius: '6px',
//                     backgroundColor: 'transparent',
//                     color: '#034D92',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     transition: 'all 0.2s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = '#034D92';
//                     e.target.style.color = 'white';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = 'transparent';
//                     e.target.style.color = '#034D92';
//                   }}
//                 >
//                   <DownloadIcon style={{ fontSize: '16px' }} />
//                   Download
//                 </button>
//                 <button
//                   onClick={onClose}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: '36px',
//                     height: '36px',
//                     border: 'none',
//                     borderRadius: '6px',
//                     backgroundColor: '#f0f0f0',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = '#e0e0e0';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = '#f0f0f0';
//                   }}
//                 >
//                   <CloseIcon style={{ fontSize: '20px', color: '#666' }} />
//                 </button>
//               </div>
//             </div>

//             {/* PDF Viewer */}
//             <div style={{
//               flex: 1,
//               position: 'relative',
//               backgroundColor: '#f5f5f5',
//             }}>
//               {isLoading && (
//                 <div style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   zIndex: 1,
//                 }}>
//                   <div style={{
//                     width: '40px',
//                     height: '40px',
//                     border: '4px solid #f3f3f3',
//                     borderTop: '4px solid #034D92',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite',
//                   }} />
//                   <style>{`
//                     @keyframes spin {
//                       0% { transform: rotate(0deg); }
//                       100% { transform: rotate(360deg); }
//                     }
//                   `}</style>
//                 </div>
//               )}
//               <iframe
//                 src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   border: 'none',
//                   opacity: isLoading ? 0.3 : 1,
//                   transition: 'opacity 0.3s ease',
//                 }}
//                 onLoad={handleIframeLoad}
//                 title={title || 'Terms and Conditions'}
//               />
//             </div>

//             {/* Footer */}
//             <div style={{
//               padding: '16px 24px',
//               borderTop: '1px solid #e0e0e0',
//               backgroundColor: '#f8f9fa',
//               textAlign: 'center',
//             }}>
//               <p style={{
//                 margin: 0,
//                 fontSize: '14px',
//                 color: '#666',
//               }}>
//                 By closing this modal, you acknowledge that you have reviewed the terms and conditions
//               </p>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default TermsModal; 

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CloseIcon from "@mui/icons-material/Close"
import DownloadIcon from "@mui/icons-material/Download"

const TermsModal = ({ isOpen, onClose, pdfUrl, title, fileName }) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = fileName || "terms-and-conditions.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              width: "100%",
              height: "100%",
              maxWidth: "900px",
              maxHeight: "95vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                flexShrink: 0,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#034D92",
                    lineHeight: "1.4",
                    wordBreak: "break-word",
                  }}
                >
                  {title || "Terms and Conditions"}
                </h2>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: "1.4",
                  }}
                >
                  Please review the complete terms and conditions
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                  marginLeft: "16px",
                }}
              >
                <button
                  onClick={handleDownload}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    border: "1px solid #034D92",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    color: "#034D92",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#034D92"
                    e.target.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.color = "#034D92"
                  }}
                >
                  <DownloadIcon style={{ fontSize: "16px" }} />
                  <span style={{ display: window.innerWidth > 480 ? "inline" : "none" }}>Download</span>
                </button>
                <button
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#f3f4f6",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#e5e7eb"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6"
                  }}
                >
                  <CloseIcon style={{ fontSize: "20px", color: "#6b7280" }} />
                </button>
              </div>
            </div>

            {/* PDF Viewer Container */}
            <div
              style={{
                flex: 1,
                position: "relative",
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                minHeight: 0, // Important for flex child to shrink
              }}
            >
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "3px solid #f3f4f6",
                      borderTop: "3px solid #034D92",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    Loading document...
                  </p>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}

              {/* PDF Iframe */}
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  opacity: isLoading ? 0.1 : 1,
                  transition: "opacity 0.3s ease",
                  backgroundColor: "white",
                  borderRadius: "0 0 16px 16px",
                }}
                onLoad={handleIframeLoad}
                title={title || "Terms and Conditions"}
                allow="fullscreen"
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                }}
              >
                By closing this modal, you acknowledge that you have reviewed the terms and conditions
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TermsModal
