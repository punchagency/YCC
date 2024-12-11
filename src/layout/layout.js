import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header";
import LeftMenu from "../components/menu";
import { useState } from "react";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <main className="flex page relative wrapper">
      <LeftMenu role="Captain/Manager" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="w-full right-panel-component">
        <AdminHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
        <Outlet />
      </div>
    </main>
  );
}
