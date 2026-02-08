"use client";

import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample notifications - in production, these would come from an API
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New Project Created",
    message: "Website Redesign project has been created successfully.",
    time: "2 minutes ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Task Assigned",
    message: "You have been assigned to 'Design Homepage' task.",
    time: "1 hour ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Deadline Approaching",
    message: "Project 'Mobile App' deadline is in 2 days.",
    time: "3 hours ago",
    read: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Comment Added",
    message: "John added a comment on your task.",
    time: "5 hours ago",
    read: true,
    type: "info",
  },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "warning":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "error":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`panel-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className={`slide-panel notification-panel ${isOpen ? "open" : ""}`}>
        <div className="panel-header">
          <div className="panel-title">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="badge badge-primary">{unreadCount} new</span>
            )}
          </div>
          <button onClick={onClose} className="panel-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="panel-actions">
          <button onClick={markAllAsRead} className="btn btn-ghost btn-sm" disabled={unreadCount === 0}>
            Mark all as read
          </button>
          <button onClick={clearAll} className="btn btn-ghost btn-sm" disabled={notifications.length === 0}>
            Clear all
          </button>
        </div>

        <div className="panel-content">
          {notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  {!notification.read && <div className="notification-dot" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p>No notifications</p>
              <span>You&apos;re all caught up!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
