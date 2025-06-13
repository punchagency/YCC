// import React, { useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Message } from 'primereact/message';
// import { Link, useNavigate } from 'react-router-dom';
// import { isMobile } from '../components/ResponsiveDevice';
// import LandingPageChatbot from '../components/chatbot/landing-page-chatbot';
// import CustomButton from '../components/Button';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) {
//       setError('Email is required.');
//       return;
//     }
//     setLoading(true);
//     // Add your forgot password logic here
//     setLoading(false);
//   };

//   return (
//     <div className="p-d-flex p-jc-center p-ai-center" style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', position: 'relative' }}>
//       {/* Back Button for mobile (fixed at top) */}
//       {window.history.length > 1 && isMobile() && (
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           zIndex: 2000,
//           background: 'transparent',
//           width: '100vw',
//           padding: '16px 0 0 16px',
//         }}>
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: '#000',
//               fontSize: 28
//             }}
//             aria-label="Back"
//           >
//             <ArrowBackIcon />
//           </button>
//         </div>
//       )}
//       <div style={{ 
//         width: '100%', 
//         maxWidth: '400px', 
//         padding: isMobile() ? '20px' : '40px',
//         marginTop: isMobile() ? '60px' : '80px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'flex-start',
//         position: 'relative'
//       }}>
//         {/* Back Button for desktop (inside right panel, above logo) */}
//         {window.history.length > 1 && !isMobile() && (
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: '#034D92',
//               margin: '0 0 16px 0',
//               fontSize: 28,
//               alignSelf: 'flex-start'
//             }}
//             aria-label="Back"
//           >
//             <ArrowBackIcon />
//           </button>
//         )}
//         {/* Logo (if you have one, place here) */}
//         <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
//           <img src={require('../assets/images/logo-login.png')} alt="Company logo" style={{ maxWidth: 180, height: 'auto' }} />
//         </div>
//         <h2 style={{ 
//           color: '#034D92', 
//           marginBottom: '24px',
//           fontSize: isMobile() ? '24px' : '28px',
//           textAlign: 'center',
//           width: '100%'
//         }}>
//           Forgot Password
//         </h2>
//         <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//           {error && <Message severity="error" text={error} className="p-mb-3" />}
//           <div className="flex flex-column p-field p-mb-3">
//             <label htmlFor="email" style={{ 
//               fontFamily: 'Inter, sans-serif',
//               color: '#034D92',
//               marginBottom: '8px',
//               fontSize: '16px'
//             }}>
//               Email Address
//             </label>
//             <InputText
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email address"
//               className="p-d-block"
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 borderRadius: '8px',
//                 border: '1px solid #ccc',
//                 fontSize: '16px'
//               }}
//               required
//             />
//           </div>
//           <CustomButton
//             type="submit"
//             disabled={loading}
//             style={{ width: '100%', marginTop: '24px' }}
//           >
//             {loading ? 'Sending...' : 'Reset Password'}
//           </CustomButton>
//         </form>
//       </div>
//       <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
//         <LandingPageChatbot />
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword; 