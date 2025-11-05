// Authentication Management - Updated for your backend
class AuthManager {
    constructor() {
        this.tokenKey = 'evolution-token';
        this.userKey = 'evolution-user';
        this.tokenTypeKey = 'evolution-token-type';
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    }
    
    // Get stored token
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    
    // Get token type
    getTokenType() {
        return localStorage.getItem(this.tokenTypeKey) || 'Bearer';
    }
    
    // Get full authorization header
    getAuthHeader() {
        return `${this.getTokenType()} ${this.getToken()}`;
    }
    
    // Store token
    setToken(token, tokenType = 'Bearer') {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.tokenTypeKey, tokenType);
    }
    
    // Store user data
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    
    // Get user data
    getUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }
    
    // Get user role
    getUserRole() {
        const user = this.getUser();
        return user ? user.tipo : null;
    }
    
    // Check if user has specific role
    hasRole(role) {
        const userRole = this.getUserRole();
        return userRole === role;
    }
    
    // Login function - Updated for your backend
    async login(credentials) {
        try {
            const data = await api.login(credentials);
            
            if (data.token) {
                this.setToken(data.token);
                this.setUser(data.user || data.usuario);
                
                // Show success message
                this.showLoginSuccess(data.user || data.usuario);
                
                return data;
            } else {
                throw new Error('Token não recebido do servidor');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError(error.message);
            throw error;
        }
    }
    
    // Register function
    async register(userData) {
        try {
            const data = await api.register(userData);
            
            if (data.token) {
                this.setToken(data.token);
                this.setUser(data.user || data.usuario);
                return data;
            } else {
                // If no token, just return success
                return data;
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showRegistrationError(error.message);
            throw error;
        }
    }
    
    // Logout function
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenTypeKey);
        
        // Redirect to login page
        window.location.href = '/pages/login.html';
    }
    
    // Check authentication status
    checkAuth() {
        if (!this.isLoggedIn()) {
            this.redirectToLogin();
        }
    }
    
    // Redirect to login
    redirectToLogin() {
        window.location.href = '/pages/login.html';
    }
    
    // Show login success message
    showLoginSuccess(user) {
        const userName = user.nome || user.username || 'Usuário';
        this.showNotification(`Bem-vindo(a) de volta, ${userName}!`, 'success');
    }
    
    // Show login error message
    showLoginError(message) {
        this.showNotification(message || 'Erro no login. Verifique suas credenciais.', 'error');
    }
    
    // Show registration error message
    showRegistrationError(message) {
        this.showNotification(message || 'Erro no cadastro. Tente novamente.', 'error');
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-left: 4px solid #2563eb;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                
                .notification-success { border-left-color: #10b981; }
                .notification-error { border-left-color: #ef4444; }
                .notification-warning { border-left-color: #f59e0b; }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    position: absolute;
                    top: 8px;
                    right: 8px;
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Get notification icon based on type
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize auth manager
const auth = new AuthManager();
window.auth = auth;