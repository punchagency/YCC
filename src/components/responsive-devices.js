"use client";

import { useState, useEffect } from "react";

// Utility function to detect mobile devices
export const isMobile = () => {
  if (typeof window === "undefined") return false;

  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

// Hook version for React components
export const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setMobile(isMobile());
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return mobile;
};

// Component version if needed
const ResponsiveDevice = ({ children }) => {
  const mobile = useIsMobile();

  return children({ isMobile: mobile });
};

export default ResponsiveDevice;
