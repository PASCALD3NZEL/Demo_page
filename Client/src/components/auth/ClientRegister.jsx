import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const ClientRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: null,
    contact: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client signup data:', formData);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    },
    card: {
      backgroundColor: '#f0f8ff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '450px',
      height: '745px'
    },
    title: {
      fontSize: '20px',
      marginBottom: '30px',
      color: '#ffb366',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333',
      textAlign: 'left'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    fileInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#f8f9fa',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px'
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#666'
    },
    link: {
      color: '#007bff',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Hey client, signup here</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>username/organization_name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>profile_image/organization_logo</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              style={styles.fileInput}
              accept="image/*"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>contact</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              style={styles.input}
              placeholder="0711234355"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="must have at least 6 characters"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="must have at least 6 characters"
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <div style={styles.loginLink}>
          Already signed up? <Link to="/" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;