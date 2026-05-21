import React from 'react';
import WriteUpFeed from './WriteupFeed';

function WriteupsPage({ onBack, isAdmin, refreshTrigger }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'monospace', color: '#f8fafc' }}>
      <button onClick={onBack} style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '0.5rem 1rem', cursor: 'pointer', marginBottom: '2rem', borderRadius: '4px' }}>
        &lt;-- Back to Main Matrix
      </button>
      <h2 style={{ color: '#10b981', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>[💻] RECENT CYBER WRITE-UPS & POF</h2>
      <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1rem' }}>
        <WriteUpFeed key={refreshTrigger} isAdmin={isAdmin} />
      </div>
    </div>
  );
}

export default WriteupsPage;