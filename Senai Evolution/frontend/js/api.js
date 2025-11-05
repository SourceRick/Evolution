// API Communication - Updated for your backend
class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3001/api'; // Sua porta 3001
        this.auth = window.auth;
    }
    
    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add auth token if available
        const token = this.auth.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                this.auth.logout();
                throw new Error('Sessão expirada');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            // Check if response has content
            const contentLength = response.headers.get('content-length');
            if (contentLength === '0') {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // ========== AUTH ENDPOINTS ==========
    async login(credentials) {
        return this.post('/auth/login', credentials);
    }
    
    async register(userData) {
        return this.post('/auth/register', userData);
    }
    
    async getProfile() {
        return this.get('/auth/profile');
    }
    
    async updateProfile(profileData) {
        return this.put('/auth/profile', profileData);
    }
    
    // ========== USER ENDPOINTS ==========
    async getUsers() {
        return this.get('/users');
    }
    
    async getUserById(id) {
        return this.get(`/users/${id}`);
    }
    
    async updateUser(id, userData) {
        return this.put(`/users/${id}`, userData);
    }
    
    // ========== POSTS ENDPOINTS ==========
    async getPosts(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.get(`/posts${queryParams ? `?${queryParams}` : ''}`);
    }
    
    async createPost(postData) {
        return this.post('/posts', postData);
    }
    
    async getPostById(id) {
        return this.get(`/posts/${id}`);
    }
    
    async updatePost(id, postData) {
        return this.put(`/posts/${id}`, postData);
    }
    
    async deletePost(id) {
        return this.delete(`/posts/${id}`);
    }
    
    // ========== COMMENTS ENDPOINTS ==========
    async getComments(postId) {
        return this.get(`/posts/${postId}/comments`);
    }
    
    async createComment(postId, commentData) {
        return this.post(`/posts/${postId}/comments`, commentData);
    }
    
    async deleteComment(commentId) {
        return this.delete(`/comments/${commentId}`);
    }
    
    // ========== ACTIVITIES ENDPOINTS ==========
    async getActivities() {
        return this.get('/activities');
    }
    
    async createActivity(activityData) {
        return this.post('/activities', activityData);
    }
    
    async getActivityById(id) {
        return this.get(`/activities/${id}`);
    }
    
    async submitWork(activityId, workData) {
        return this.post(`/activities/${activityId}/submit`, workData);
    }
    
    // ========== GRADES ENDPOINTS ==========
    async getGrades() {
        return this.get('/grades');
    }
    
    async getGradeById(id) {
        return this.get(`/grades/${id}`);
    }
    
    // ========== SCHEDULE ENDPOINTS ==========
    async getSchedule() {
        return this.get('/schedule');
    }
    
    async createSchedule(scheduleData) {
        return this.post('/schedule', scheduleData);
    }
    
    // ========== NOTIFICATIONS ENDPOINTS ==========
    async getNotifications() {
        return this.get('/notifications');
    }
    
    async markNotificationAsRead(id) {
        return this.put(`/notifications/${id}/read`);
    }
    
    async markAllNotificationsAsRead() {
        return this.put('/notifications/read-all');
    }
}

// Initialize API client
const api = new ApiClient();
window.api = api;