import React, { useState } from 'react';
import { apiService } from './apiService';

const Login = ({ onLoginSuccess }) => {
    // Kuhifadhi data za fomu
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Uthibitishaji wa awali (Client-side Validation)
        if (!username.trim() || !password.trim()) {
            setError('Complete to fill all gape.');
            setLoading(false);
            return;
        }

        try {
            // Tuma ombi kwenye API Seva
            await apiService.login(username, password);
            
            // Kusafisha fomu baada ya kufanikiwa
            setUsername('');
            setPassword('');
            
            // Ambia mfumo mkuu (App.jsx) kuwa login imefanikiwa
            if (onLoginSuccess) onLoginSuccess();
            
            alert('CONGRATULATION YOU SUCCSESSFULL LOG IN WELCOME!!!!!');
        } catch (err) {
            // Onyesha kosa lililotoka kwenye seva (kama "Invalid login credentials")
            setError(err.message);
        } finally {r
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Admin Login (Cyber Portfolio)</h2>
                
                {error && <div style={styles.errorBox}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>personal username (Username):</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            style={styles.input}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Enterpassword (Password):</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={loading ? styles.buttonDisabled : styles.button}
                    >
                        {loading ? 'Inahakiki...' : 'Enter systeam'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Mitindo ya muonekano (CSS-in-JS ya msingi kwa urahisi wa kujaribu)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a' // Rangi nyeusi ya Cyber / Security
    },
    card: {
        backgroundColor: '#1e293b',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '400px',
        color: '#f8fafc'
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.5rem',
        color: '#38bdf8' // Rangi ya Bluu ya Cyber
    },
    errorBox: {
        backgroundColor: '#7f1d1d',
        color: '#fca5a5',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        border: '1px solid #b91c1c',
        textAlign: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '1.25rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        color: '#cbd5e1'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #475569',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box'
    },
    button: {
        backgroundColor: '#0284c7',
        color: '#fff',
        padding: '0.75rem',
        borderRadius: '4px',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s'
    },
    buttonDisabled: {
        backgroundColor: '#475569',
        color: '#94a3b8',
        padding: '0.75rem',
        borderRadius: '4px',
        border: 'none',
        fontSize: '1rem',
        marginTop: '0.5rem',
        cursor: 'not-allowed'
    }
};

export default Login;
