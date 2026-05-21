// Dynamic Environmental Routing Vector for Backend Handshake
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://frank-portfolio-backend-9ok2.onrender.com/api'; 
  // Enforcing strict HTTPS protocol routing to prevent browser Mixed Content blockades

export const apiService = {
  // 1. Fetch all security reports from backend database
  getWriteUps: async () => {
    const response = await fetch(`${BASE_URL}/writeups`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // 2. Destructive administrative privilege call to remove an exploit write-up
  deleteWriteUp: async (id) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${BASE_URL}/writeups/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Unauthorized or Failed operation status: ${response.status}`);
    }
    return await response.json();
  },

  // 3. Clear privileged session tokens upon security termination
  logout: () => {
    localStorage.removeItem('adminToken');
  }
};