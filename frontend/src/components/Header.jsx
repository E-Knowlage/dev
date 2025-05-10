import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.logoContainer}>
            <h1 style={styles.logoText}>Skill sharing</h1>
            <p style={styles.tagline}></p>
          </div>
          
          <div style={styles.searchContainer}>
            <input 
              type="text" 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.navContainer}>
          <Link to="/dashboard" style={styles.navLink}>
            <i className='bx bxs-home' style={{ fontSize: '20px', color: 'white' }}></i>
          </Link>
          {/* Add new home icon for post-view page */}
          <button 
            onClick={() => navigate('/post-view')} 
            style={styles.iconButton}
            title="View Posts"
          >
            <i className='bx bx-list-ul' style={{ fontSize: '20px', color: 'white' }}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#0046be',
    color: '#ffffff',
    padding: '15px 20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    color: 'white',
    fontFamily: "'Montserrat', sans-serif",
  },
  tagline: {
    fontSize: '12px',
    margin: 0,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  searchContainer: {
    display: 'flex',
    width: '100px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRight: 'none',
    borderRadius: '10px 10px 10px 10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px', 
  },
  navLink: {
    textDecoration: 'none',
    padding: '5px 0',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  },
};

export default Header;