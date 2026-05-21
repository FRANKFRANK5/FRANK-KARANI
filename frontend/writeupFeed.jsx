import React, { useState, useEffect } from 'react';
import { apiService } from './apiService';

// Component declaration inayopokea isAdmin prop
const WriteUpFeed = ({ isAdmin }) => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch data kutoka kwenye API component inapoload
    useEffect(() => {
        let isMounted = true; 
        const fetchPosts = async () => {
            try {
                const data = await apiService.getWriteUps();
                if (isMounted) {
                    setPosts(data);
                    setFilteredPosts(data);
                }
            } catch (err) {
                if (isMounted) setError(err.message || 'Failed to load write-ups.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchPosts();
        return () => { isMounted = false; };
    }, []);

    // Kushughulikia Live Search na Category Filtering kwa pamoja
    useEffect(() => {
        let results = posts;

        if (selectedCategory) {
            results = results.filter(post => post.category.includes(selectedCategory));
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            results = results.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.summary.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query)
            );
        }

        setFilteredPosts(results);
    }, [searchQuery, selectedCategory, posts]);

    // Handle delete ikiwa imesafisha state zote mbili vizuri
    const handleDeletePost = async (id) => {
        if (!window.confirm("🔴 ALERT: Confirm destruction of this security report?")) return;
        try {
            await apiService.deleteWriteUp(id);
            setPosts(prev => prev.filter(p => p._id !== id));
            setFilteredPosts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert(`⚠️ Error: ${err.message}`);
        }
    };

    const rawCategories = [
        "CTF Write-up", 
        "Penetration Testing Report", 
        "Bug Bounty Write-up", 
        "Malware Analysis", 
        "Active Directory Lab", 
        "Tool Tutorial & Guide", 
        "General Cybersecurity Article"
    ];

    if (loading) return <div style={styles.centerText}>[+] Loading secure write-ups feed...</div>;
    if (error) return <div style={styles.errorText}>[!] SYSTEM ERROR: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.feedTitle}>Cybersecurity Labs & CTF Write-ups</h2>
            <p style={styles.subtitle}>Documenting my penetration testing methodologies, machine exploits, and threat analysis.</p>

            {/* Filter and Search Bar Section */}
            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Search by machine, CVE, exploit..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchFields}
                />
                
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={styles.searchFields}
                >
                    <option value="">All Categories</option>
                    {rawCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Grid Layout of Cards */}
            {filteredPosts.length === 0 ? (
                <div style={styles.centerText}>[-] No write-ups found matching your query.</div>
            ) : (
                <div style={styles.grid}>
                    {filteredPosts.map((post) => (
                        <div key={post._id} style={styles.card}>
                            
                            {/* Dynamic header yenye Admin Delete button */}
                            <div style={styles.cardHeader}>
                                <span style={styles.badge}>{post.category}</span>
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDeletePost(post._id)} 
                                        style={styles.deleteBtn}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#7f1d1d'}
                                    >
                                        Delete 🗑️
                                    </button>
                                )}
                            </div>

                            <h3 style={styles.cardTitle}>{post.title}</h3>
                            <p style={styles.date}>
                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p style={styles.summary}>{post.summary}</p>
                            
                            {/* Expandable Content Container - Custom Terminal Style */}
                            <details style={styles.detailsDropdown}>
                                <summary style={styles.summaryBtn}>
                                    <span style={{ color: '#10b981', marginRight: '6px' }}>#</span> Read Full Proof of Concept (PoC)
                                </summary>
                                <div style={styles.fullContent}>
                                    <pre style={styles.codeBlock}>{post.content}</pre>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Cyber Terminal style theme styles
const styles = {
    container: { padding: '2rem max(2vw, 20px)', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', boxSizing: 'border-box' },
    feedTitle: { textAlign: 'center', fontSize: '2rem', color: '#38bdf8', marginBottom: '0.5rem', fontFamily: 'monospace' },
    subtitle: { textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1rem' },
    filterBar: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' },
    searchFields: { padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', outline: 'none', fontSize: '0.95rem', minWidth: '250px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)', position: 'relative', display: 'flex', flexDirection: 'column' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.75rem' },
    badge: { backgroundColor: '#0284c7', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.6rem', borderRadius: '12px' },
    deleteBtn: { backgroundColor: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'background 0.2s ease-in-out' },
    cardTitle: { fontSize: '1.25rem', color: '#38bdf8', margin: '0 0 0.5rem 0', fontFamily: 'monospace' },
    date: { fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' },
    summary: { fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: '1' },
    detailsDropdown: { marginTop: 'auto', border: '1px solid #334155', borderRadius: '4px', backgroundColor: '#0f172a', overflow: 'hidden' },
    summaryBtn: { padding: '0.75rem', color: '#10b981', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', userSelect: 'none' },
    fullContent: { padding: '1rem', borderTop: '1px solid #334155', backgroundColor: '#090d16', maxHeight: '350px', overflowY: 'auto' }, // Imerudishwa hapa kuzuia kadi kurefuka kupita kiasi
    codeBlock: { margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a7f3d0' }, // Imerudishwa kuwa break-word
    centerText: { textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem', fontFamily: 'monospace', padding: '3rem' },
    errorText: { textAlign: 'center', color: '#ef4444', fontSize: '1.1rem', fontFamily: 'monospace', padding: '3rem' }
};

export default WriteUpFeed;