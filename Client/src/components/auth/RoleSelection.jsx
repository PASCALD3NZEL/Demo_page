import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    },
    card: {
      backgroundColor: '#f0f8ff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '976px',
      height: '491px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    title: {
      fontSize: '24px',
      marginBottom: '30px',
      color: '#333',
      fontWeight: '800',
      letterSpacing: '2px'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '550px',
      margin: '0 auto',
      marginTop: '50px'
    },
    button: {
      width: '250px',
      height: '70px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: '800',
      textTransform: 'uppercase'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome To Skill<span style={{color: '#ffb366'}}>Bridge</span> Signup, Kindly<br />choose your <span style={{color: '#ffb366'}}>role</span></h2>
        <div style={styles.buttonContainer}>
          <button 
            style={styles.button}
            onClick={() => navigate('/freelancer-register')}
          >
            Freelancer
          </button>
          <button 
            style={styles.button}
            onClick={() => navigate('/client-register')}
          >
            Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;