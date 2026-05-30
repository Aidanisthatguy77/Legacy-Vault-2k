const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://legacy-vault-api.onrender.com';

export const api = {
  // Games
  getGames: () => fetch(`${API_BASE_URL}/api/games`).then(r => r.json()),
  getGame: (id) => fetch(`${API_BASE_URL}/api/games/${id}`).then(r => r.json()),
  createGame: (data) => fetch(`${API_BASE_URL}/api/games`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  updateGame: (id, data) => fetch(`${API_BASE_URL}/api/games/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteGame: (id) => fetch(`${API_BASE_URL}/api/games/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Clips
  getClips: (gameId) => fetch(`${API_BASE_URL}/api/clips${gameId ? `?game_id=${gameId}` : ''}`).then(r => r.json()),
  createClip: (data) => fetch(`${API_BASE_URL}/api/clips`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  updateClip: (id, data) => fetch(`${API_BASE_URL}/api/clips/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteClip: (id) => fetch(`${API_BASE_URL}/api/clips/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Proofs
  getProofs: () => fetch(`${API_BASE_URL}/api/proofs`).then(r => r.json()),
  createProof: (data) => fetch(`${API_BASE_URL}/api/proofs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteProof: (id) => fetch(`${API_BASE_URL}/api/proofs/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Mockups
  getMockups: () => fetch(`${API_BASE_URL}/api/mockups`).then(r => r.json()),
  createMockup: (data) => fetch(`${API_BASE_URL}/api/mockups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteMockup: (id) => fetch(`${API_BASE_URL}/api/mockups/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Community Wall
  getCommunityPosts: () => fetch(`${API_BASE_URL}/api/community-wall`).then(r => r.json()),
  createCommunityPost: (data) => fetch(`${API_BASE_URL}/api/community-wall`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteCommunityPost: (id) => fetch(`${API_BASE_URL}/api/community-wall/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Live Feed
  getSocialFeed: () => fetch(`${API_BASE_URL}/api/live-feed`).then(r => r.json()),
  createSocialFeedItem: (data) => fetch(`${API_BASE_URL}/api/live-feed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteSocialFeedItem: (id) => fetch(`${API_BASE_URL}/api/live-feed/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Submissions
  getSubmissions: () => fetch(`${API_BASE_URL}/api/submissions`).then(r => r.json()),
  createSubmission: (data) => fetch(`${API_BASE_URL}/api/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  approveSubmission: (id) => fetch(`${API_BASE_URL}/api/submissions/${id}/approve`, { method: 'PUT' }).then(r => r.json()),
  rejectSubmission: (id) => fetch(`${API_BASE_URL}/api/submissions/${id}/reject`, { method: 'PUT' }).then(r => r.json()),
  
  // Content
  getContent: () => fetch(`${API_BASE_URL}/api/content`).then(r => r.json()),
  updateContent: (key, value) => fetch(`${API_BASE_URL}/api/content/${key}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value }) }).then(r => r.json()),
  
  // Comments
  getComments: (gameId) => fetch(`${API_BASE_URL}/api/comments${gameId ? `?game_id=${gameId}` : ''}`).then(r => r.json()),
  createComment: (data) => fetch(`${API_BASE_URL}/api/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  likeComment: (id) => fetch(`${API_BASE_URL}/api/comments/${id}/like`, { method: 'PUT' }).then(r => r.json()),
  replyToComment: (id, data) => fetch(`${API_BASE_URL}/api/comments/${id}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteComment: (id) => fetch(`${API_BASE_URL}/api/comments/${id}`, { method: 'DELETE' }).then(r => r.json()),
  
  // Subscribers
  getSubscribers: () => fetch(`${API_BASE_URL}/api/subscribers`).then(r => r.json()),
  subscribe: (email) => fetch(`${API_BASE_URL}/api/subscribers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).then(r => r.json()),
  unsubscribe: (id) => fetch(`${API_BASE_URL}/api/subscribers/${id}`, { method: 'DELETE' }).then(r => r.json()),
  exportEmailsCsv: () => `${API_BASE_URL}/api/admin/export/emails/csv`,
  
  // Petition
  getPetition: () => fetch(`${API_BASE_URL}/api/petition`).then(r => r.json()),
  signPetition: (name) => fetch(`${API_BASE_URL}/api/petition/sign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }).then(r => r.json()),
  bulkAddSignatures: (names) => fetch(`${API_BASE_URL}/api/petition/bulk-add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(names) }).then(r => r.json()),
  
  // Votes
  getVotes: () => fetch(`${API_BASE_URL}/api/votes`).then(r => r.json()),
  castVote: (gameId) => fetch(`${API_BASE_URL}/api/votes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game_id: gameId }) }).then(r => r.json()),
  
  // Vault AI Chat
  chat: (sessionId, message) => fetch(`${API_BASE_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId, message }) }).then(r => r.json()),
  
  // Vault Guide
  getVaultGuide: (query) => fetch(`${API_BASE_URL}/api/vault-guide?query=${encodeURIComponent(query)}`).then(r => r.json()),
  
  // Admin
  adminLogin: (password) => fetch(`${API_BASE_URL}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }).then(r => r.json()),
  
  // Health
  health: () => fetch(`${API_BASE_URL}/api/health`).then(r => r.json()),
};

export default api;