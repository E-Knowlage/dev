import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.copyright}>
          © 2025 Skill Sharing Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: '15px 20px',
    borderTop: '1px solid #eaeaea',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyright: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#7f8c8d',
    margin: 0,
  },
};

export default Footer;