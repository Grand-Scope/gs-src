"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  title: string;
  user: {
    name?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function DashboardLayoutClient({
  children,
  title,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  };

  return (
    <div className="dashboard-layout">
      <div id="sidebar-overlay" className="sidebar-overlay" onClick={closeSidebar}></div>
      <Sidebar user={user} />
      <main className="main-content">
        <Header title={title} onMenuClick={toggleSidebar} />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
