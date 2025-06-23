import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

export default function SettingsPage() {
  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => { if (setPageTitle) setPageTitle("Settings"); }, [setPageTitle]);

  return <div>Settings</div>;
} 