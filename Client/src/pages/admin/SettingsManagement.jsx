import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { fetchCurrentUser, logout } from "../../services/api";
import "./UserManagement.css"; // Reuse the same CSS

const SettingsManagement = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setAdmin(userData);
        setEditForm({ name: userData.name || '', email: userData.email || '' });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();

    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedLanguage = localStorage.getItem('language') || 'en';

    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
    setLanguage(savedLanguage);

    // Apply theme
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  const handleThemeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleNotificationToggle = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    // In a real application, this would make an API call to update the profile
    // Since we don't have a backend endpoint, we'll just update local state
    setAdmin({ ...admin, name: editForm.name, email: editForm.email });
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditForm({ name: admin.name || '', email: admin.email || '' });
    setEditMode(false);
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await logout();
        window.location.href = '/'; // Redirect to home page
      } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real application, this would make an API call to delete the account
      alert('Account deletion is not implemented in the backend yet. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <div className="admin-content">
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content">
          <div className="user-management-header">
            <h2>Settings</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

            {/* Profile Settings */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Profile Settings</h3>

              {editMode ? (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSaveProfile}
                      style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Name:</strong> {admin?.name || 'Admin User'}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Email:</strong> {admin?.email || 'admin@skillbridge.com'}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Role:</strong> Administrator
                  </div>
                  <button
                    onClick={handleEditProfile}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Appearance Settings */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Appearance</h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={handleThemeToggle}
                    style={{ marginRight: '10px' }}
                  />
                  <span>Dark Mode</span>
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Language</label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            {/* Notification Settings */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Notifications</h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={handleNotificationToggle}
                    style={{ marginRight: '10px' }}
                  />
                  <span>Enable Notifications</span>
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  <span>Email Notifications</span>
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  <span>Push Notifications</span>
                </label>
              </div>
            </div>

            {/* Account Actions */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Account Actions</h3>

              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleSignOut}
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '10px' }}
                >
                  Sign Out
                </button>
              </div>

              <div>
                <button
                  onClick={handleDeleteAccount}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                >
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
