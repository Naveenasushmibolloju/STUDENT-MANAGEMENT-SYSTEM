import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ToastContainer';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import StudentEdit from './pages/StudentEdit';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CourseEdit from './pages/CourseEdit';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('sms_user') || 'null')
  );

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener('sms:logout', handleLogout);
    return () => window.removeEventListener('sms:logout', handleLogout);
  }, []);

  const login = (u) => {
    localStorage.setItem('sms_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('sms_accessToken');
    localStorage.removeItem('sms_refreshToken');
    localStorage.removeItem('sms_user');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {user ? (
          <Layout user={user} onLogout={logout}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/students/:id/edit" element={<StudentEdit />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/:id/edit" element={<CourseEdit />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile user={user} onLogout={logout} />} />
            </Routes>
          </Layout>
        ) : (
          <Login onLogin={login} />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
