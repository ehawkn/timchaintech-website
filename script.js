// Smooth scroll for anchor links
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

// Active navigation highlighting
const navLinks = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.prop-card, .principle-item');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Parallax effect for hero background
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        const yPos = -(scrolled * 0.5);
        heroBackground.style.transform = `translateY(${yPos}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
        });
        ticking = true;
    }
});

// Add dynamic cursor effect (optional enhancement)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Highlight interactive elements on hover
document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
    });
});

// Add custom cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--bitcoin);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0;
    }
    
    body:hover .custom-cursor {
        opacity: 0.6;
    }
    
    .custom-cursor.cursor-active {
        transform: scale(1.5);
        opacity: 1;
    }
    
    @media (max-width: 968px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

// Form validation (for contact page)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        for (let [key, value] of Object.entries(data)) {
            if (!value.trim()) {
                isValid = false;
                const input = form.querySelector(`[name="${key}"]`);
                input.style.borderColor = 'var(--bitcoin)';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        }
        
        if (isValid) {
            // Here you would normally send the data to a server
            console.log('Form submitted:', data);
            showNotification('Message sent successfully!');
            form.reset();
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 2rem;
            background: var(--gray-900);
            border: 2px solid var(--bitcoin);
            color: var(--white);
            font-family: var(--font-mono);
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-error {
            border-color: #ff4444;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.onclick = () => {
                navLinks.classList.toggle('active');
                menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
            };
            
            const navContainer = document.querySelector('.nav-container');
            navContainer.appendChild(menuToggle);
            
            const mobileStyles = `
                .menu-toggle {
                    display: none;
                    background: none;
                    border: 2px solid var(--bitcoin);
                    color: var(--bitcoin);
                    font-size: 1.5rem;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .menu-toggle:hover {
                    background: var(--bitcoin);
                    color: var(--black);
                }
                
                @media (max-width: 768px) {
                    .menu-toggle {
                        display: block;
                    }
                    
                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--black);
                        flex-direction: column;
                        padding: 2rem;
                        border-top: 1px solid var(--gray-700);
                        display: none;
                    }
                    
                    .nav-links.active {
                        display: flex;
                    }
                }
            `;
            
            if (!document.querySelector('#mobile-menu-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'mobile-menu-styles';
                styleSheet.textContent = mobileStyles;
                document.head.appendChild(styleSheet);
            }
        }
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();
