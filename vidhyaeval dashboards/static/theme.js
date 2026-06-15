// VidyaEval - Theme Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Theme variables
    const htmlElement = document.documentElement;
    const THEME_KEY = 'vidyaeval-theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';
    
    // Create theme toggle button if it doesn't exist
    function createThemeToggle() {
        if (document.getElementById('theme-toggle')) return;
        
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'fixed top-3 right-3 z-50';
        
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'w-8 h-8 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center';
        toggleButton.setAttribute('aria-label', 'Toggle dark/light mode');
        
        const moonIcon = document.createElement('i');
        moonIcon.className = 'fas fa-moon text-sm';
        
        const sunIcon = document.createElement('i');
        sunIcon.className = 'fas fa-sun text-sm';
        
        toggleButton.appendChild(moonIcon);
        toggleButton.appendChild(sunIcon);
        toggleWrapper.appendChild(toggleButton);
        
        document.body.appendChild(toggleWrapper);
        updateToggleStyles();
        toggleButton.addEventListener('click', toggleTheme);
    }
    
    // Update toggle button styles
    function updateToggleStyles() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;
        
        const isDark = htmlElement.classList.contains(DARK_THEME);
        const moonIcon = toggleButton.querySelector('.fa-moon');
        const sunIcon = toggleButton.querySelector('.fa-sun');
        
        toggleButton.className = `w-8 h-8 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center ${
            isDark 
                ? 'bg-yellow-300 text-yellow-800 hover:bg-yellow-200' 
                : 'bg-indigo-700 text-white hover:bg-indigo-600'
        }`;
        
        moonIcon.style.display = isDark ? 'none' : 'block';
        sunIcon.style.display = isDark ? 'block' : 'none';
    }
    
    // Get user's preferred theme
    function getPreferredTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) return savedTheme;
        
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK_THEME;
        }
        
        // Default to dark theme
        return DARK_THEME;
    }
    
    // Apply theme to HTML element
    function applyTheme(theme) {
        // Remove existing theme classes
        htmlElement.classList.remove(DARK_THEME, LIGHT_THEME);
        
        // Add new theme class
        htmlElement.classList.add(theme);
        
        // Update toggle button styles
        updateToggleStyles();
        
        // Save preference
        localStorage.setItem(THEME_KEY, theme);
        
        // Apply theme-specific styles to the body and other elements
        applyThemeStyles(theme);
    }
    
    // Apply theme-specific styles to the body and other elements
    function applyThemeStyles(theme) {
        const body = document.body;
        const isDark = theme === DARK_THEME;
        
        // Skip theme styling on login and register pages
        if (isAuthPage()) {
            // For auth pages, we still want to apply some basic theme changes
            if (isDark) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
            }
            return;
        }
        
        // Update body classes for other pages
        if (isDark) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            
            // For non-auth pages that don't have the dark/light classes
            body.classList.remove('bg-gray-50', 'bg-gray-100');
            body.classList.add('bg-gray-900');
            
            // Update navbar if it exists
            const navbar = document.querySelector('nav');
            if (navbar) {
                navbar.classList.remove('bg-white');
                navbar.classList.add('bg-gray-800', 'text-white');
            }
            
            // Update cards
            document.querySelectorAll('.bg-white').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.remove('bg-white');
                    el.classList.add('bg-gray-800');
                }
            });
            
            // Update text colors
            document.querySelectorAll('.text-gray-700, .text-gray-800, .text-gray-900').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.remove('text-gray-700', 'text-gray-800', 'text-gray-900');
                    el.classList.add('text-gray-200');
                }
            });
            
            // Update borders
            document.querySelectorAll('.border-gray-200, .border-gray-300').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.remove('border-gray-200', 'border-gray-300');
                    el.classList.add('border-gray-700');
                }
            });
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            
            // For non-auth pages
            body.classList.add('bg-gray-50');
            body.classList.remove('bg-gray-900');
            
            // Update navbar if it exists
            const navbar = document.querySelector('nav');
            if (navbar) {
                navbar.classList.add('bg-white');
                navbar.classList.remove('bg-gray-800', 'text-white');
            }
            
            // Update cards
            document.querySelectorAll('.bg-gray-800').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.add('bg-white');
                    el.classList.remove('bg-gray-800');
                }
            });
            
            // Update text colors
            document.querySelectorAll('.text-gray-200').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.remove('text-gray-200');
                    el.classList.add('text-gray-700');
                }
            });
            
            // Update borders
            document.querySelectorAll('.border-gray-700').forEach(el => {
                if (!el.classList.contains('preserve-color')) {
                    el.classList.remove('border-gray-700');
                    el.classList.add('border-gray-200');
                }
            });
        }
    }
    
    // Check if current page is login or register page
    function isAuthPage() {
        return window.location.pathname.includes('index.html') || 
               window.location.pathname.includes('register.html') || 
               window.location.pathname === '/' || 
               window.location.pathname.endsWith('/');
    }
    
    // Toggle between dark and light theme
    function toggleTheme() {
        const currentTheme = htmlElement.classList.contains(DARK_THEME) ? DARK_THEME : LIGHT_THEME;
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        
        applyTheme(newTheme);
    }
    
    // Add theme styles to stylesheet
    function addThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dark mode styles for all pages */
            html.dark body:not(.bg-black) {
                background-color: #111827;
                color: #f3f4f6;
            }
            
            html.dark nav:not(.preserve-color) {
                background-color: #1f2937;
                color: #f3f4f6;
                border-color: #374151;
            }
            
            html.dark .bg-white:not(.preserve-color) {
                background-color: #1f2937;
            }
            
            html.dark .text-gray-700:not(.preserve-color),
            html.dark .text-gray-800:not(.preserve-color),
            html.dark .text-gray-900:not(.preserve-color) {
                color: #f3f4f6;
            }
            
            html.dark .border-gray-200:not(.preserve-color),
            html.dark .border-gray-300:not(.preserve-color) {
                border-color: #374151;
            }
            
            html.dark .shadow-md:not(.preserve-color),
            html.dark .shadow-lg:not(.preserve-color) {
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
            }
            
            /* Light mode styles for all pages */
            html.light body:not(.bg-black) {
                background-color: #f9fafb;
                color: #111827;
            }
            
            html.light nav:not(.preserve-color) {
                background-color: #ffffff;
                color: #111827;
                border-color: #e5e7eb;
            }
            
            html.light .bg-gray-800:not(.preserve-color),
            html.light .bg-gray-900:not(.preserve-color) {
                background-color: #ffffff;
            }
            
            html.light .text-gray-200:not(.preserve-color),
            html.light .text-gray-300:not(.preserve-color) {
                color: #111827;
            }
            
            html.light .border-gray-700:not(.preserve-color) {
                border-color: #e5e7eb;
            }
            
            /* Theme toggle button styles */
            #theme-toggle {
                position: relative;
                overflow: hidden;
                width: 32px !important;
                height: 32px !important;
                font-size: 0.875rem !important;
            }
            
            #theme-toggle::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.1;
                border-radius: 50%;
                background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%);
                transition: all 0.3s ease;
            }
            
            #theme-toggle:hover::after {
                opacity: 0.2;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize theme system
    function initTheme() {
        // Add theme styles
        addThemeStyles();
        
        // Apply preferred theme
        const preferredTheme = getPreferredTheme();
        applyTheme(preferredTheme);
        
        // Create toggle button
        createThemeToggle();
        
        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    if (!localStorage.getItem(THEME_KEY)) {
                        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
                    }
                });
        }
    }
    
    // Start the theme system
    initTheme();

    // Loading State Management
    window.UI = {
        showLoading: function(element, text = 'Loading...') {
            if (element) {
                element.disabled = true;
                element._originalHTML = element.innerHTML;
                element.innerHTML = `
                    <span class="flex items-center justify-center">
                        <i class="fas fa-spinner fa-spin mr-2 text-base"></i>
                        <span class="font-medium">${text}</span>
                    </span>
                `;
                element.classList.add('opacity-75');
            }
        },
        
        hideLoading: function(element) {
            if (element && element._originalHTML) {
                element.disabled = false;
                element.innerHTML = element._originalHTML;
                element.classList.remove('opacity-75');
            }
        },
        
        showError: function(message, duration = 5000) {
            const errorToast = document.createElement('div');
            errorToast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300 translate-y-0 font-medium';
            errorToast.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-lg mr-3"></i>
                    <span class="text-sm">${message}</span>
                    <button class="ml-4 text-white hover:text-red-100 focus:outline-none">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add close button functionality
            const closeBtn = errorToast.querySelector('button');
            closeBtn.addEventListener('click', () => {
                errorToast.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => errorToast.remove(), 300);
            });
            
            document.body.appendChild(errorToast);
            
            // Animate in
            requestAnimationFrame(() => {
                errorToast.classList.add('translate-y-0');
            });
            
            // Auto dismiss
            setTimeout(() => {
                errorToast.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => errorToast.remove(), 300);
            }, duration);
        },
        
        showSuccess: function(message, duration = 3000) {
            const successToast = document.createElement('div');
            successToast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300 translate-y-0 font-medium';
            successToast.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-lg mr-3"></i>
                    <span class="text-sm">${message}</span>
                    <button class="ml-4 text-white hover:text-green-100 focus:outline-none">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add close button functionality
            const closeBtn = successToast.querySelector('button');
            closeBtn.addEventListener('click', () => {
                successToast.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => successToast.remove(), 300);
            });
            
            document.body.appendChild(successToast);
            
            // Animate in
            requestAnimationFrame(() => {
                successToast.classList.add('translate-y-0');
            });
            
            // Auto dismiss
            setTimeout(() => {
                successToast.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => successToast.remove(), 300);
            }, duration);
        }
    };
    
    //Error Boundary
    //window.addEventListener('error', function(event) {
      //  console.error('Global error:', event.error);
       //UI.showError('An unexpected error occurred. Please try again.');
    //});
    
    // API Error Handler
    window.handleApiError = function(error) {
        console.error('API error:', error);
        let errorMessage = 'An error occurred while processing your request.';
        
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    errorMessage = 'Your session has expired. Please log in again.';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                    break;
                case 403:
                    errorMessage = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    errorMessage = 'The requested resource was not found.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
            }
        }
        
        UI.showError(errorMessage);
    };
}); 