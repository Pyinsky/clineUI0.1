// StockArt Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeSidebar();
    initializeSearch();
    initializeAnimations();
    initializeKeyboardShortcuts();
    initializeTheme();
    initializeAccessibility();
});

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const signInBtn = document.querySelector('.sign-in-btn');
    
    // Load sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }
    
    // Toggle sidebar functionality
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            // Announce state change
            window.announce && window.announce(
                isCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded'
            );
        });
    }
    
    // Add tooltips for collapsed sidebar
    function createTooltips() {
        navItems.forEach(item => {
            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.textContent = item.querySelector('span').textContent;
            item.appendChild(tooltip);
        });
        
        if (signInBtn) {
            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.textContent = signInBtn.querySelector('span').textContent;
            signInBtn.appendChild(tooltip);
        }
    }
    
    createTooltips();
    
    // Handle mobile responsive behavior
    function handleMobileResize() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('collapsed');
        }
    }
    
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Add hover sound effect simulation
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // New Analysis button functionality
    const newAnalysisBtn = document.querySelector('.new-thread-btn');
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            simulateNewAnalysis();
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    const searchOptions = document.querySelectorAll('.search-option');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const voiceBtn = document.querySelector('.voice-btn');

    if (searchInput) {
        // Search input focus effects
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            document.body.classList.add('search-active');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            document.body.classList.remove('search-active');
        });

        // Real-time search suggestions
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });

        // Search submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }

    // Search options functionality
    searchOptions.forEach(option => {
        option.addEventListener('click', function() {
            toggleSearchOption(this);
        });
    });

    // Tool buttons functionality
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleToolAction(this);
        });
    });

    // Voice search functionality
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            toggleVoiceSearch();
        });
    }
}

// Animation and visual effects
function initializeAnimations() {
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.main-content::before');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Logo hover effect enhancement
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 10px rgba(74, 158, 255, 0.5))';
        });

        logoContainer.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    }

    // Brand logo click effect
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    }

    // Floating particles effect
    createFloatingParticles();
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K for new analysis
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('mainSearchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('mainSearchInput');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
                searchInput.value = '';
                hideSearchSuggestions();
            }
        }

        // Arrow navigation for nav items
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            navigateWithKeyboard(e.key);
        }
    });
}

// Theme and appearance
function initializeTheme() {
    // Auto-detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for theme changes
    prefersDark.addEventListener('change', function(e) {
        updateTheme(e.matches ? 'dark' : 'light');
    });

    // Apply initial theme
    updateTheme(prefersDark.matches ? 'dark' : 'light');
}

// Accessibility features
function initializeAccessibility() {
    // Enhanced focus management
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Screen reader announcements
    const announcements = document.createElement('div');
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);

    window.announce = function(message) {
        announcements.textContent = message;
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    };
}

// Helper functions
function simulateNewAnalysis() {
    const btn = document.querySelector('.new-thread-btn');
    btn.classList.add('loading');
    
    // Simulate loading
    setTimeout(() => {
        btn.classList.remove('loading');
        const searchInput = document.getElementById('mainSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.placeholder = 'What company would you like to analyze?';
        }
        window.announce('New analysis session started');
    }, 1500);
}

function showSearchSuggestions(query) {
    // Create suggestions based on query
    const suggestions = generateSearchSuggestions(query);
    displaySuggestions(suggestions);
}

function generateSearchSuggestions(query) {
    const stockSuggestions = [
        'Apple Inc. (AAPL)', 'Microsoft Corporation (MSFT)', 'Amazon.com Inc. (AMZN)',
        'Alphabet Inc. (GOOGL)', 'Tesla Inc. (TSLA)', 'Meta Platforms Inc. (META)',
        'NVIDIA Corporation (NVDA)', 'Berkshire Hathaway Inc. (BRK.A)',
        'JPMorgan Chase & Co. (JPM)', 'Johnson & Johnson (JNJ)'
    ];

    return stockSuggestions
        .filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
}

function displaySuggestions(suggestions) {
    let suggestionBox = document.querySelector('.search-suggestions');
    
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.className = 'search-suggestions';
        document.querySelector('.search-input-wrapper').appendChild(suggestionBox);
    }

    suggestionBox.innerHTML = suggestions
        .map(suggestion => `
            <div class="suggestion-item" tabindex="0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>${suggestion}</span>
            </div>
        `)
        .join('');

    // Add click handlers for suggestions
    suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const searchInput = document.getElementById('mainSearchInput');
            searchInput.value = this.textContent.trim();
            hideSearchSuggestions();
            performSearch(searchInput.value);
        });
    });

    suggestionBox.style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestionBox = document.querySelector('.search-suggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
}

function performSearch(query) {
    if (!query.trim()) return;

    // Simulate search process
    const searchInput = document.getElementById('mainSearchInput');
    searchInput.classList.add('loading');
    
    // Show loading state
    setTimeout(() => {
        searchInput.classList.remove('loading');
        window.announce(`Searching for ${query}`);
        
        // Simulate search results
        showSearchResults(query);
    }, 2000);
}

function showSearchResults(query) {
    // Create and display mock search results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results fade-in';
    resultsContainer.innerHTML = `
        <div class="results-header">
            <h2>Analysis for "${query}"</h2>
            <p>Generated ${new Date().toLocaleString()}</p>
        </div>
        <div class="results-content">
            <div class="result-card">
                <h3>Company Overview</h3>
                <p>Comprehensive analysis and insights...</p>
            </div>
            <div class="result-card">
                <h3>Financial Metrics</h3>
                <p>Key performance indicators and ratios...</p>
            </div>
            <div class="result-card">
                <h3>Market Sentiment</h3>
                <p>Current market perception and trends...</p>
            </div>
        </div>
    `;

    // Insert results into main content
    const mainContent = document.querySelector('.center-content');
    mainContent.appendChild(resultsContainer);
}

function toggleSearchOption(option) {
    option.classList.toggle('active');
    
    if (option.classList.contains('pro-option')) {
        // Handle PRO option
        window.announce('PRO features activated');
    } else if (option.classList.contains('deep-research-option')) {
        // Handle Deep Research option
        window.announce('Deep research mode enabled');
    }
}

function handleToolAction(toolBtn) {
    const title = toolBtn.getAttribute('title');
    
    // Add click effect
    toolBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        toolBtn.style.transform = '';
    }, 150);

    // Handle different tool actions
    switch (title) {
        case 'Attach file':
            simulateFileUpload();
            break;
        case 'Focus mode':
            toggleFocusMode();
            break;
        case 'Collections':
            showCollections();
            break;
    }

    window.announce(`${title} activated`);
}

function simulateFileUpload() {
    // Create file input simulation
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.csv,.xlsx';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            window.announce(`File ${fileName} uploaded successfully`);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

function toggleVoiceSearch() {
    const voiceBtn = document.querySelector('.voice-btn');
    voiceBtn.classList.toggle('recording');
    
    if (voiceBtn.classList.contains('recording')) {
        // Start voice recording simulation
        voiceBtn.style.color = '#ff4444';
        window.announce('Voice recording started');
        
        setTimeout(() => {
            voiceBtn.classList.remove('recording');
            voiceBtn.style.color = '';
            window.announce('Voice recording stopped');
        }, 3000);
    }
}

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    if (document.body.classList.contains('focus-mode')) {
        // Hide distracting elements
        document.querySelector('.sidebar').style.opacity = '0.3';
        window.announce('Focus mode activated');
    } else {
        document.querySelector('.sidebar').style.opacity = '';
        window.announce('Focus mode deactivated');
    }
}

function showCollections() {
    // Create collections modal simulation
    const modal = document.createElement('div');
    modal.className = 'collections-modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Collections</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="collection-item">
                    <h4>Tech Stocks</h4>
                    <p>5 companies</p>
                </div>
                <div class="collection-item">
                    <h4>Blue Chip</h4>
                    <p>8 companies</p>
                </div>
                <div class="collection-item">
                    <h4>Growth Stocks</h4>
                    <p>12 companies</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    modal.querySelector('.close-btn').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function navigateWithKeyboard(direction) {
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const activeItem = document.querySelector('.nav-item.active');
    const currentIndex = navItems.indexOf(activeItem);
    
    let newIndex;
    if (direction === 'ArrowDown') {
        newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
    }

    // Remove active from current and add to new
    navItems.forEach(item => item.classList.remove('active'));
    navItems[newIndex].classList.add('active');
    navItems[newIndex].focus();
}

function updateTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
        // Enhance dark mode effects
        document.documentElement.style.setProperty('--shadow-glow', '0 0 25px rgba(74, 158, 255, 0.4)');
    } else {
        document.documentElement.style.setProperty('--shadow-glow', '0 0 20px rgba(74, 158, 255, 0.3)');
    }
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.querySelector('.main-content').appendChild(particleContainer);

    // Create multiple particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning and animation
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(74, 158, 255, 0.6), transparent);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: float ${duration}s infinite linear;
        pointer-events: none;
    `;

    container.appendChild(particle);

    // Remove and recreate particle after animation
    setTimeout(() => {
        if (container.contains(particle)) {
            container.removeChild(particle);
            createParticle(container);
        }
    }, duration * 1000);
}

// Performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('StockArt Error:', e.error);
});

// Add CSS for dynamic elements
const dynamicStyles = `
<style>
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--secondary-dark);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    margin-top: var(--spacing-sm);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    cursor: pointer;
    transition: background var(--transition-base);
}

.suggestion-item:hover {
    background: var(--hover-bg);
}

.collections-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--secondary-dark);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    min-width: 400px;
    max-width: 500px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
}

.collection-item {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-sm);
    transition: background var(--transition-base);
}

.collection-item:hover {
    background: var(--hover-bg);
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.keyboard-navigation button:focus,
.keyboard-navigation input:focus,
.keyboard-navigation .nav-item:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.focus-mode .sidebar {
    transition: opacity var(--transition-base);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);
