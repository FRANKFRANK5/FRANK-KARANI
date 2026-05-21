import React, { useState, useEffect } from 'react';
import WriteUpFeed from './WriteUpFeed';
import Login from './Login';
import AddWriteUp from './AddWriteUp';
import { apiService } from './apiService';

function App() {
  // Application authentication states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Read current storage states on component initialization
  useEffect(() => {
    // Dynamically checks if the admin token exists inside local storage
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLoginModal(false); // Cleanly closes the overlay login pane on success
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAdmin(false);
    alert('Logged out securely.');
  };

  // Triggers immediate re-fetching within WriteUpFeed when a new post drops
  const handleWriteUpAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={styles.appContainer}>
      {/* --- TOP HEADER NAVIGATION BAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>⚡ CyberPortfolio.db</div>
        <div>
          {isAdmin ? (
            <button 
              onClick={handleLogout} 
              style={styles.logoutBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#b91c1c'}
            >
              Admin Logout 🔓
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(!showLoginModal)} 
              style={styles.loginBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0284c7'}
            >
              {showLoginModal ? 'Close Login X' : 'Admin Login 🔒'}
            </button>
          )}
        </div>
      </nav>

      {/* --- SECURE ADMIN ONLY PORTAL PANEL --- */}
      {isAdmin && (
        <div style={styles.adminDashboard}>
          <div style={styles.adminBadge}>👑 Admin Session Active</div>
          <AddWriteUp onWriteUpAdded={handleWriteUpAdded} />
        </div>
      )}

      {/* --- MODAL AUTHENTICATION INTERFACE LAYER --- */}
      {showLoginModal && !isAdmin && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          {/* stopPropagation inazuia modal isijifunge mtumiaji akibofya ndani ya fomu ya login */}
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ color: '#ef4444', fontFamily: 'monospace', fontWeight: 'bold' }}>[ AUTH_REQUIRED ]</span>
              <button 
                onClick={() => setShowLoginModal(false)} 
                style={styles.closeModalBtn}
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                &times;
              </button>
            </div>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* --- GENERAL PUBLIC MAIN WRAPPER FEED --- */}
      <main style={styles.mainContent}>
        <WriteUpFeed key={refreshTrigger} isAdmin={isAdmin} />
      </main>
    </div>
  );
}

// Enterprise Cyber Layout Theme styles
const styles = {
  appContainer: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
  },
  navBrand: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#38bdf8',
    fontFamily: 'monospace',
  },
  loginBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s ease-in-out',
  },
  logoutBtn: {
    backgroundColor: '#b91c1c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s ease-in-out',
  },
  adminDashboard: {
    backgroundColor: '#0b0f19',
    padding: '1.5rem',
    borderBottom: '2px dashed #0284c7',
  },
  adminBadge: {
    textAlign: 'center',
    backgroundColor: '#064e3b',
    color: '#a7f3d0',
    padding: '0.4rem',
    borderRadius: '4px',
    maxWidth: '200px',
    margin: '0 auto 1rem auto',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #334155',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '1.5rem',
    cursor: 'pointer',
    lineHeight: 1,
    transition: 'color 0.2s ease-in-out',
  },
  mainContent: {
    padding: '1rem 0',
  }
};

export default App;
