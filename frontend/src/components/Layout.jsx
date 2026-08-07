import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Main application layout with sidebar, header, and content area.
 * @param {object} user - Current user.
 * @param {function} onLogout - Logout handler.
 * @param {React.ReactNode} children - Page content.
 */
export default function Layout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        <main>
          <div className="content">{children}</div>
        </main>
      </div>
    </div>
  );
}
