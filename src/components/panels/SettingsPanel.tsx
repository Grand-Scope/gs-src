"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`panel-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className={`slide-panel settings-panel ${isOpen ? "open" : ""}`}>
        <div className="panel-header">
          <h3>Settings</h3>
          <button onClick={onClose} className="panel-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="panel-content">
          {/* Appearance Section */}
          <div className="settings-section">
            <h4 className="settings-section-title">Appearance</h4>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Theme</span>
                <span className="settings-item-description">Choose your preferred theme</span>
              </div>
              <div className="theme-selector">
                <button
                  className={`theme-option ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                  aria-label="Light theme"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Light</span>
                </button>
                <button
                  className={`theme-option ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                  aria-label="Dark theme"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <h4 className="settings-section-title">Notifications</h4>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Email notifications</span>
                <span className="settings-item-description">Receive email alerts for updates</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Push notifications</span>
                <span className="settings-item-description">Get browser push notifications</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Task reminders</span>
                <span className="settings-item-description">Remind me before task deadlines</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Account Section */}
          <div className="settings-section">
            <h4 className="settings-section-title">Account</h4>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Profile settings</span>
                <span className="settings-item-description">Manage your profile information</span>
              </div>
              <button className="btn btn-ghost btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Password</span>
                <span className="settings-item-description">Change your password</span>
              </div>
              <button className="btn btn-ghost btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
