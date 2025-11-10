// Sidebar functionality
class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.mainContent = document.getElementById('mainContent');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.menuItems = document.querySelectorAll('.menu-item');
        this.submenuLinks = document.querySelectorAll('.submenu-link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebar.addEventListener('click', () => this.closeSidebarMenu());
        this.sidebarOverlay.addEventListener('click', () => this.closeSidebarMenu());
        
        // Menu link clicks
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });
        
        // Submenu link clicks
        this.submenuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSubmenuClick(e));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Initialize active menu item
        this.setActiveMenuItem();
    }
    
    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebarMenu();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        this.sidebar.classList.add('active');
        this.sidebarOverlay.classList.add('active');
        this.sidebarToggle.classList.add('active');
        this.mainContent.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Focus management for accessibility
        this.closeSidebar.focus();
        
        // Add staggered animation to menu items
        this.animateMenuItems();
    }
    
    closeSidebarMenu() {
        this.sidebar.classList.remove('active');
        this.sidebarOverlay.classList.remove('active');
        this.sidebarToggle.classList.remove('active');
        this.mainContent.classList.remove('sidebar-open');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        // Return focus to toggle button
        this.sidebarToggle.focus();
    }
    
    handleMenuClick(e) {
        const link = e.currentTarget;
        const menuItem = link.closest('.menu-item');
        const href = link.getAttribute('href');
        
        // Handle submenu toggle for items with submenus
        if (menuItem.querySelector('.submenu')) {
            e.preventDefault();
            this.toggleSubmenu(menuItem);
            return;
        }
        
        // Check if it's an external link or internal anchor
        if (href.startsWith('http') || href.startsWith('www') || (!href.startsWith('#') && href.includes('.'))) {
            // External link - allow default behavior (redirect)
            return;
        }
        
        // Internal anchor - prevent default and handle smooth scroll
        e.preventDefault();
        
        // Remove active class from all links
        this.menuLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Smooth scroll to section
        if (href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.closeSidebarMenu();
            }, 300);
        }
        
        // Add ripple effect
        this.addRippleEffect(link, e);
    }
    
    handleSubmenuClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Check if it's an external link or internal anchor
        if (href.startsWith('http') || href.startsWith('www') || (!href.startsWith('#') && href.includes('.'))) {
            // External link - allow default behavior (redirect)
            return;
        }
        
        // Internal anchor - prevent default and handle smooth scroll
        e.preventDefault();
        
        // Remove active class from all submenu links
        this.submenuLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked submenu link
        link.classList.add('active');
        
        // Smooth scroll to section
        if (href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.closeSidebarMenu();
            }, 300);
        }
        
        // Add ripple effect
        this.addRippleEffect(link, e);
    }
    
    toggleSubmenu(menuItem) {
        const isExpanded = menuItem.classList.contains('expanded');
        
        // Close all other submenus
        this.menuItems.forEach(item => {
            if (item !== menuItem) {
                item.classList.remove('expanded');
            }
        });
        
        // Toggle current submenu
        if (isExpanded) {
            menuItem.classList.remove('expanded');
        } else {
            menuItem.classList.add('expanded');
        }
    }
    
    handleKeydown(e) {
        // Close sidebar with Escape key
        if (e.key === 'Escape' && this.isOpen) {
            this.closeSidebarMenu();
        }
        
        // Toggle sidebar with Ctrl/Cmd + B
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggleSidebar();
        }
    }
    
    handleResize() {
        // Close sidebar on desktop if window is resized
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeSidebarMenu();
        }
    }
    
    setActiveMenuItem() {
        // Set active menu item based on current hash or default to home
        const currentHash = window.location.hash || '#home';
        const activeLink = document.querySelector(`.menu-link[href="${currentHash}"]`);
        
        if (activeLink) {
            this.menuLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }
    
    animateMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(218, 165, 32, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Smooth scroll behavior for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.scrollToSection();
        });
        
        // Handle initial load with hash
        if (window.location.hash) {
            setTimeout(() => {
                this.scrollToSection();
            }, 100);
        }
    }
    
    scrollToSection() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                const headerOffset = 20;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// Intersection Observer for active menu highlighting
class MenuHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('.content-section');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.init();
    }
    
    init() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveMenuItem(id);
                }
            });
        }, options);
        
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }
    
    updateActiveMenuItem(activeId) {
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
                
                // Expand parent menu if it's a submenu item
                const menuItem = link.closest('.menu-item');
                if (menuItem && menuItem.querySelector('.submenu')) {
                    menuItem.classList.add('expanded');
                }
            }
        });
        
        // Handle submenu items
        this.submenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
                
                // Expand parent menu
                const parentMenuItem = link.closest('.menu-item');
                if (parentMenuItem) {
                    parentMenuItem.classList.add('expanded');
                }
            }
        });
    }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
    new SmoothScroll();
    new MenuHighlighter();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Debounce resize events
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