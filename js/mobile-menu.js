// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    function openMobileMenu() {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    navToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 100);
        });
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    });
});

// Tab functionality for About section
document.addEventListener('DOMContentLoaded', function() {
    const subtabs = document.querySelectorAll('.subtab');
    const subsections = document.querySelectorAll('.subsection');
    
    subtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Update tab states
            subtabs.forEach(t => {
                t.classList.remove('bg-primary', 'text-white');
                t.classList.add('bg-card-bg', 'border', 'border-border-color', 'text-text-muted', 'hover:bg-bg-elev');
                t.setAttribute('aria-selected', 'false');
            });
            
            tab.classList.add('bg-primary', 'text-white');
            tab.classList.remove('bg-card-bg', 'border', 'border-border-color', 'text-text-muted', 'hover:bg-bg-elev');
            tab.setAttribute('aria-selected', 'true');
            
            // Update subsection visibility
            subsections.forEach(section => {
                if (section.getAttribute('data-subsection') === target) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });
});

// Read More functionality for IPP & IPS profiles
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const profileCard = button.closest('.profile-card');
            const fullMessage = profileCard.querySelector('.full-message');
            const readText = button.querySelector('.read-text');
            const readLess = button.querySelector('.read-less');
            const chevron = button.querySelector('.fa-chevron-down');
            
            if (fullMessage.classList.contains('hidden')) {
                fullMessage.classList.remove('hidden');
                readText.classList.add('hidden');
                readLess.classList.remove('hidden');
                chevron.classList.add('rotate-180');
                button.setAttribute('aria-expanded', 'true');
            } else {
                fullMessage.classList.add('hidden');
                readText.classList.remove('hidden');
                readLess.classList.add('hidden');
                chevron.classList.remove('rotate-180');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Sync mobile and desktop login/logout buttons
document.addEventListener('DOMContentLoaded', function() {
    const memberLoginBtn = document.getElementById('member-login-btn');
    const mobileMemberLoginBtn = document.getElementById('mobile-member-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const memberDisplay = document.getElementById('member-display');
    const mobileLoggedMember = document.getElementById('mobile-logged-member');
    const loggedMember = document.getElementById('logged-member');
    const usernameDisplay = document.getElementById('username-display');
    const mobileLoggedUsername = document.getElementById('mobile-logged-username');
    const loggedUsername = document.getElementById('logged-username');
    const mobileLogoutSection = document.getElementById('mobile-logout-section');
    
    // Sync mobile login button with desktop
    if (mobileMemberLoginBtn && memberLoginBtn) {
        mobileMemberLoginBtn.addEventListener('click', () => {
            memberLoginBtn.click();
        });
    }
    
    // Sync mobile logout button with desktop
    if (mobileLogoutBtn && logoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => {
            logoutBtn.click();
        });
    }
    
    // Sync member display between mobile and desktop
    function syncMemberDisplay() {
        if (loggedMember && mobileLoggedMember) {
            mobileLoggedMember.textContent = loggedMember.textContent;
        }
        if (loggedUsername && mobileLoggedUsername) {
            mobileLoggedUsername.textContent = loggedUsername.textContent;
        }
        
        // Show/hide mobile logout section based on login state
        if (memberDisplay && memberDisplay.style.display !== 'none') {
            mobileLogoutSection.classList.remove('hidden');
        } else {
            mobileLogoutSection.classList.add('hidden');
        }
    }
    
    // Observe changes to member display
    if (memberDisplay) {
        const observer = new MutationObserver(syncMemberDisplay);
        observer.observe(memberDisplay, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }
    
    if (usernameDisplay) {
        const observer = new MutationObserver(syncMemberDisplay);
        observer.observe(usernameDisplay, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const mobileThemeIcon = mobileThemeToggle.querySelector('i');
    
    // Check for saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);
    
    // Theme toggle click handlers
    function handleThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    themeToggle.addEventListener('click', handleThemeToggle);
    mobileThemeToggle.addEventListener('click', handleThemeToggle);
    
    function updateThemeIcons(theme) {
        const iconClass = theme === 'light' ? 'fa-sun' : 'fa-moon';
        const oppositeClass = theme === 'light' ? 'fa-moon' : 'fa-sun';
        
        // Update desktop theme icon
        if (themeIcon) {
            themeIcon.classList.remove(oppositeClass);
            themeIcon.classList.add(iconClass);
        }
        
        // Update mobile theme icon
        if (mobileThemeIcon) {
            mobileThemeIcon.classList.remove(oppositeClass);
            mobileThemeIcon.classList.add(iconClass);
        }
    }
});
