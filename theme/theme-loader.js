// theme-loader.js
// This file contains shared loader and theme functionality for all pages

// Theme functionality
class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.themeIcon = null;
        this.init();
    }

    init() {
        this.createThemeToggle();
        this.loadTheme();
        this.setupEventListeners();
    }

    createThemeToggle() {
        // Create theme toggle button if it doesn't exist
        if (!document.getElementById('themeToggleHeader')) {
            const headerContainer = document.querySelector('.header-container, .user-info, .navbar');
            if (headerContainer) {
                const themeToggle = document.createElement('button');
                themeToggle.id = 'themeToggleHeader';
                themeToggle.className = 'theme-toggle-header';
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
                
                const userInfo = document.querySelector('.user-info') || headerContainer;
                userInfo.appendChild(themeToggle);
            }
        }
        
        this.themeToggle = document.getElementById('themeToggleHeader');
        this.themeIcon = this.themeToggle?.querySelector('i');
    }

    loadTheme() {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply theme
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (this.themeIcon) this.themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            if (this.themeIcon) this.themeIcon.className = 'fas fa-moon';
        }
        
        // Store theme preference
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const theme = isDark ? 'dark' : 'light';
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        // Update chart colors if they exist
        this.updateChartThemes();
    }

    updateChartThemes() {
        // This function can be extended to update Chart.js charts when theme changes
        // Example: window.dispatchEvent(new CustomEvent('themeUpdate'));
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    getCurrentTheme() {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }
}

// Loader functionality
class LoaderManager {
    constructor() {
        this.loader = null;
        this.init();
    }

    init() {
        this.createLoader();
        this.setupNetworkListeners();
    }

    createLoader() {
        // Create loader if it doesn't exist
        if (!document.getElementById('pageLoader')) {
            const loader = document.createElement('div');
            loader.id = 'pageLoader';
            loader.className = 'loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <p class="loader-text">Loading...</p>
            `;
            document.body.appendChild(loader);
        }
        
        this.loader = document.getElementById('pageLoader');
        
        // Add loader styles if not already present
        this.ensureLoaderStyles();
    }

    ensureLoaderStyles() {
        // Inject loader CSS if not already in the document
        const existingLoaderStyles = document.querySelector('style[data-loader-styles]');
        if (!existingLoaderStyles) {
            const style = document.createElement('style');
            style.setAttribute('data-loader-styles', 'true');
            style.textContent = `
                /* Enhanced Theme-Tailored Loader */
                .loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    transition: opacity 0.3s, visibility 0.3s;
                    opacity: 0;
                    visibility: hidden;
                    backdrop-filter: blur(6px);
                }

                .loader.active {
                    opacity: 1;
                    visibility: visible;
                }

                .loader {
                    background: rgba(243, 255, 247, 0.95);
                }

                .dark-mode .loader {
                    background: rgba(15, 42, 28, 0.97);
                }

                .loader-spinner {
                    width: 70px;
                    height: 70px;
                    border: 4px solid rgba(92, 196, 126, 0.2);
                    border-radius: 50%;
                    border-top-color: var(--primary-green);
                    animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
                    margin-bottom: 25px;
                    position: relative;
                }

                .loader-spinner::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    right: -8px;
                    bottom: -8px;
                    border: 4px solid transparent;
                    border-radius: 50%;
                    border-top-color: rgba(92, 196, 126, 0.1);
                    animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite reverse;
                }

                .dark-mode .loader-spinner {
                    border-color: rgba(109, 216, 143, 0.25);
                    border-top-color: var(--primary-green);
                }

                .dark-mode .loader-spinner::before {
                    border-top-color: rgba(109, 216, 143, 0.15);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .loader-text {
                    font-size: 18px;
                    font-weight: 500;
                    color: var(--text-dark);
                    letter-spacing: 0.5px;
                }

                .dark-mode .loader-text {
                    color: var(--text-light);
                }

                .theme-toggle-header {
                    position: relative;
                    background: rgba(255, 255, 255, 0.15);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition);
                    border: none;
                    color: white;
                }

                .theme-toggle-header:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-2px);
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message = 'Loading...') {
        if (this.loader) {
            const loaderText = this.loader.querySelector('.loader-text');
            if (loaderText) loaderText.textContent = message;
            this.loader.classList.add('active');
        }
    }

    hide() {
        if (this.loader) {
            this.loader.classList.remove('active');
        }
    }

    showError(message = 'An error occurred') {
        if (this.loader) {
            this.loader.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--secondary-red); margin-bottom: 20px;"></i>
                    <p class="loader-text" style="margin-bottom: 20px; color: var(--text-dark);">${message}</p>
                    <button onclick="location.reload()" style="
                        background: var(--primary-green);
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: var(--border-radius-sm);
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: var(--transition);
                    ">
                        Retry
                    </button>
                </div>
            `;
            this.loader.classList.add('active');
        }
    }

    showOffline() {
        if (this.loader) {
            this.loader.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <i class="fas fa-wifi-slash" style="font-size: 48px; color: var(--text-light); margin-bottom: 20px;"></i>
                    <p class="loader-text" style="margin-bottom: 20px; color: var(--text-dark);">No Internet Connection</p>
                    <p style="color: var(--text-light); margin-bottom: 24px; font-size: 14px; max-width: 300px;">
                        Please check your connection and try again.
                    </p>
                    <button onclick="location.reload()" style="
                        background: var(--primary-green);
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: var(--border-radius-sm);
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: var(--transition);
                        margin-bottom: 12px;
                    ">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                    <button onclick="window.loaderManager.hide()" style="
                        background: transparent;
                        color: var(--text-light);
                        border: 1px solid var(--border-color);
                        padding: 10px 24px;
                        border-radius: var(--border-radius-sm);
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: var(--transition);
                    ">
                        Continue Offline
                    </button>
                </div>
            `;
            this.loader.classList.add('active');
        }
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('Network connection restored');
            this.hide();
        });

        window.addEventListener('offline', () => {
            this.showOffline();
        });
    }
}

// Notification functionality
class NotificationManager {
    constructor() {
        this.notification = null;
        this.init();
    }

    init() {
        this.createNotification();
    }

    createNotification() {
        // Create notification if it doesn't exist
        if (!document.getElementById('notification')) {
            const notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span id="notificationText">Notification message here</span>
            `;
            document.body.appendChild(notification);
        }
        
        this.notification = document.getElementById('notification');
        
        // Add notification styles if not already present
        this.ensureNotificationStyles();
    }

    ensureNotificationStyles() {
        const existingNotificationStyles = document.querySelector('style[data-notification-styles]');
        if (!existingNotificationStyles) {
            const style = document.createElement('style');
            style.setAttribute('data-notification-styles', 'true');
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--primary-green);
                    color: white;
                    padding: 12px 20px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-lg);
                    z-index: 4000;
                    font-weight: 500;
                    transform: translateX(150%);
                    transition: transform 0.3s ease-out;
                    max-width: 280px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                }

                .notification.show {
                    transform: translateX(0);
                }

                .notification.error {
                    background: var(--secondary-red);
                }

                .notification.warning {
                    background: var(--secondary-orange);
                }

                .notification.info {
                    background: var(--secondary-blue);
                }

                @media (max-width: 600px) {
                    .notification {
                        top: 80px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message, type = 'success', duration = 3000) {
        if (!this.notification) return;

        const textElement = this.notification.querySelector('#notificationText');
        if (textElement) textElement.textContent = message;
        
        // Set notification type
        this.notification.className = 'notification';
        this.notification.classList.add(type, 'show');
        
        // Auto-hide after duration
        setTimeout(() => {
            this.hide();
        }, duration);
        
        // Add close on click
        this.notification.onclick = () => this.hide();
    }

    hide() {
        if (this.notification) {
            this.notification.classList.remove('show');
        }
    }
}

// Main initialization
class AppManager {
    constructor() {
        this.themeManager = null;
        this.loaderManager = null;
        this.notificationManager = null;
        this.init();
    }

    init() {
        // Initialize managers
        this.themeManager = new ThemeManager();
        this.loaderManager = new LoaderManager();
        this.notificationManager = new NotificationManager();
        
        // Make them globally accessible
        window.themeManager = this.themeManager;
        window.loaderManager = this.loaderManager;
        window.notificationManager = this.notificationManager;
        
        // Set up page load handling
        this.setupPageLoad();
    }

    setupPageLoad() {
        // Show loader on page load
        this.loaderManager.show();
        
        // Hide loader when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    this.loaderManager.hide();
                }, 500);
            });
        } else {
            setTimeout(() => {
                this.loaderManager.hide();
            }, 300);
        }
        
        // Set up navigation handling
        this.setupNavigation();
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:') && 
                !link.href.startsWith('#') && link.target !== '_blank') {
                
                const href = link.getAttribute('href');
                const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
                
                if (!isExternal) {
                    e.preventDefault();
                    this.loaderManager.show('Navigating...');
                    
                    // Simulate navigation delay for demo
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appManager = new AppManager();
    });
} else {
    window.appManager = new AppManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, LoaderManager, NotificationManager, AppManager };
}