import React, { useState, useEffect } from 'react';
import { apiService } from './apiService';

// 1. Updated component declaration to accept the isAdmin prop
const WriteUpFeed = ({ isAdmin }) => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch public data on component load
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await apiService.getWriteUps();
                setPosts(data);
                setFilteredPosts(data);
            } catch (err) {
                setError(err.message || 'Failed to load write-ups.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Handle Live Search and Category Filtering combined
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

    // 2. Added internal delete handler with state cleanup
    const handleDeletePost = async (id) => {
        if (!window.confirm("Confirm destruction of this security report?")) return;
        try {
            await apiService.deleteWriteUp(id);
            // Instantly clear the deleted post from UI states
            setPosts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const rawCategories = ["CTF Write-up", "Penetration Testing Report", "Bug Bounty Write-up", "Malware Analysis", "Active Directory Lab", "Tool Tutorial & Guide", "General Cybersecurity Article"];

    if (loading) return <div style={styles.centerText}>Loading secure write-ups feed...</div>;
    if (error) return <div style={styles.errorText}>{error}</div>;

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
                    {rawCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Grid Layout of Cards */}
            {filteredPosts.length === 0 ? (
                <div style={styles.centerText}>No write-ups found matching your query.</div>
            ) : (
                <div style={styles.grid}>
                    {filteredPosts.map((post) => (
                        <div key={post._id} style={styles.card}>
                            
                            {/* 3. Updated dynamic container featuring the Admin Delete button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.75rem' }}>
                                <span style={styles.badge}>{post.category}</span>
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDeletePost(post._id)} 
                                        style={styles.deleteBtn}
                                    >
                                        Delete 🗑️
                                    </button>
                                )}
                            </div>

                            <h3 style={styles.cardTitle}>{post.title}</h3>
                            <p style={styles.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p style={styles.summary}>{post.summary}</p>
                            
                            {/* Expandable Content Container */}
                            <details style={styles.detailsDropdown}>
                                <summary style={styles.summaryBtn}>Read Full Proof of Concept (PoC)</summary>
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
    feedTitle: { textAlign: 'center', fontSize: '2rem', color: '#38bdf8', marginBottom: '0.5rem' },
    subtitle: { textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1rem' },
    filterBar: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' },
    searchFields: { padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', outline: 'none', fontSize: '0.95rem', minWidth: '250px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)', position: 'relative', display: 'flex', flexDirection: 'column' },
    badge: { backgroundColor: '#0284c7', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.6rem', borderRadius: '12px' },
    deleteBtn: { backgroundColor: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'background 0.2s' },
    cardTitle: { fontSize: '1.25rem', color: '#38bdf8', margin: '0 0 0.5rem 0' },
    date: { fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' },
    summary: { fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: '1' },
    detailsDropdown: { borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: 'auto' },
    summaryBtn: { cursor: 'pointer', color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none', userSelect: 'none' },
    fullContent: { marginTop: '1rem', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '4px', border: '1px solid #334155', maxHeight: '400px', overflowY: 'auto' },
    codeBlock: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.9rem', color: '#a7f3d0', margin: 0 },
    centerText: { textAlign: 'center', color: '#94a3b8', marginTop: '3rem', fontSize: '1.2rem', fontFamily: 'monospace' },
    errorText: { textAlign: 'center', color: '#fca5a5', backgroundColor: '#7f1d1d', padding: '1rem', maxWidth: '500px', margin: '3rem auto', borderRadius: '4px', border: '1px solid #b91c1c' }
};

export default WriteUpFeed;
