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
