import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  LogOut,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react';
import StudentAvatar from './StudentAvatar';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ user, onLogout, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`.trim()}>
      <div className="brand">
        <span className="logo small">
          <GraduationCap size={20} />
        </span>
        <span>
          Campus<span className="accent">Flow</span>
        </span>
      </div>

      <p className="nav-title">WORKSPACE</p>

      <nav>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon size={18} />
            {label}
            <ChevronRight className="nav-arrow" size={15} />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-promo">
        <ShieldCheck size={17} />
        <b>System status</b>
        <span>All services are available.</span>
      </div>

      <div className="side-bottom">
        <div className="user">
          <StudentAvatar name={user?.name} />
          <div>
            <b>{user?.name}</b>
            <small>{user?.role === 'admin' ? 'Administrator' : 'Staff member'}</small>
          </div>
        </div>
        <button className="logout" onClick={onLogout}>
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
