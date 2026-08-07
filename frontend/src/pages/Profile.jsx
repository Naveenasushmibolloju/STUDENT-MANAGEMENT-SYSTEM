import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Save } from 'lucide-react';
import { useToast } from '../components/ToastContainer';
import StudentAvatar from '../components/StudentAvatar';
import Page from '../components/Page';

export default function Profile({ user, onLogout }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const { showToast } = useToast();

  const save = (e) => {
    e.preventDefault();
    showToast('Profile updated successfully', 'success');
  };

  return (
    <Page
      title="Profile"
      subtitle="Manage your account settings and preferences."
    >
      <div className="detail-grid">
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h3>Profile information</h3>
          </div>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <StudentAvatar name={form.name} size="lg" />
            <div style={{ marginTop: '16px' }}>
              <b style={{ fontSize: '20px', display: 'block' }}>
                {form.name}
              </b>
              <small style={{ color: '#64748b' }}>
                {form.email}
              </small>
            </div>
          </div>

          <form onSubmit={save}>
            <div className="form-grid">
              <label>
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </label>
              <label className="full-width">
                Role
                <select disabled>
                  <option>Administrator</option>
                </select>
              </label>
              <button className="btn btn-primary full-width">
                <Save size={18} />
                Save changes
              </button>
            </div>
          </form>
        </div>

        {/* Account Settings */}
        <div className="card">
          <div className="card-header">
            <h3>Account settings</h3>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <Shield size={20} style={{ color: '#64748b' }} />
                <b>Security</b>
              </div>
              <small style={{ color: '#64748b' }}>
                Password and authentication settings
              </small>
            </div>

            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <Calendar size={20} style={{ color: '#64748b' }} />
                <b>Last login</b>
              </div>
              <small style={{ color: '#64748b' }}>
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : 'Never'}
              </small>
            </div>

            <div style={{ padding: '16px' }}>
              <button
                className="btn btn-danger full-width"
                onClick={onLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
