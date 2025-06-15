import React, { useEffect, useState } from "react";
import ForgotPasswordDesktop from "./forgot-password-desktop";
import ForgotPasswordMobile from "./forgot-password-mobile";

const ForgotPassword = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <ForgotPasswordMobile /> : <ForgotPasswordDesktop />;
};

export default ForgotPassword;
