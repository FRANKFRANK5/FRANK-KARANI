// apiService.js
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Mbinu ya usaidizi wa ndani kupata Token ya Admin kutoka localStorage
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiService = {
    // ==================== 1. MIFUMO YA UTAMBULISHO (AUTH) ====================
    
    /**
     * Kuingia kwenye mfumo (Login) kama Admin na kutunza Token
     */
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        
        // Tunza token kwenye kivinjari (browser storage) ikifanikiwa
        if (data.token) {
            localStorage.setItem('adminToken', data.token);
        }
        return data;
    },

    /**
     * Toka kwenye mfumo (Logout) - Kufuta token
     */
    logout() {
        localStorage.removeItem('adminToken');
    },

    // ==================== 2. MIFUMO YA VYETI (CERTIFICATIONS) ====================

    /**
     * Kupata vyeti vyote (Public Route)
     */
    async getCertifications() {
        const response = await fetch(`${API_BASE_URL}/certifications`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch certifications');
        return data;
    },

    /**
     * Kuongeza cheti kipya (Protected Route - Admin Only)
     */
    async addCertification(certData) {
        const response = await fetch(`${API_BASE_URL}/certifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders() // Inajumuisha Token hapa kiotomatiki
            },
            body: JSON.stringify(certData) // data ikiwa ni { title, issuer, meta }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to save certificate');
        return data;
    },

    /**
     * Kufuta cheti (Protected Route - Admin Only)
     */
    async deleteCertification(id) {
        const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete certificate');
        return data;
    },

    // ==================== 3. MIFUMO YA BLOG (OWASP WRITE-UPS) ====================

    /**
     * Kupata makala zote za blogu (Public Route)
     */
    async getWriteUps() {
        const response = await fetch(`${API_BASE_URL}/writeups`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch write-ups');
        return data;
    },

    /**
     * Kuchapisha makala mpya (Protected Route - Admin Only)
     */
    async addWriteUp(postData) {
        const response = await fetch(`${API_BASE_URL}/writeups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(postData) // data ikiwa ni { title, category, summary, content }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to publish write-up');
        return data;
    },

    /**
     * Kufuta makala ya blogu (Protected Route - Admin Only)
     */
    async deleteWriteUp(id) {
        const response = await fetch(`${API_BASE_URL}/writeups/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete write-up');
        return data;
    }
};
