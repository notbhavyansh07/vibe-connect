// API client that connects to the Express backend (vibe-backend)
// All routes are centralized here so the frontend stays in sync with the backend.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Build auth headers from a JWT access token.
 */
function auth(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generic request helper.
 */
async function request(path, { method = 'GET', body, token } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...auth(token) },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

// ── Auth ──────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
    google: (data) => request('/auth/google', { method: 'POST', body: data }),
    refresh: (refreshToken) => request('/auth/refresh', { method: 'POST', body: { refreshToken } }),
    logout: (token, refreshToken) => request('/auth/logout', { method: 'POST', token, body: { refreshToken } }),
    me: (token) => request('/auth/me', { token }),
  },

  // ── Users ───────────────────────────────────────────────────────
  users: {
    list: (params = {}) => request(`/users?page=${params.page || 1}&limit=${params.limit || 20}`),
    profile: (handle) => request(`/users/${handle}`),
    update: (token, data) => request('/users', { method: 'PUT', body: data, token }),
    follow: (token, followingId) => request('/users/follow', { method: 'POST', body: { followingId }, token }),
    recommended: (token, limit = 10) => request(`/users/recommended?limit=${limit}`, { token }),
    followers: (userId) => request(`/users/${userId}/followers`),
    following: (userId) => request(`/users/${userId}/following`),
    followStatus: (token, userId) => request(`/users/${userId}/follow-status`, { token }),
  },

  // ── Posts ───────────────────────────────────────────────────────
  posts: {
    feed: (params = {}) => request(`/posts?page=${params.page || 1}&limit=${params.limit || 20}&sort=${params.sort || 'newest'}${params.tag ? `&tag=${params.tag}` : ''}`),
    personalized: (token, params = {}) => request(`/posts/personalized?page=${params.page || 1}&limit=${params.limit || 20}`, { token }),
    trending: () => request('/posts/trending'),
    search: (q) => request(`/posts/search?q=${encodeURIComponent(q)}`),
    byId: (id) => request(`/posts/${id}`),
    create: (token, data) => request('/posts', { method: 'POST', body: data, token }),
    delete: (token, postId) => request(`/posts/${postId}`, { method: 'DELETE', token }),
    toggleLike: (token, postId) => request(`/posts/${postId}/like`, { method: 'POST', token }),
    likeStatus: (token, postId) => request(`/posts/${postId}/like`, { token }),
    allLikes: (postId) => request(`/posts/${postId}/likes`),
    addComment: (token, postId, content) => request(`/posts/${postId}/comments`, { method: 'POST', body: { content }, token }),
    getComments: (postId, params = {}) => request(`/posts/${postId}/comments?page=${params.page || 1}&limit=${params.limit || 20}`),
  },

  // ── Chat ────────────────────────────────────────────────────────
  chat: {
    list: (token) => request('/chat', { token }),
    get: (token, chatId, params = {}) => request(`/chat/${chatId}?page=${params.page || 1}&limit=${params.limit || 30}`, { token }),
    create: (token, otherUserId) => request('/chat', { method: 'POST', body: { otherUserId }, token }),
    send: (token, chatId, content) => request('/chat/send', { method: 'POST', body: { chatId, content }, token }),
    markRead: (token, chatId) => request(`/chat/${chatId}/read`, { method: 'POST', token }),
  },

  // ── Vibe Matching ──────────────────────────────────────────────
  vibe: {
    matches: (token, limit = 10) => request(`/vibe/matches?limit=${limit}`, { token }),
    refresh: (token) => request('/vibe/refresh', { method: 'POST', token }),
  },

  // ── Notifications ──────────────────────────────────────────────
  notifications: {
    list: (token, params = {}) => request(`/notifications?page=${params.page || 1}&limit=${params.limit || 20}`, { token }),
    markRead: (token, id) => request(`/notifications/${id}/read`, { method: 'POST', token }),
    markAllRead: (token) => request('/notifications/read-all', { method: 'POST', token }),
    unread: (token) => request('/notifications/unread', { token }),
  },

  // ── AI ──────────────────────────────────────────────────────────
  ai: {
    enhance: (text, style) => request('/ai/enhance', { method: 'POST', body: { text, style } }),
    song: (token) => request('/ai/song', { token }),
    hashtags: () => request('/ai/hashtags'),
    hashtagGen: (text) => request('/ai/hashtags-gen', { method: 'POST', body: { text } }),
    analyzeVoice: (data) => request('/ai/analyze-voice', { method: 'POST', body: data }),
    narrate: (style) => request('/ai/narrate', { method: 'POST', body: { style } }),
  },

  // ── Admin ──────────────────────────────────────────────────────
  admin: {
    dashboard: (token) => request('/admin/dashboard', { token }),
    users: (token, params) => request(`/admin/users?page=${params?.page || 1}&q=${params?.q || ''}`, { token }),
    health: (token) => request('/admin/health', { token }),
    activity: (token) => request('/admin/activity', { token }),
  },
};

// Re-export base URL for non-client use (e.g., socket.io)
export { API_BASE };
