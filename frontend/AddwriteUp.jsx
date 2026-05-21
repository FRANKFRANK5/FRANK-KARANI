import React, { useState } from 'react';
import { apiService } from './apiService';

const AddWriteUp = ({ onWriteUpAdded }) => {
    // Form input states
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(''); 
    const [platform, setPlatform] = useState(''); 
    const [difficulty, setDifficulty] = useState(''); 
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    
    // System handling states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const blogCategories = [
        "CTF Write-up",
        "Penetration Testing Report",
        "Bug Bounty Write-up",
        "Malware Analysis",
        "Active Directory Lab",
        "Tool Tutorial & Guide",
        "General Cybersecurity Article"
    ];

    const platforms = ["TryHackMe", "HackTheBox", "PortSwigger Web Academy", "VulnHub", "PicoCTF", "Other / Not Applicable"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!title.trim() || !category || !summary.trim() || !content.trim()) {
            setError('Please fill out all required fields (Title, Category, Summary, and Content).');
            setLoading(false);
            return;
        }

        try {
            const formattedCategory = platform && difficulty && platform !== "Other / Not Applicable"
                ? `${category} (${platform} - ${difficulty})`
                : category;

            const postData = { title, category: formattedCategory, summary, content };
            
            // Tuma ombi ukitumia apiService
            await apiService.addWriteUp(postData);

            setSuccess('Your write-up has been published successfully congratulation!!!');
            
            setTitle('');
            setCategory('');
            setPlatform('');
            setDifficulty('');
            setSummary('');
            setContent('');

            if (onWriteUpAdded) onWriteUpAdded();

        } catch (err) {
            setError(err.message || 'An error occurred while publishing the write-up cheak it up so sorry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>Publish New Cybersecurity Write-up</h3>
            
            {error && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Write-up Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        placeholder="e.g., HackTheBox - BountyHunter Machine Writeup"
                        disabled={loading}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.row}>
                    <div style={{...styles.inputGroup, flex: 1, marginRight: '10px', minWidth: '200px'}}>
                        <label style={styles.label}>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading} style={styles.input} required>
                            <option value="">-- Select Type --</option>
                            {blogCategories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{...styles.inputGroup, flex: 1, marginRight: '10px', minWidth: '200px'}}>
                        <label style={styles.label}>Platform:</label>
                        <select value={platform} onChange={(e) => setPlatform(e.target.value)} disabled={loading} style={styles.input}>
                            <option value="">-- Select Platform (Optional) --</option>
                            {platforms.map((plat, index) => (
                                <option key={index} value={plat}>{plat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{...styles.inputGroup, flex: 1, minWidth: '150px'}}>
                        <label style={styles.label}>Difficulty:</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading} style={styles.input}>
                            <option value="">-- Level (Optional) --</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Insane">Insane</option>
                        </select>
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Brief Summary:</label>
                    <input 
                        type="text" 
                        value={summary} 
                        onChange={(e) => setSummary(e.target.value)}
                        maxLength={300}
                        placeholder="Short snippet covering main vulnerabilities (Max 300 characters)"
                        disabled={loading}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Write-up Details (Steps / Proof of Concept):</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Document your methodology. Include Nmap output, shell commands, etc..."
                        disabled={loading}
                        rows={12}
                        style={styles.textarea}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
                    {loading ? 'Publishing...' : 'Publish to Portfolio'}
                </button>
            </form>
        </div>
    );
};

// MAREKEBISHO: Mitindo ya muonekano iliyokamilika na kusawazishwa
const styles = {
    card: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '800px', margin: '2rem auto', color: '#f8fafc', boxSizing: 'border-box' },
    cardTitle: { fontSize: '1.4rem', color: '#38bdf8', marginBottom: '1.5rem', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column' },
    row: { display: 'flex', flexWrap: 'wrap', marginBottom: '0.5rem' },
    inputGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' },
    input: { width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#38bdf8', fontSize: '0.95rem', fontFamily: 'Courier New, monospace', outline: 'none', boxSizing: 'border-box', resize: 'vertical' },
    button: { backgroundColor: '#0284c7', color: '#fff', padding: '0.75rem', borderRadius: '4px', border: 'none', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', marginTop: '0.5rem' },
    buttonDisabled: { backgroundColor: '#475569', color: '#94a3b8', padding: '0.75rem', borderRadius: '4px', border: 'none', fontSize: '1rem', marginTop: '0.5rem', cursor: 'not-allowed' },
    errorBox: { backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #b91c1c', textAlign: 'center' },
    successBox: { backgroundColor: '#064e3b', color: '#a7f3d0', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #047857', textAlign: 'center' }
};

export default AddWriteUp;
