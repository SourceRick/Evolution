// Dashboard functionality
class Dashboard {
    constructor() {
        this.user = null;
        this.activities = [];
        this.posts = [];
        this.notifications = [];
    }
    
    async init() {
        try {
            // Check authentication
            auth.checkAuth();
            
            // Load user data
            await this.loadUserData();
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Setup event listeners
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            auth.redirectToLogin();
        }
    }
    
    async loadUserData() {
        try {
            const userData = await api.getProfile();
            this.user = userData;
            this.updateUserInterface();
        } catch (error) {
            console.error('Error loading user data:', error);
            // Use stored user data as fallback
            this.user = auth.getUser();
            this.updateUserInterface();
        }
    }
    
    async loadDashboardData() {
        try {
            // Load activities
            await this.loadActivities();
            
            // Load posts
            await this.loadPosts();
            
            // Load notifications
            await this.loadNotifications();
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    async loadActivities() {
        try {
            this.activities = await api.getActivities();
            this.renderActivities();
        } catch (error) {
            console.error('Error loading activities:', error);
            this.showError('activities-list', 'Erro ao carregar atividades');
        }
    }
    
    async loadPosts() {
        try {
            const filters = { limit: 5, order: 'desc' };
            this.posts = await api.getPosts(filters);
            this.renderPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('feed-list', 'Erro ao carregar feed');
        }
    }
    
    async loadNotifications() {
        try {
            this.notifications = await api.getNotifications();
            this.updateNotificationCount();
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    updateUserInterface() {
        // Update welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        const userName = this.user?.nome || this.user?.username || 'Estudante';
        welcomeMessage.textContent = `Olá, ${userName}!`;
        
        // Update user menu
        const userNameElement = document.getElementById('user-name');
        userNameElement.textContent = userName;
    }
    
    updateStats() {
        // Pending activities
        const pendingActivities = this.activities.filter(activity => 
            activity.status === 'pending' || !activity.entregue
        ).length;
        document.getElementById('pending-activities').textContent = pendingActivities;
        
        // Completed activities
        const completedActivities = this.activities.filter(activity => 
            activity.status === 'completed' || activity.entregue
        ).length;
        document.getElementById('completed-activities').textContent = completedActivities;
        
        // Unread notifications
        const unreadNotifications = this.notifications.filter(notification => 
            !notification.lida
        ).length;
        document.getElementById('unread-notifications').textContent = unreadNotifications;
        
        // Today events (placeholder)
        document.getElementById('today-events').textContent = '0';
    }
    
    renderActivities() {
        const container = document.getElementById('activities-list');
        
        if (!this.activities || this.activities.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhuma atividade pendente</div>';
            return;
        }
        
        const activitiesHtml = this.activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.tipo)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.titulo}</h4>
                    <p>Entrega: ${this.formatDate(activity.data_entrega)}</p>
                    <span class="activity-status ${activity.status}">
                        ${this.getStatusText(activity.status)}
                    </span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = activitiesHtml;
    }
    
    renderPosts() {
        const container = document.getElementById('feed-list');
        
        if (!this.posts || this.posts.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhuma postagem recente</div>';
            return;
        }
        
        const postsHtml = this.posts.slice(0, 5).map(post => `
            <div class="post-item">
                <div class="post-author">
                    <div class="author-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="author-info">
                        <strong>${post.autor?.nome || 'Usuário'}</strong>
                        <span>${this.formatTimeAgo(post.criado_em)}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.conteudo}</p>
                </div>
                <div class="post-actions">
                    <button class="post-action">
                        <i class="fas fa-thumbs-up"></i> ${post.reacoes || 0}
                    </button>
                    <button class="post-action">
                        <i class="fas fa-comment"></i> ${post.comentarios || 0}
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = postsHtml;
    }
    
    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.lida).length;
        // Update notification badge in header
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    getActivityIcon(type) {
        const icons = {
            'Trabalho': 'file-alt',
            'Prova': 'file-signature',
            'Exercicio': 'edit',
            'Projeto': 'project-diagram',
            'Apresentacao': 'presentation'
        };
        return icons[type] || 'tasks';
    }
    
    getStatusText(status) {
        const statusText = {
            'pending': 'Pendente',
            'completed': 'Entregue',
            'late': 'Atrasado',
            'graded': 'Avaliado'
        };
        return statusText[status] || 'Pendente';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins} min atrás`;
        } else if (diffHours < 24) {
            return `${diffHours} h atrás`;
        } else {
            return `${diffDays} dias atrás`;
        }
    }
    
    showError(containerId, message) {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div class="error-state">${message}</div>`;
    }
    
    setupEventListeners() {
        // User menu toggle
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    dashboard.init();
});