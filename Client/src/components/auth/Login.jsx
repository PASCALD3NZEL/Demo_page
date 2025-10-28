import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', formData);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      backgroundColor: '#f0f8ff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '450px',
      height: '699px',
      textAlign: 'center'
    },
    title: {
      color: '#ffb366',
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '30px',
      letterSpacing: '0.5px'
    },
    form: {
      textAlign: 'left'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: '#666',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      textTransform: 'lowercase'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    loginButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px',
      textTransform: 'uppercase'
    },
    links: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      margin: '0 5px'
    },
    linkText: {
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login here</h2>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Value"
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
              placeholder="Value"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>choose a role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        <div style={styles.links}>
          <div style={styles.linkText}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot password?
            </Link>
            <span style={{margin: '0 20px'}}>|</span>
            <span>No account? </span>
            <Link to="/role-selection" style={styles.link}>
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;