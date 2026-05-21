import React from 'react';

function Certifications({ onBack }) {
  const certificates = [
    { id: 1, title: 'TCRA CyberChampions Top 50 National Certificate', fileUrl: '/certificates/tcra_2025.pdf', date: '2025/2026' },
    { id: 2, title: 'picoCTF Bronze & Silver League Achievement', fileUrl: '/certificates/picoctf_league.pdf', date: '2026' },
    { id: 3, title: 'Fortinet Getting Started in Cybersecurity', fileUrl: '/certificates/fortinet_nse.pdf', date: '2026' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'monospace', color: '#f8fafc' }}>
      <button onClick={onBack} style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '0.5rem 1rem', cursor: 'pointer', marginBottom: '2rem', borderRadius: '4px' }}>
        &lt;-- Back to Main Matrix
      </button>
      <h2 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>[🏆] CERTIFICATIONS & ARCHIVES</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {certificates.map(cert => (
          <div key={cert.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #334155', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, color: '#f1f5f9' }}>{cert.title}</h4>
              <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Issued: {cert.date}</p>
            </div>
            <a href={cert.fileUrl} download style={{ backgroundColor: '#0f766e', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Download PDF ⬇️
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certifications;