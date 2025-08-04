// API service that connects to your backend

class ApiService {
  constructor() {
    // Allow configuring the backend URL via environment variable
    const envBase = import.meta?.env?.VITE_API_URL || '';
    this.baseURL = envBase.replace(/\/$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  }
  // Chat session methods
  async startChatSession() {
    return this.request('/api/chat/start-session', {
      method: 'POST',
    });
  }

  async endChatSession() {
    return this.request('/api/chat/end-session', {
      method: 'POST',
    });
  }

  async getSessionStatus() {
    return this.request('/api/chat/session-status');
  }

  // Chat messaging methods
  async sendMessage(message) {
    return this.request('/api/chat/send-message', {
      method: 'POST',
      body: { message },
    });
  }

  async getMessages() {
    return this.request('/api/chat/get-messages');
  }

  // Reconnection methods
  async requestReconnect(targetUserId) {
    return this.request('/api/chat/request-reconnect', {
      method: 'POST',
      body: { target_user_id: targetUserId },
    });
  }

  async respondToReconnect(requestId, response) {
    return this.request('/api/chat/respond-reconnect', {
      method: 'POST',
      body: { request_id: requestId, response },
    });
  }

  async getReconnectRequests() {
    return this.request('/api/chat/get-reconnect-requests');
  }

  // Met users methods
  async getMetUsers() {
    return this.request('/api/chat/met-users');
  }

  async startDirectChat(targetUserId) {
    return this.request('/api/chat/start-direct-chat', {
      method: 'POST',
      body: { target_user_id: targetUserId },
    });
  }

  // Reporting methods
  async reportUser(reportData) {
    return this.request('/api/chat/report', {
      method: 'POST',
      body: reportData,
    });
  }

  async reportProblem(data) {
    return this.request('/api/chat/report-problem', {
      method: 'POST',
      body: data,
    });
  }

  // Contact methods
  async contactUs(data) {
    return this.request('/api/chat/contact-us', {
      method: 'POST',
      body: data,
    });
  }

  // Statistics methods
  async getChatStats() {
    return this.request('/api/chat/stats');
  }

  // Upload methods
  async uploadAvatar(formData) {
    return this.request('/api/upload/upload-avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Admin methods (if user has admin privileges)
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async banUser(userId, reason) {
    return this.request(`/api/admin/users/${userId}/ban`, {
      method: 'POST',
      body: { reason },
    });
  }

  async unbanUser(userId) {
    return this.request(`/api/admin/users/${userId}/unban`, {
      method: 'POST',
    });
  }

  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/reports${queryString ? `?${queryString}` : ''}`);
  }

  async reviewReport(reportId, action, notes = '', banUser = false) {
    return this.request(`/api/admin/reports/${reportId}/review`, {
      method: 'POST',
      body: { action, notes, ban_user: banUser },
    });
  }

  async getSystemSettings() {
    return this.request('/api/admin/system-settings');
  }

  async updateSystemSettings(settings) {
    return this.request('/api/admin/system-settings', {
      method: 'PUT',
      body: settings,
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

