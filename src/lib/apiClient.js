// API Client Service Layer
// Centralized API calls for all features
// Backend running on http://localhost:5000

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for API requests
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('supabaseToken') || '';
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ===== TRAILS API =====
export const trailsAPI = {
  // Get all trails with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/trails${params ? '?' + params : ''}`);
  },

  // Get single trail by ID
  getById: async (id) => {
    return apiCall(`/trails/${id}`);
  },

  // Create new trail (admin only)
  create: async (data) => {
    return apiCall('/trails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update trail (admin only)
  update: async (id, data) => {
    return apiCall(`/trails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete trail (admin only)
  delete: async (id) => {
    return apiCall(`/trails/${id}`, { method: 'DELETE' });
  },
};

// ===== USER PROFILE API =====
export const profileAPI = {
  // Get user profile
  getProfile: async (userId) => {
    return apiCall(`/users/${userId}/profile`);
  },

  // Update user profile
  updateProfile: async (userId, data) => {
    return apiCall(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get user's trek history
  getTrekHistory: async (userId) => {
    return apiCall(`/users/${userId}/treks`);
  },

  // Get user's stats
  getStats: async (userId) => {
    return apiCall(`/users/${userId}/stats`);
  },
};

// ===== TRACKING API =====
export const trackingAPI = {
  // Create new tracking session
  createSession: async (trailId, data) => {
    return apiCall('/tracking/sessions', {
      method: 'POST',
      body: JSON.stringify({ trail_id: trailId, ...data }),
    });
  },

  // Update tracking session with location
  updateSession: async (sessionId, data) => {
    return apiCall(`/tracking/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Finish tracking session
  finishSession: async (sessionId, data) => {
    return apiCall(`/tracking/sessions/${sessionId}/finish`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get user's tracking sessions
  getSessions: async (userId) => {
    return apiCall(`/users/${userId}/tracking-sessions`);
  },

  // Get single session details
  getSession: async (sessionId) => {
    return apiCall(`/tracking/sessions/${sessionId}`);
  },

  // Stream location updates (WebSocket alternative)
  subscribeToSession: (sessionId, callback) => {
    // WebSocket subscription logic (optional)
    const ws = new WebSocket(`${API_BASE.replace('http', 'ws')}/tracking/sessions/${sessionId}/stream`);
    ws.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
    return ws;
  },
};

// ===== REVIEWS API =====
export const reviewsAPI = {
  // Get reviews for a trail
  getByTrail: async (trailId) => {
    return apiCall(`/trails/${trailId}/reviews`);
  },

  // Create review
  create: async (trailId, data) => {
    return apiCall(`/trails/${trailId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update review
  update: async (reviewId, data) => {
    return apiCall(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete review
  delete: async (reviewId) => {
    return apiCall(`/reviews/${reviewId}`, { method: 'DELETE' });
  },

  // Rate review (helpful/unhelpful)
  rate: async (reviewId, helpful) => {
    return apiCall(`/reviews/${reviewId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ helpful }),
    });
  },
};

// ===== PHOTO UPLOAD API =====
export const uploadAPI = {
  // Upload photo to trail or review
  uploadPhoto: async (file, targetType = 'trail', targetId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_type', targetType); // 'trail' or 'review'
    formData.append('target_id', targetId);

    return apiCall('/uploads/photo', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('supabaseToken')}` },
      body: formData,
    });
  },

  // Delete photo
  deletePhoto: async (photoId) => {
    return apiCall(`/uploads/${photoId}`, { method: 'DELETE' });
  },
};

// ===== WEATHER API =====
export const weatherAPI = {
  // Get weather for location (lat, lng)
  getWeather: async (lat, lng) => {
    return apiCall(`/weather?lat=${lat}&lng=${lng}`);
  },

  // Get weather forecast for trail location
  getForecast: async (lat, lng, days = 5) => {
    return apiCall(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`);
  },
};

// ===== EMERGENCY SOS API =====
export const sosAPI = {
  // Initiate SOS and share location
  initiateSOS: async (emergencyContacts) => {
    return apiCall('/sos/initiate', {
      method: 'POST',
      body: JSON.stringify({ contacts: emergencyContacts }),
    });
  },

  // Update SOS location (live location sharing)
  updateLocation: async (sosId, lat, lng) => {
    return apiCall(`/sos/${sosId}/location`, {
      method: 'POST',
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });
  },

  // Cancel SOS
  cancelSOS: async (sosId) => {
    return apiCall(`/sos/${sosId}/cancel`, { method: 'POST' });
  },
};

// ===== ADMIN API =====
export const adminAPI = {
  // Get all users (admin)
  getUsers: async () => {
    return apiCall('/admin/users');
  },

  // Get system stats
  getStats: async () => {
    return apiCall('/admin/stats');
  },

  // Moderate reviews (approve/reject/delete)
  moderateReview: async (reviewId, action) => {
    return apiCall(`/admin/reviews/${reviewId}/${action}`, { method: 'POST' });
  },

  // Get trail analytics
  getTrailAnalytics: async (trailId) => {
    return apiCall(`/admin/trails/${trailId}/analytics`);
  },
};

// ===== NOTIFICATIONS API (Optional) =====
export const notificationsAPI = {
  // Get user notifications
  getNotifications: async (userId) => {
    return apiCall(`/users/${userId}/notifications`);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return apiCall(`/notifications/${notificationId}/read`, { method: 'POST' });
  },

  // Subscribe to notifications (WebSocket)
  subscribe: (userId, callback) => {
    const ws = new WebSocket(`${API_BASE.replace('http', 'ws')}/notifications/${userId}`);
    ws.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
    return ws;
  },
};

export default {
  trailsAPI,
  profileAPI,
  trackingAPI,
  reviewsAPI,
  uploadAPI,
  weatherAPI,
  sosAPI,
  adminAPI,
  notificationsAPI,
};
