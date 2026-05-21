\import React, { useState } from 'react';
import { apiService } from './apiService';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiService.login({ username, password });
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', color: '#f8fafc' }}>
      <h3 style={{ color: '#38bdf8', margin: '0 0 1rem 0' }}>&gt;_ ADMIN_PORTAL_AUTH</h3>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>[!] ERROR: {error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8' }}>OPERATOR ID:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8' }}>SECURITY ACCESS KEY:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', outline: 'none' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {loading ? '[ EXECUTING AUTH... ]' : 'INITIALIZE SESSION 🔓'}
        </button>
      </form>
    </div>
  );
}

export default Login;