// Dynamic Environmental Routing Vector for Backend Handshake
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://frank-portfolio-backend-9ok2.onrender.com/api'; // 👈 HAKIKISHA HII NI URL YA BACKEND YAKO YA RENDER!

export const apiService = {
  // Fetch all security reports
  getWriteUps: async () => {
    const response = await fetch(`${BASE_URL}/writeups`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  },

  // Administrative report deletion
  deleteWriteUp: async (id) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${BASE_URL}/writeups/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Failed operation status: ${response.status}`);
    return await response.json();
  },

  // Administrative login sequence
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Invalid administrative credentials.');
    const data = await response.json();
    if (data.token) localStorage.setItem('adminToken', data.token);
    return data;
  },

  // Clear privileged session tokens
  logout: () => {
    localStorage.removeItem('adminToken');
  }
};