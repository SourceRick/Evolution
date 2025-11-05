// Accessibility Features

// Toggle accessibility menu
function toggleAccessibilityMenu() {
    const panel = document.getElementById('accessibility-panel');
    panel.classList.toggle('show');
}

// Change font size
function changeFontSize(size) {
    document.body.classList.remove('large-text', 'x-large-text');
    
    switch(size) {
        case 'small':
            // Default size, no class needed
            break;
        case 'large':
            document.body.classList.add('large-text');
            break;
        case 'x-large':
            document.body.classList.add('x-large-text');
            break;
    }
    
    localStorage.setItem('evolution-font-size', size);
}

// Toggle high contrast mode
function toggleHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    
    localStorage.setItem('evolution-high-contrast', enabled);
}

// Toggle readable font
function toggleReadableFont(enabled) {
    if (enabled) {
        document.body.classList.add('readable-font');
    } else {
        document.body.classList.remove('readable-font');
    }
    
    localStorage.setItem('evolution-readable-font', enabled);
}

// Disable animations for reduced motion preference
function disableAnimations() {
    document.body.classList.add('no-animations');
}

// Enable screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement is read
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        disableAnimations();
    }
    
    // Add skip to content functionality
    const skipLink = document.querySelector('.skip-nav');
    if (skipLink) {
        skipLink.addEventListener('click', function() {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
});