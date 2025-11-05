// Main JavaScript File

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
});

// Initialize Application
function initializeApp() {
    console.log('Evolution Platform Initialized');
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('evolution-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Check for accessibility preferences
    const highContrast = localStorage.getItem('evolution-high-contrast') === 'true';
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    const readableFont = localStorage.getItem('evolution-readable-font') === 'true';
    if (readableFont) {
        document.body.classList.add('readable-font');
    }
    
    // Set font size
    const fontSize = localStorage.getItem('evolution-font-size') || 'medium';
    changeFontSize(fontSize);
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const isExpanded = navLinks.style.display === 'flex';
    
    if (isExpanded) {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-primary)';
        navLinks.style.borderTop = '1px solid var(--border-color)';
        navLinks.style.padding = 'var(--spacing-lg)';
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Tab key adds keyboard navigation class
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // Escape key closes modals and menus
    if (e.key === 'Escape') {
        closeAllMenus();
    }
}

// Close all menus
function closeAllMenus() {
    const accessibilityPanel = document.getElementById('accessibility-panel');
    if (accessibilityPanel) {
        accessibilityPanel.classList.remove('show');
    }
    
    const navLinks = document.getElementById('nav-links');
    if (navLinks && window.innerWidth <= 768) {
        navLinks.style.display = 'none';
    }
}

// Load user preferences
function loadUserPreferences() {
    // Theme
    const theme = localStorage.getItem('evolution-theme') || 'light';
    setTheme(theme);
    
    // Font size
    const fontSize = localStorage.getItem('evolution-font-size') || 'medium';
    document.getElementById('font-size').value = fontSize;
    changeFontSize(fontSize);
    
    // High contrast
    const highContrast = localStorage.getItem('evolution-high-contrast') === 'true';
    document.getElementById('high-contrast').checked = highContrast;
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    // Readable font
    const readableFont = localStorage.getItem('evolution-readable-font') === 'true';
    document.getElementById('readable-font').checked = readableFont;
    if (readableFont) {
        document.body.classList.add('readable-font');
    }
}

// Utility function to debounce rapid calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules
window.Evolution = {
    initializeApp,
    toggleMobileMenu,
    setTheme,
    changeFontSize,
    toggleHighContrast,
    toggleReadableFont
};