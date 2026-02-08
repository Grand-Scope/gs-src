"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import NotificationPanel from "@/components/panels/NotificationPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";
import "@/components/panels/panels.css";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    // Close settings if open
    if (settingsOpen) setSettingsOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    // Close notifications if open
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <div id="sidebar-overlay" className="sidebar-overlay" onClick={closeSidebar}></div>
      <Sidebar user={user} onLinkClick={closeSidebar} />
      <main className="main-content">
        <Header 
          title={title} 
          onMenuClick={toggleSidebar}
          onNotificationsClick={toggleNotifications}
          onSettingsClick={toggleSettings}
        />
        <div className="page-content">{children}</div>
      </main>

      {/* Slide-out Panels */}
      <NotificationPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
      <SettingsPanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}
