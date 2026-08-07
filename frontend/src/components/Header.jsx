import React from 'react';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import StudentAvatar from './StudentAvatar';

export default function Header({ user, onMenuClick, isDark, onToggleTheme }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <Menu size={20} />
      </button>

      <div className="header-title">
        <span className="eyebrow">CAMPUS MANAGEMENT</span>
        <h2>Student Management</h2>
      </div>

      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={19} />
          <i />
        </button>
        <div className="header-user">
          <div>
            <b>{user?.name}</b>
            <small>Admin account</small>
          </div>
          <StudentAvatar name={user?.name} size="sm" />
        </div>
      </div>
    </header>
  );
}
