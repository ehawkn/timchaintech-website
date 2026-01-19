// =============================================
// Accessibility: Reduced Motion Preference
// =============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Listen for changes to reduced motion preference
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        // User now prefers reduced motion - disable animations
        document.documentElement.classList.add('reduce-motion');
    } else {
        // User no longer prefers reduced motion - enable animations
        document.documentElement.classList.remove('reduce-motion');
    }
});

// Set initial state
if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
}

// =============================================
// Scroll Progress Indicator
// =============================================
const createScrollProgressIndicator = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const progressStyles = document.createElement('style');
    progressStyles.id = 'scroll-progress-styles';
    progressStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--bitcoin), #ffaa00);
            z-index: 10001;
            transition: width 0.1s ease-out;
        }
    `;
    document.head.appendChild(progressStyles);

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
};

// =============================================
// Page Load Animation
// =============================================
const initPageLoadAnimation = () => {
    document.body.style.opacity = '0';

    const loadStyles = document.createElement('style');
    loadStyles.id = 'page-load-styles';
    loadStyles.textContent = `
        body {
            transition: opacity 0.5s ease-in-out;
        }
        body.loaded {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(loadStyles);

    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            document.body.classList.add('loaded');
        });
    });
};

// Initialize page load animation early
if (!prefersReducedMotion) {
    initPageLoadAnimation();
} else {
    // Ensure page is visible if reduced motion is preferred
    document.body.style.opacity = '1';
}

// =============================================
// Smooth scroll for anchor links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// =============================================
// Active navigation highlighting
// =============================================
const navLinks = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// =============================================
// Intersection Observer for fade-in animations
// =============================================
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
        if (!prefersReducedMotion) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        }
    });

    // Initialize scroll progress indicator
    createScrollProgressIndicator();
});

// =============================================
// Parallax effect for hero background
// =============================================
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

// Only enable parallax if user doesn't prefer reduced motion
if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
            });
            ticking = true;
        }
    });
}

// =============================================
// Custom cursor effect (respects reduced motion)
// =============================================
if (!prefersReducedMotion) {
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
}

// =============================================
// Improved Notification System with Icons
// =============================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    const icon = type === 'success'
        ? '<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    notification.innerHTML = `${icon}<span>${message}</span>`;

    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: var(--gray-900);
            border: 2px solid var(--bitcoin);
            color: var(--white);
            font-family: var(--font-mono);
            font-size: 0.9rem;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .notification-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .notification-success .notification-icon {
            color: #4ade80;
        }

        .notification-error {
            border-color: #ff4444;
        }

        .notification-error .notification-icon {
            color: #ff4444;
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

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
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
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// =============================================
// Form Enhancements with Real-time Validation
// =============================================
const initFormEnhancements = () => {
    const forms = document.querySelectorAll('form');

    // Add form enhancement styles
    const formStyles = document.createElement('style');
    formStyles.id = 'form-enhancement-styles';
    formStyles.textContent = `
        .form-group {
            position: relative;
        }

        .input-validation {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .input-validation.visible {
            opacity: 1;
        }

        .input-validation.valid {
            color: #4ade80;
        }

        .input-validation.invalid {
            color: #ff4444;
        }

        .char-count {
            position: absolute;
            bottom: 0.5rem;
            right: 0.75rem;
            font-size: 0.75rem;
            color: var(--gray-500);
            font-family: var(--font-mono);
            pointer-events: none;
        }

        .char-count.warning {
            color: var(--bitcoin);
        }

        .char-count.limit {
            color: #ff4444;
        }

        textarea {
            padding-bottom: 2rem !important;
        }

        .input-error-message {
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            font-family: var(--font-mono);
        }

        input:focus.valid,
        textarea:focus.valid {
            border-color: #4ade80 !important;
        }

        input:focus.invalid,
        textarea:focus.invalid {
            border-color: #ff4444 !important;
        }
    `;
    document.head.appendChild(formStyles);

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Add character count for textareas
            if (input.tagName === 'TEXTAREA') {
                const maxLength = input.getAttribute('maxlength') || 1000;
                const charCount = document.createElement('span');
                charCount.className = 'char-count';
                charCount.textContent = `0 / ${maxLength}`;

                // Wrap textarea if not already wrapped
                let wrapper = input.parentElement;
                if (!wrapper.classList.contains('form-group')) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'form-group';
                    wrapper.style.position = 'relative';
                    input.parentElement.insertBefore(wrapper, input);
                    wrapper.appendChild(input);
                }
                wrapper.appendChild(charCount);

                input.addEventListener('input', () => {
                    const length = input.value.length;
                    charCount.textContent = `${length} / ${maxLength}`;

                    charCount.classList.remove('warning', 'limit');
                    if (length >= maxLength) {
                        charCount.classList.add('limit');
                    } else if (length >= maxLength * 0.8) {
                        charCount.classList.add('warning');
                    }
                });
            }

            // Real-time validation
            input.addEventListener('blur', () => {
                validateInput(input);
            });

            input.addEventListener('input', () => {
                // Remove error state on input
                input.classList.remove('invalid');
                const errorMsg = input.parentElement.querySelector('.input-error-message');
                if (errorMsg) errorMsg.remove();
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                console.log('Form submitted:', data);
                showNotification('Message sent successfully!', 'success');
                form.reset();

                // Reset character counts
                form.querySelectorAll('.char-count').forEach(counter => {
                    const maxLength = counter.textContent.split('/')[1].trim();
                    counter.textContent = `0 / ${maxLength}`;
                    counter.classList.remove('warning', 'limit');
                });
            } else {
                showNotification('Please fill in all fields correctly.', 'error');
            }
        });
    });
};

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.required || input.hasAttribute('required');

    let isValid = true;
    let errorMessage = '';

    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Update visual state
    input.classList.remove('valid', 'invalid');
    const existingError = input.parentElement.querySelector('.input-error-message');
    if (existingError) existingError.remove();

    if (!isValid) {
        input.classList.add('invalid');
        const errorEl = document.createElement('div');
        errorEl.className = 'input-error-message';
        errorEl.textContent = errorMessage;
        input.parentElement.appendChild(errorEl);
    } else if (value) {
        input.classList.add('valid');
    }

    return isValid;
}

// Initialize form enhancements on DOM ready
document.addEventListener('DOMContentLoaded', initFormEnhancements);

// =============================================
// Improved Mobile Menu with Backdrop and Animations
// =============================================
let mobileMenuOpen = false;
let backdrop = null;

const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinksEl = document.querySelector('.nav-links');

    if (window.innerWidth <= 768) {
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = `
                <span class="menu-icon">
                    <span class="menu-bar"></span>
                    <span class="menu-bar"></span>
                    <span class="menu-bar"></span>
                </span>
            `;

            // Create backdrop
            backdrop = document.createElement('div');
            backdrop.className = 'menu-backdrop';
            document.body.appendChild(backdrop);

            menuToggle.onclick = () => {
                toggleMobileMenu(menuToggle, navLinksEl);
            };

            // Close on backdrop click
            backdrop.onclick = () => {
                if (mobileMenuOpen) {
                    toggleMobileMenu(menuToggle, navLinksEl);
                }
            };

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenuOpen) {
                    toggleMobileMenu(menuToggle, navLinksEl);
                }
            });

            // Close menu when clicking nav links
            navLinksEl.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenuOpen) {
                        toggleMobileMenu(menuToggle, navLinksEl);
                    }
                });
            });

            const navContainer = document.querySelector('.nav-container');
            navContainer.appendChild(menuToggle);

            const mobileStyles = `
                .menu-toggle {
                    display: none;
                    background: none;
                    border: 2px solid var(--bitcoin);
                    color: var(--bitcoin);
                    padding: 0.5rem;
                    cursor: pointer;
                    transition: var(--transition);
                    width: 44px;
                    height: 44px;
                    position: relative;
                }

                .menu-toggle:hover {
                    background: var(--bitcoin);
                }

                .menu-toggle:hover .menu-bar {
                    background: var(--black);
                }

                .menu-icon {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    gap: 5px;
                }

                .menu-bar {
                    display: block;
                    width: 20px;
                    height: 2px;
                    background: var(--bitcoin);
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }

                .menu-toggle.active .menu-bar:nth-child(1) {
                    transform: translateY(7px) rotate(45deg);
                }

                .menu-toggle.active .menu-bar:nth-child(2) {
                    opacity: 0;
                }

                .menu-toggle.active .menu-bar:nth-child(3) {
                    transform: translateY(-7px) rotate(-45deg);
                }

                .menu-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                    z-index: 998;
                }

                .menu-backdrop.active {
                    opacity: 1;
                    visibility: visible;
                }

                @media (max-width: 768px) {
                    .menu-toggle {
                        display: flex;
                    }

                    .nav-links {
                        position: fixed;
                        top: 0;
                        right: -300px;
                        width: 280px;
                        height: 100vh;
                        background: var(--gray-900);
                        flex-direction: column;
                        padding: 5rem 2rem 2rem;
                        border-left: 1px solid var(--gray-700);
                        transition: transform 0.3s ease;
                        z-index: 999;
                        display: flex;
                        gap: 0;
                    }

                    .nav-links.active {
                        transform: translateX(-300px);
                    }

                    .nav-links .nav-link {
                        padding: 1rem 0;
                        border-bottom: 1px solid var(--gray-800);
                        width: 100%;
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

function toggleMobileMenu(toggle, navLinksEl) {
    mobileMenuOpen = !mobileMenuOpen;

    toggle.classList.toggle('active');
    navLinksEl.classList.toggle('active');
    backdrop.classList.toggle('active');

    toggle.setAttribute('aria-expanded', mobileMenuOpen.toString());

    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
}

// Handle resize to close menu if window is resized above mobile breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        const toggle = document.querySelector('.menu-toggle');
        const navLinksEl = document.querySelector('.nav-links');
        if (toggle && navLinksEl) {
            mobileMenuOpen = false;
            toggle.classList.remove('active');
            navLinksEl.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    createMobileMenu();
});

createMobileMenu();

// =============================================
// Accessibility: Keyboard Navigation Enhancements
// =============================================
const initKeyboardNavigation = () => {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = skipLink.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    }

    // Navigation menu keyboard support
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        const links = navLinksContainer.querySelectorAll('.nav-link');

        links.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                let targetIndex;

                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = (index + 1) % links.length;
                        links[targetIndex].focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = (index - 1 + links.length) % links.length;
                        links[targetIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        links[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        links[links.length - 1].focus();
                        break;
                }
            });
        });
    }

    // Card keyboard interaction - make cards with links activatable
    const interactiveCards = document.querySelectorAll('.prop-card, .solution-card, .case-study-card, .team-card, .alt-contact-card');
    interactiveCards.forEach(card => {
        const link = card.querySelector('a');
        if (link) {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        }
    });

    // Focus trap for mobile menu
    const trapFocusInMobileMenu = () => {
        const mobileMenu = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');

        if (mobileMenu && menuToggle && mobileMenuOpen) {
            const focusableElements = mobileMenu.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            mobileMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
        }
    };

    // Store original toggle function reference
    const originalToggleFunc = toggleMobileMenu;
    window.toggleMobileMenu = function(toggle, navLinksEl) {
        originalToggleFunc(toggle, navLinksEl);
        trapFocusInMobileMenu();
    };

    // Form field keyboard enhancements
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        // Move to submit button on Enter in single-line inputs
        if (field.tagName === 'INPUT' && field.type !== 'submit') {
            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    const form = field.closest('form');
                    if (form) {
                        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                        if (submitBtn) {
                            submitBtn.focus();
                        }
                    }
                }
            });
        }
    });

    // Create announcer for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    document.body.appendChild(announcer);

    // Function to announce messages to screen readers
    window.announceToScreenReader = (message) => {
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    };
};

// Initialize keyboard navigation on DOM ready
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);

// =============================================
// Accessibility: Focus Management
// =============================================
const initFocusManagement = () => {
    // Track whether user is navigating with keyboard
    let usingKeyboard = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            usingKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        usingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });

    // Add styles for keyboard navigation indicator
    const focusStyles = document.createElement('style');
    focusStyles.id = 'keyboard-focus-styles';
    focusStyles.textContent = `
        /* Hide default focus outline when using mouse */
        body:not(.keyboard-nav) *:focus:not(.skip-link):not(input):not(textarea):not(select) {
            outline: none;
        }

        /* Show enhanced focus outline when using keyboard */
        body.keyboard-nav *:focus {
            outline: 3px solid var(--bitcoin) !important;
            outline-offset: 2px !important;
        }

        /* Screen reader only class */
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
    `;
    document.head.appendChild(focusStyles);
};

document.addEventListener('DOMContentLoaded', initFocusManagement);

// =============================================
// Accessibility: Enhanced Notification Announcements
// =============================================
// Store original showNotification for enhancement
const originalShowNotificationFunc = showNotification;
showNotification = function(message, type = 'success') {
    originalShowNotificationFunc(message, type);

    // Announce to screen readers
    if (typeof window.announceToScreenReader === 'function') {
        window.announceToScreenReader(message);
    }
};

// =============================================
// Particle/Constellation Effect for Hero Sections
// =============================================
const initParticleEffect = () => {
    // Add js-enabled class to hide static CSS fallback
    document.documentElement.classList.add('js-enabled');

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
        return;
    }

    // Site color palette
    const colors = {
        bitcoin: '#F7931A',
        solana: '#9945FF',
        accent: '#00FF41',
        white: 'rgba(255, 255, 255, 0.6)'
    };

    // Particle configuration
    const config = {
        particleCount: 60,           // Number of particles (will be adjusted for mobile)
        particleMinSize: 1,
        particleMaxSize: 3,
        connectionDistance: 150,     // Max distance to draw lines between particles
        moveSpeed: 0.3,              // Base movement speed
        lineOpacity: 0.15,           // Opacity of connection lines
        particleOpacity: 0.6,        // Base opacity of particles
        parallaxStrength: 0.02,      // Mouse parallax strength (subtle)
        parallaxSmoothing: 0.08      // Smoothing factor for parallax movement
    };

    // Adjust for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        config.particleCount = 30;
        config.connectionDistance = 100;
    }

    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.baseX = this.x;  // Store original position for parallax
            this.baseY = this.y;
            this.size = Math.random() * (config.particleMaxSize - config.particleMinSize) + config.particleMinSize;

            // Random velocity with slight bias
            this.vx = (Math.random() - 0.5) * config.moveSpeed;
            this.vy = (Math.random() - 0.5) * config.moveSpeed;

            // Assign color with weighted probability
            const colorRoll = Math.random();
            if (colorRoll < 0.5) {
                this.color = colors.bitcoin;
            } else if (colorRoll < 0.8) {
                this.color = colors.solana;
            } else {
                this.color = colors.white;
            }

            this.opacity = Math.random() * 0.4 + 0.2;

            // Depth factor for parallax (particles at different "depths")
            this.depth = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
        }

        update(parallaxX, parallaxY) {
            // Move particle (base movement)
            this.baseX += this.vx;
            this.baseY += this.vy;

            // Wrap around edges (with padding)
            const padding = 50;
            if (this.baseX < -padding) this.baseX = this.canvas.width + padding;
            if (this.baseX > this.canvas.width + padding) this.baseX = -padding;
            if (this.baseY < -padding) this.baseY = this.canvas.height + padding;
            if (this.baseY > this.canvas.height + padding) this.baseY = -padding;

            // Apply parallax offset based on depth
            this.x = this.baseX + (parallaxX * this.depth);
            this.y = this.baseY + (parallaxY * this.depth);
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    class ParticleSystem {
        constructor(container) {
            this.container = container;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'particle-canvas';
            this.canvas.setAttribute('aria-hidden', 'true');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.animationId = null;
            this.isVisible = true;

            // Mouse parallax state
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetParallaxX = 0;
            this.targetParallaxY = 0;
            this.currentParallaxX = 0;
            this.currentParallaxY = 0;

            // Append canvas to container
            this.container.appendChild(this.canvas);

            // Set up canvas size
            this.resize();

            // Create particles
            this.createParticles();

            // Set up event listeners
            this.setupEventListeners();

            // Start animation
            this.animate();
        }

        resize() {
            const rect = this.container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';

            this.ctx.scale(dpr, dpr);

            // Store actual dimensions for calculations
            this.width = rect.width;
            this.height = rect.height;

            // Store container position for mouse calculations
            this.containerRect = rect;
        }

        createParticles() {
            this.particles = [];
            const count = config.particleCount;

            for (let i = 0; i < count; i++) {
                const particle = new Particle({
                    width: this.width,
                    height: this.height
                });
                this.particles.push(particle);
            }
        }

        setupEventListeners() {
            // Debounced resize handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resize();
                    // Reset particle positions after resize
                    this.particles.forEach(p => {
                        p.canvas = { width: this.width, height: this.height };
                        if (p.baseX > this.width) p.baseX = Math.random() * this.width;
                        if (p.baseY > this.height) p.baseY = Math.random() * this.height;
                        p.x = p.baseX;
                        p.y = p.baseY;
                    });
                }, 200);
            });

            // Mouse move handler for parallax effect (desktop only)
            if (!isMobile) {
                document.addEventListener('mousemove', (e) => {
                    // Calculate mouse position relative to viewport center
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;

                    // Normalized offset from center (-1 to 1)
                    const offsetX = (e.clientX - centerX) / centerX;
                    const offsetY = (e.clientY - centerY) / centerY;

                    // Set target parallax values (scaled by container dimensions)
                    this.targetParallaxX = offsetX * this.width * config.parallaxStrength;
                    this.targetParallaxY = offsetY * this.height * config.parallaxStrength;
                });
            }

            // Pause animation when not visible (performance optimization)
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    if (this.isVisible && !this.animationId) {
                        this.animate();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(this.container);

            // Also check for tab visibility
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else if (this.isVisible) {
                    this.animate();
                }
            });
        }

        updateParallax() {
            // Smooth interpolation towards target parallax values
            this.currentParallaxX += (this.targetParallaxX - this.currentParallaxX) * config.parallaxSmoothing;
            this.currentParallaxY += (this.targetParallaxY - this.currentParallaxY) * config.parallaxSmoothing;
        }

        drawConnections() {
            const distSq = config.connectionDistance * config.connectionDistance;

            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p1 = this.particles[i];
                    const p2 = this.particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < distSq) {
                        const distance = Math.sqrt(distanceSq);
                        const opacity = (1 - distance / config.connectionDistance) * config.lineOpacity;

                        // Blend colors for the line
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);

                        // Create gradient for line
                        const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        gradient.addColorStop(0, p1.color);
                        gradient.addColorStop(1, p2.color);

                        this.ctx.strokeStyle = gradient;
                        this.ctx.globalAlpha = opacity;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                        this.ctx.globalAlpha = 1;
                    }
                }
            }
        }

        animate() {
            if (!this.isVisible || document.hidden) {
                this.animationId = null;
                return;
            }

            // Clear canvas
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Update parallax
            this.updateParallax();

            // Update and draw particles with parallax offset
            this.particles.forEach(particle => {
                particle.update(this.currentParallaxX, this.currentParallaxY);
                particle.draw(this.ctx);
            });

            // Draw connections
            this.drawConnections();

            // Request next frame
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        pause() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        destroy() {
            this.pause();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Initialize particle systems for hero sections
    const initParticleSystems = () => {
        const particleContainers = document.querySelectorAll('.particle-container');

        particleContainers.forEach(container => {
            new ParticleSystem(container);
        });
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleSystems);
    } else {
        initParticleSystems();
    }
};

// Initialize particle effect
initParticleEffect();

// =============================================
// Skeleton Loading Screen System
// =============================================
const initSkeletonLoading = () => {
    // Configuration
    const config = {
        fadeOutDuration: 400,    // Duration for skeleton fade-out in ms
        revealDelay: 100,        // Delay before revealing content
        observerThreshold: 0.1,  // Intersection observer threshold
        observerRootMargin: '50px 0px' // Preload content slightly before visible
    };

    // Track skeleton state
    let skeletonsHidden = false;

    /**
     * Hide all skeleton elements and reveal content
     * Called when page is fully loaded
     */
    const hideSkeletons = () => {
        if (skeletonsHidden) return;
        skeletonsHidden = true;

        // Add loaded class to body (ensures CSS rules hide skeletons)
        document.body.classList.add('loaded');

        // Find all skeleton content wrappers and reveal them
        const skeletonContents = document.querySelectorAll('.skeleton-content');
        skeletonContents.forEach((content, index) => {
            // Stagger the reveal for a nicer effect
            setTimeout(() => {
                content.classList.add('content-revealed');
            }, index * 50);
        });

        // Find all skeleton overlays and fade them out
        const skeletonOverlays = document.querySelectorAll('.skeleton-overlay');
        skeletonOverlays.forEach(overlay => {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });

        // Announce to screen readers that content is loaded
        if (typeof window.announceToScreenReader === 'function') {
            window.announceToScreenReader('Page content loaded');
        }
    };

    /**
     * Create intersection observer for lazy skeleton reveal
     * Reveals content sections as they come into view
     */
    const createSkeletonObserver = () => {
        const observerOptions = {
            threshold: config.observerThreshold,
            rootMargin: config.observerRootMargin
        };

        const skeletonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const wrapper = entry.target;

                    // Add reveal class with slight delay for smoother transition
                    setTimeout(() => {
                        wrapper.classList.add('content-revealed');

                        // If wrapper has skeleton overlay, hide it
                        const overlay = wrapper.querySelector('.skeleton-overlay');
                        if (overlay) {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                overlay.style.visibility = 'hidden';
                            }, config.fadeOutDuration);
                        }
                    }, config.revealDelay);

                    // Stop observing once revealed
                    skeletonObserver.unobserve(wrapper);
                }
            });
        }, observerOptions);

        // Observe all skeleton wrappers
        const skeletonWrappers = document.querySelectorAll('.skeleton-wrapper');
        skeletonWrappers.forEach(wrapper => {
            skeletonObserver.observe(wrapper);
        });

        return skeletonObserver;
    };

    /**
     * Generate skeleton placeholder HTML for common patterns
     * Can be used dynamically to create skeleton placeholders
     */
    window.createSkeletonPlaceholder = (type, options = {}) => {
        const defaults = {
            lines: 3,
            showIcon: true,
            showButton: false
        };
        const config = { ...defaults, ...options };

        switch (type) {
            case 'card':
                return `
                    <div class="skeleton-card">
                        ${config.showIcon ? '<div class="skeleton-card-icon"></div>' : ''}
                        <div class="skeleton-card-title"></div>
                        ${Array(config.lines).fill('<div class="skeleton-card-text"></div>').join('')}
                        ${config.showButton ? '<div class="skeleton-button" style="margin-top: 1rem;"></div>' : ''}
                    </div>
                `;

            case 'text':
                return `
                    <div class="skeleton-text-block">
                        ${Array(config.lines).fill('<div class="skeleton-text"></div>').join('')}
                    </div>
                `;

            case 'hero':
                return `
                    <div class="skeleton-hero">
                        <div class="skeleton-hero-tag"></div>
                        <div class="skeleton-hero-title"></div>
                        <div class="skeleton-hero-title" style="width: 60%; height: 3rem;"></div>
                        <div class="skeleton-hero-subtitle"></div>
                        <div class="skeleton-hero-subtitle" style="width: 50%;"></div>
                        <div class="skeleton-hero-buttons">
                            <div class="skeleton-button"></div>
                            <div class="skeleton-button"></div>
                        </div>
                    </div>
                `;

            case 'stats':
                return `
                    <div class="skeleton-stats">
                        <div class="skeleton-stat">
                            <div class="skeleton-stat-value"></div>
                            <div class="skeleton-stat-label"></div>
                        </div>
                        <div class="skeleton-stat">
                            <div class="skeleton-stat-value"></div>
                            <div class="skeleton-stat-label"></div>
                        </div>
                        <div class="skeleton-stat">
                            <div class="skeleton-stat-value"></div>
                            <div class="skeleton-stat-label"></div>
                        </div>
                    </div>
                `;

            case 'image':
                return `<div class="skeleton-image ${options.variant || ''}"></div>`;

            case 'heading':
                return `<div class="skeleton-heading ${options.size || ''}"></div>`;

            default:
                return '<div class="skeleton"></div>';
        }
    };

    /**
     * Programmatically show skeleton for an element
     * Useful for async content loading
     */
    window.showSkeletonFor = (element, type = 'card', options = {}) => {
        if (!element) return;

        // Create wrapper if not exists
        let wrapper = element.closest('.skeleton-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'skeleton-wrapper';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        }

        // Add skeleton overlay
        const overlay = document.createElement('div');
        overlay.className = 'skeleton-overlay';
        overlay.innerHTML = window.createSkeletonPlaceholder(type, options);
        wrapper.insertBefore(overlay, wrapper.firstChild);

        // Mark content as hidden
        element.classList.add('skeleton-content');
        wrapper.classList.remove('content-revealed');

        return wrapper;
    };

    /**
     * Hide skeleton for an element (reveal content)
     */
    window.hideSkeletonFor = (element) => {
        if (!element) return;

        const wrapper = element.closest('.skeleton-wrapper');
        if (!wrapper) return;

        wrapper.classList.add('content-revealed');

        const overlay = wrapper.querySelector('.skeleton-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
            }, config.fadeOutDuration);
        }
    };

    // Initialize on DOMContentLoaded
    const init = () => {
        // Create intersection observer for lazy reveal
        createSkeletonObserver();

        // Ensure skeletons are hidden after a maximum wait time
        // This is a fallback in case load event doesn't fire
        const maxWaitTime = 5000; // 5 seconds max
        const fallbackTimeout = setTimeout(() => {
            if (!skeletonsHidden) {
                console.warn('Skeleton loading: Fallback triggered after max wait time');
                hideSkeletons();
            }
        }, maxWaitTime);

        // Hide skeletons when page is fully loaded
        if (document.readyState === 'complete') {
            hideSkeletons();
            clearTimeout(fallbackTimeout);
        } else {
            window.addEventListener('load', () => {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    hideSkeletons();
                    clearTimeout(fallbackTimeout);
                }, config.revealDelay);
            });
        }
    };

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose hideSkeletons for manual control
    window.hideAllSkeletons = hideSkeletons;
};

// Initialize skeleton loading system
initSkeletonLoading();

// =============================================
// View Transitions API - Smooth Page Navigation
// =============================================
const initViewTransitions = () => {
    // Check for View Transitions API support
    const supportsViewTransitions = 'startViewTransition' in document;
    
    // Store navigation state
    let isNavigating = false;
    
    /**
     * Check if a link is an internal navigation link
     * @param {HTMLAnchorElement} link - The link element to check
     * @returns {boolean} - Whether the link is internal and should use view transitions
     */
    const isInternalLink = (link) => {
        // Check if it's an anchor element
        if (!link || link.tagName !== 'A') return false;
        
        const href = link.getAttribute('href');
        if (!href) return false;
        
        // Skip if link has target="_blank" or download attribute
        if (link.target === '_blank' || link.hasAttribute('download')) return false;
        
        // Skip external links
        if (href.startsWith('http://') || href.startsWith('https://')) {
            try {
                const linkUrl = new URL(href);
                const currentUrl = new URL(window.location.href);
                if (linkUrl.origin !== currentUrl.origin) return false;
            } catch (e) {
                return false;
            }
        }
        
        // Skip anchor-only links (same page navigation)
        if (href.startsWith('#')) return false;
        
        // Skip javascript: links
        if (href.startsWith('javascript:')) return false;
        
        // Skip mailto: and tel: links
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
        
        // Skip links with data-no-transition attribute
        if (link.hasAttribute('data-no-transition')) return false;
        
        return true;
    };
    
    /**
     * Navigate to a new page with view transition
     * @param {string} url - The URL to navigate to
     */
    const navigateWithTransition = async (url) => {
        // Prevent multiple simultaneous navigations
        if (isNavigating) return;
        isNavigating = true;
        
        // Add navigating class to body for additional styling
        document.body.classList.add('view-transitioning');
        
        try {
            if (supportsViewTransitions) {
                // Use View Transitions API
                const transition = document.startViewTransition(async () => {
                    // Fetch the new page
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Navigation failed');
                    
                    const html = await response.text();
                    const parser = new DOMParser();
                    const newDoc = parser.parseFromString(html, 'text/html');
                    
                    // Update the document title
                    document.title = newDoc.title;
                    
                    // Update the main content
                    const newMain = newDoc.querySelector('main');
                    const currentMain = document.querySelector('main');
                    if (newMain && currentMain) {
                        currentMain.innerHTML = newMain.innerHTML;
                    }
                    
                    // Update active nav link
                    updateActiveNavLink(url);
                    
                    // Update the URL in browser history
                    window.history.pushState({}, '', url);
                    
                    // Re-initialize any necessary scripts for new content
                    reinitializeScripts();
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'instant' });
                });
                
                // Wait for the transition to complete
                await transition.finished;
            } else {
                // Fallback: traditional navigation with fade effect
                document.body.classList.add('page-transitioning');
                
                await new Promise(resolve => setTimeout(resolve, 300));
                
                window.location.href = url;
                return; // Page will reload, no need to continue
            }
        } catch (error) {
            console.error('View transition error:', error);
            // Fallback to traditional navigation
            window.location.href = url;
        } finally {
            isNavigating = false;
            document.body.classList.remove('view-transitioning');
        }
    };
    
    /**
     * Update the active nav link based on current URL
     * @param {string} url - The current URL
     */
    const updateActiveNavLink = (url) => {
        const navLinks = document.querySelectorAll('.nav-link');
        const pathname = url.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const isActive = linkHref === pathname || 
                           (pathname === '' && linkHref === 'index.html') ||
                           (pathname === '/' && linkHref === 'index.html');
            
            link.classList.toggle('active', isActive);
            
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };
    
    /**
     * Re-initialize scripts for dynamically loaded content
     */
    const reinitializeScripts = () => {
        // Re-observe elements for fade-in animations
        const fadeElements = document.querySelectorAll('.prop-card, .principle-item, .solution-card, .case-study-card');
        fadeElements.forEach(el => {
            if (!prefersReducedMotion) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                // Use intersection observer for reveal
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                revealObserver.observe(el);
            }
        });
        
        // Re-add smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Re-initialize form enhancements if forms exist
        if (typeof initFormEnhancements === 'function') {
            initFormEnhancements();
        }
        
        // Update scroll progress
        window.dispatchEvent(new Event('scroll'));
        
        // Announce page change to screen readers
        if (typeof window.announceToScreenReader === 'function') {
            window.announceToScreenReader('Page content updated');
        }
    };
    
    /**
     * Handle click events on navigation links
     * @param {MouseEvent} event - The click event
     */
    const handleLinkClick = (event) => {
        // Only handle left-clicks without modifier keys
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }
        
        // Find the closest anchor element
        const link = event.target.closest('a');
        
        if (isInternalLink(link)) {
            event.preventDefault();
            const href = link.getAttribute('href');
            
            // Check if navigating to current page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const targetPage = href.split('/').pop() || 'index.html';
            
            if (currentPage !== targetPage) {
                navigateWithTransition(href);
            }
        }
    };
    
    /**
     * Handle browser back/forward navigation
     * @param {PopStateEvent} event - The popstate event
     */
    const handlePopState = (event) => {
        const url = window.location.href;
        
        if (supportsViewTransitions) {
            document.startViewTransition(async () => {
                // Fetch and update content for back/forward navigation
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Navigation failed');
                    
                    const html = await response.text();
                    const parser = new DOMParser();
                    const newDoc = parser.parseFromString(html, 'text/html');
                    
                    document.title = newDoc.title;
                    
                    const newMain = newDoc.querySelector('main');
                    const currentMain = document.querySelector('main');
                    if (newMain && currentMain) {
                        currentMain.innerHTML = newMain.innerHTML;
                    }
                    
                    updateActiveNavLink(url);
                    reinitializeScripts();
                    window.scrollTo({ top: 0, behavior: 'instant' });
                } catch (error) {
                    console.error('PopState transition error:', error);
                    window.location.reload();
                }
            });
        } else {
            // Without View Transitions API, just reload
            window.location.reload();
        }
    };
    
    // Set up event listeners
    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);
    
    // Add CSS for transition states if not already present
    if (!document.getElementById('view-transition-states')) {
        const transitionStyles = document.createElement('style');
        transitionStyles.id = 'view-transition-states';
        transitionStyles.textContent = `
            /* Body transitioning state */
            body.view-transitioning {
                cursor: wait;
            }
            
            body.view-transitioning * {
                pointer-events: none;
            }
            
            body.view-transitioning .nav,
            body.view-transitioning .nav * {
                pointer-events: auto;
            }
            
            /* Fallback transition for non-supporting browsers */
            body.page-transitioning {
                opacity: 0;
                transition: opacity 0.3s ease-out;
            }
            
            /* Loading indicator during transition */
            body.view-transitioning::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--bitcoin, #F7931A), var(--solana, #9945FF));
                z-index: 10000;
                animation: viewTransitionProgress 0.8s ease-out forwards;
            }
            
            @keyframes viewTransitionProgress {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(transitionStyles);
    }
    
    // Log support status for debugging
    if (supportsViewTransitions) {
        console.log('View Transitions API: Enabled');
    } else {
        console.log('View Transitions API: Using fallback transitions');
    }
    
    // Expose navigation function globally for programmatic use
    window.navigateWithTransition = navigateWithTransition;
};

// Initialize View Transitions
// Check if reduced motion is preferred before initializing
if (!prefersReducedMotion) {
    initViewTransitions();
} else {
    console.log('View Transitions API: Disabled due to reduced motion preference');
}

// =============================================
// View Transitions: Page Load Animation
// =============================================
const initPageEntryAnimation = () => {
    // Skip if user prefers reduced motion
    if (prefersReducedMotion) {
        document.body.classList.add('page-loaded');
        return;
    }
    
    // Check for View Transitions API support
    const supportsViewTransitions = 'startViewTransition' in document;
    
    if (!supportsViewTransitions) {
        // Fallback: Add classes for CSS-based entry animation
        document.body.classList.add('page-loaded');
        
        // Stagger reveal elements
        const staggerElements = document.querySelectorAll(
            '.hero-content, .about-hero, .contact-hero, .requests-hero, ' +
            '.hero-section, .section-header, .prop-card, .solution-card'
        );
        
        staggerElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
};

// Run page entry animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageEntryAnimation);
} else {
    initPageEntryAnimation();
}

// =============================================
// Tech Stack Flip Cards - Interactive Functionality
// =============================================
const initTechStackFlipCards = () => {
    const flipCards = document.querySelectorAll('.tech-flip-card');
    const connectionsContainer = document.querySelector('.tech-connections');

    if (flipCards.length === 0) return;

    // Detect if device uses touch/coarse pointer (mobile/tablet)
    const isTouchDevice = () => {
        return window.matchMedia('(hover: none)').matches ||
               window.matchMedia('(pointer: coarse)').matches;
    };

    // Click/tap handler for mobile devices
    const handleFlipClick = (event) => {
        const card = event.currentTarget;

        // On touch devices, toggle the flipped state
        if (isTouchDevice()) {
            // Close other flipped cards first
            flipCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('flipped')) {
                    otherCard.classList.remove('flipped');
                }
            });

            card.classList.toggle('flipped');

            // Update connection lines
            updateConnectionLines(card);
        }
    };

    // Keyboard handler for accessibility
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const card = event.currentTarget;

            // Toggle flip state
            card.classList.toggle('flipped');

            // Announce state change to screen readers
            const techName = card.querySelector('.tech-name')?.textContent || 'Technology';
            const isFlipped = card.classList.contains('flipped');
            const message = isFlipped
                ? `${techName} card flipped. Now showing details.`
                : `${techName} card flipped back. Now showing front.`;

            if (typeof window.announceToScreenReader === 'function') {
                window.announceToScreenReader(message);
            }

            // Update connection lines
            updateConnectionLines(card);
        }
    };

    // Highlight related technologies on hover/focus
    const highlightRelated = (card, shouldHighlight) => {
        const relatedTechs = card.dataset.related?.split(',') || [];

        relatedTechs.forEach(techId => {
            const relatedCard = document.querySelector(`[data-tech="${techId.trim()}"]`);
            if (relatedCard) {
                if (shouldHighlight) {
                    relatedCard.classList.add('related');
                } else {
                    relatedCard.classList.remove('related');
                }
            }
        });

        // Update connection lines
        if (shouldHighlight) {
            showConnectionLines(card);
        } else {
            hideConnectionLines();
        }
    };

    // Get center position of a card
    const getCardCenter = (card) => {
        const rect = card.getBoundingClientRect();
        const containerRect = connectionsContainer?.getBoundingClientRect();

        if (!containerRect) return null;

        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
        };
    };

    // Show connection lines between related technologies
    const showConnectionLines = (hoveredCard) => {
        if (!connectionsContainer) return;

        const techId = hoveredCard.dataset.tech;
        const lines = connectionsContainer.querySelectorAll('.tech-connection-line');

        lines.forEach(line => {
            const fromTech = line.dataset.from;
            const toTech = line.dataset.to;

            // Check if this line connects to the hovered card
            if (fromTech === techId || toTech === techId) {
                const fromCard = document.querySelector(`[data-tech="${fromTech}"]`);
                const toCard = document.querySelector(`[data-tech="${toTech}"]`);

                if (fromCard && toCard) {
                    const fromCenter = getCardCenter(fromCard);
                    const toCenter = getCardCenter(toCard);

                    if (fromCenter && toCenter) {
                        line.setAttribute('x1', fromCenter.x);
                        line.setAttribute('y1', fromCenter.y);
                        line.setAttribute('x2', toCenter.x);
                        line.setAttribute('y2', toCenter.y);
                        line.classList.add('active');
                    }
                }
            }
        });
    };

    // Hide all connection lines
    const hideConnectionLines = () => {
        if (!connectionsContainer) return;

        const lines = connectionsContainer.querySelectorAll('.tech-connection-line');
        lines.forEach(line => {
            line.classList.remove('active');
        });
    };

    // Update connection lines for a card (when flipped)
    const updateConnectionLines = (card) => {
        if (card.classList.contains('flipped')) {
            highlightRelated(card, true);
        } else {
            highlightRelated(card, false);
        }
    };

    // Handle window resize (recalculate line positions)
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const flippedCard = document.querySelector('.tech-flip-card.flipped');
            if (flippedCard) {
                updateConnectionLines(flippedCard);
            }
        }, 100);
    };

    // Attach event listeners to each card
    flipCards.forEach(card => {
        // Click/tap handler
        card.addEventListener('click', handleFlipClick);

        // Keyboard accessibility
        card.addEventListener('keydown', handleKeyDown);

        // Mouse hover handlers (for desktop)
        card.addEventListener('mouseenter', () => {
            if (!isTouchDevice()) {
                highlightRelated(card, true);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!isTouchDevice()) {
                highlightRelated(card, false);
            }
        });

        // Focus handlers for keyboard navigation
        card.addEventListener('focus', () => {
            highlightRelated(card, true);
        });

        card.addEventListener('blur', () => {
            // Only remove highlight if not flipped
            if (!card.classList.contains('flipped')) {
                highlightRelated(card, false);
            }
        });
    });

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Click outside to close flipped cards on mobile
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.tech-flip-card')) {
            flipCards.forEach(card => {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                    highlightRelated(card, false);
                }
            });
        }
    });

    // Close flipped cards on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            flipCards.forEach(card => {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                    highlightRelated(card, false);
                }
            });
        }
    });

    console.log('Tech Stack Flip Cards: Initialized');
};

// Initialize tech stack flip cards when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechStackFlipCards);
} else {
    initTechStackFlipCards();
}
