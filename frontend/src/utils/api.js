// API service utility for making HTTP requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = null;
    this.user = null;
    
    // Load token and user from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('medcare_token');
      const savedUser = localStorage.getItem('medcare_user');
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (e) {
          console.error('Error parsing saved user:', e);
        }
      }
    }
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    try {
      // Clear any existing authentication data first
      this.clearAuth();
      
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        this.token = response.token;
        this.user = response.user;
        
        // Save to localStorage with error handling
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('medcare_token', this.token);
            localStorage.setItem('medcare_user', JSON.stringify(this.user));
            
            // Clear any browser caches that might interfere
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => {
                  if (name.includes('medcare') || name.includes('localhost')) {
                    caches.delete(name);
                  }
                });
              });
            }
          } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);
          }
        }
      }

      return response;
    } catch (error) {
      this.clearAuth();
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    this.clearAuth();
    
    // Clear all possible cached data
    if (typeof window !== 'undefined') {
      try {
        // Clear localStorage
        localStorage.removeItem('medcare_token');
        localStorage.removeItem('medcare_user');
        localStorage.clear(); // Clear everything to be safe
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear service worker caches
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        // Force reload to clear any remaining state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } catch (error) {
        console.error('Error during logout cleanup:', error);
        // Force reload anyway
        window.location.href = '/';
      }
    }
  }

  clearAuth() {
    this.token = null;
    this.user = null;
  }

  getCurrentUser() {
    // Always try to reload from localStorage in case of inconsistency
    if (typeof window !== 'undefined' && (!this.user || !this.token)) {
      const savedToken = localStorage.getItem('medcare_token');
      const savedUser = localStorage.getItem('medcare_user');
      
      if (savedToken && savedUser) {
        try {
          this.token = savedToken;
          this.user = JSON.parse(savedUser);
        } catch (e) {
          console.error('Error parsing saved user data:', e);
          this.clearAuth();
          localStorage.clear();
        }
      }
    }
    return this.user;
  }

  isAuthenticated() {
    // Double-check authentication state
    const user = this.getCurrentUser();
    const isValid = !!this.token && !!user && user.id && user.role;
    
    // If authentication appears invalid, clear everything
    if (!isValid && typeof window !== 'undefined') {
      this.clearAuth();
      localStorage.clear();
    }
    
    return isValid;
  }

  // Appointments API
  async getAppointments() {
    const params = this.user ? 
      `?role=${this.user.role}&userId=${this.user.id}` : '';
    return this.makeRequest(`/appointments${params}`);
  }

  async createAppointment(appointmentData) {
    return this.makeRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, updateData) {
    return this.makeRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async cancelAppointment(id) {
    return this.makeRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Prescriptions API
  async getPrescriptions() {
    const params = this.user ? 
      `?role=${this.user.role}&userId=${this.user.id}` : '';
    return this.makeRequest(`/prescriptions${params}`);
  }

  async createPrescription(prescriptionData) {
    return this.makeRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }

  // Users API
  async getUsers(role = null) {
    const params = role ? `?role=${role}` : '';
    return this.makeRequest(`/users${params}`);
  }

  async getUser(id) {
    return this.makeRequest(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Dashboard Stats API
  async getDashboardStats() {
    const params = this.user ? 
      `?role=${this.user.role}&userId=${this.user.id}` : '';
    return this.makeRequest(`/dashboard/stats${params}`);
  }

  // Utility methods
  async healthCheck() {
    try {
      const response = await fetch('http://localhost:3001/health');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', message: 'Backend unavailable' };
    }
  }

  // Notifications API
  async getNotifications() {
    const params = this.user ? `?userId=${this.user.id}` : '';
    return this.makeRequest(`/notifications${params}`);
  }

  async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async deleteNotification(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;

// Individual method exports for convenience
export const {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getPrescriptions,
  createPrescription,
  getUsers,
  getUser,
  updateUser,
  getDashboardStats,
  healthCheck,
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} = apiService;
