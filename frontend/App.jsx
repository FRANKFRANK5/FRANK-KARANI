import React, { useState, useEffect } from 'react';
import WriteUpFeed from './writeupFeed'; // Fetching your dynamic cyber database reports
import Login from './Login';
import AddWriteUp from './AddWriteUp';
import { apiService } from './apiService';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Authenticate session on client initialization
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAdmin(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAdmin(false);
    alert('Logged out securely.');
  };

  // Force re-fetch inside WriteUpFeed component on new entry deployment
  const handleWriteUpAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Local storage mapping for academic & professional certifications (Store PDFs in frontend/public/certificates/)
  const certificates = [
    { id: 1, title: 'TCRA CyberChampions Top 50 National Certificate', fileUrl: '/certificates/tcra_2025.pdf', date: '2025/2026' },
    { id: 2, title: 'picoCTF Bronze & Silver League Achievement', fileUrl: '/certificates/picoctf_league.pdf', date: '2026' },
    { id: 3, title: 'Fortinet Getting Started in Cybersecurity', fileUrl: '/certificates/fortinet_nse.pdf', date: '2026' }
  ];

  return (
    <div style={styles.appContainer}>
      {/* --- TOP NAVBAR NAVIGATION LAYER --- */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>⚡ FRANK.SYS</div>
        <div style={styles.navLinks}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#certifications" style={styles.navLink}>Certifications</a>
          <a href="#writeups" style={styles.navLink}>Write-Ups</a>
          {isAdmin ? (
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout 🔓</button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={styles.loginBtn}>Admin 🔒</button>
          )}
        </div>
      </nav>

      {/* --- PRIVILEGED ADMINISTRATIVE PANEL --- */}
      {isAdmin && (
        <div style={styles.adminDashboard}>
          <div style={styles.adminBadge}>👑 Admin Session Active</div>
          <AddWriteUp onWriteUpAdded={handleWriteUpAdded} />
        </div>
      )}

      {/* --- HERO PROFILE MATRIX (#home) --- */}
      <section id="home" style={styles.heroSection}>
        <div style={styles.mainCard}>
          <div style={styles.profileRow}>
            <div style={styles.avatarContainer}>
              <img src="/my-profile-pic.jpg" alt="Frank" style={styles.avatarImg} />
            </div>
            <div style={styles.bioDetails}>
              <h1 style={styles.nameTitle}>Frank Karani</h1>
              <h3 style={styles.studentBadge}>&gt;_ Cybersecurity Freshman @ IAA 🇹🇿</h3>
              <div style={styles.terminalList}>
                <div style={styles.listItem}>&gt; Ethical Hacker in Training & Penetration Tester.</div>
                <div style={styles.listItem}>&gt; Top 50 Nationally | TCRA CyberChampions 2025/26. 🏆</div>
                <div style={styles.listItem}>&gt; Top 150 picoCTF | Bronze & Silver League.</div>
                <div style={styles.listItem}>&gt; Future TCRA Cyber Champion 2027 (4PP3X). 🎯</div>
              </div>
            </div>
          </div>
          9  <div style={styles.quoteBox}>
            <p style={styles.quoteText}>
              "Securing the digital frontier, one vulnerability at a time. Passionate about understanding the attacker's mindset to build unbreakable defenses and dominating upcoming high-tier cybersecurity operations."
            </p>
          </div>
        </div>
      </section>

      {/* --- PUBLIC FILE STORAGE SYSTEM (#certifications) --- */}
      <section id="certifications" style={styles.sectionWrapper}>
        <h2 style={styles.sectionHeading}>[🏆] CERTIFICATIONS & ARCHIVES</h2>
        <div style={styles.certGrid}>
          {certificates.map(cert => (
            <div key={cert.id} style={styles.certCard}>
              <div style={styles.certIcon}>📄</div>
              <div style={styles.certInfo}>
                <h4 style={styles.certTitle}>{cert.title}</h4>
                <p style={styles.certDate}>Issued: {cert.date}</p>
              </div>
              {/* Endpoint connection download gateway */}
              <a href={cert.fileUrl} download style={styles.downloadBtn}>
                Download PDF ⬇️
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC LOGS AND REPORTS STORAGE (#writeups) --- */}
      <section id="writeups" style={styles.sectionWrapper}>
        <h2 style={styles.sectionHeading}>[💻] RECENT CYBER WRITE-UPS & POF</h2>
        <div style={styles.feedContainer}>
          <WriteUpFeed key={refreshTrigger} isAdmin={isAdmin} />
        </div>
      </section>

      {/* --- MIDDLEWARE MODAL AUTHENTICATION INTERFACE --- */}
      {showLoginModal && !isAdmin && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>[ AUTH_REQUIRED ]</span>
              <button onClick={() => setShowLoginModal(false)} style={styles.closeModalBtn}>&times;</button>
            </div>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

// Enterprise Cyber Layout Theme styles
const styles = {
  appContainer: { backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'monospace', color: '#f8fafc', paddingBottom: '4rem' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' },
  navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' },
  loginBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  adminDashboard: { backgroundColor: '#0b0f19', padding: '1.5rem', borderBottom: '2px dashed #0284c7' },
  adminBadge: { textAlign: 'center', backgroundColor: '#064e3b', color: '#a7f3d0', padding: '0.4rem', borderRadius: '4px', maxWidth: '200px', margin: '0 auto 1rem auto', fontSize: '0.85rem', fontWeight: 'bold' },
  heroSection: { display: 'flex', justifyContent: 'center', padding: '3rem 1rem 1rem 1rem' },
  mainCard: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '900px' },
  profileRow: { display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' },
  avatarContainer: { width: '180px', height: '180px', borderRadius: '50%', border: '3px solid #06b6d4', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bioDetails: { flex: 1 },
  nameTitle: { fontSize: '2.5rem', margin: '0 0 0.5rem 0' },
  studentBadge: { color: '#3b82f6', fontSize: '1.1rem', margin: '0 0 1rem 0' },
  terminalList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  listItem: { color: '#cbd5e1', fontSize: '0.95rem' },
  quoteBox: { borderLeft: '4px solid #10b981', backgroundColor: '#070a12', padding: '1rem', marginTop: '1.5rem', borderRadius: '0 8px 8px 0' },
  quoteText: { margin: 0, color: '#94a3b8', fontStyle: 'italic', fontSize: '0.95rem' },
  sectionWrapper: { maxWidth: '900px', margin: '4rem auto 0 auto', padding: '0 1rem' },
  sectionHeading: { color: '#38bdf8', fontSize: '1.3rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.5rem' },
  certGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  certCard: { display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #334155', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  certIcon: { fontSize: '1.5rem' },
  certInfo: { flex: 1 },
  certTitle: { margin: 0, color: '#f1f5f9', fontSize: '1rem' },
  certDate: { margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' },
  downloadBtn: { backgroundColor: '#0f766e', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background 0.2s' },
  feedContainer: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modalContent: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '8px', border: '1px solid #334155', maxWidth: '450px', width: '90%' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  closeModalBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }
};

export default App;