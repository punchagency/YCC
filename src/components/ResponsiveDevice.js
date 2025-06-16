// ResponsiveDevice.js
export function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 993;
}
