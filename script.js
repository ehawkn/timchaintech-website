// =============================================
// Reduced Motion Preference
// =============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    document.documentElement.classList.toggle('reduce-motion', e.matches);
});

if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
}

// =============================================
// 🎮 Console Messages for Developers
// =============================================
console.log('%c⛓️ TimeChainTech', 'font-size: 24px; font-weight: bold; color: #D4AF37; text-shadow: 2px 2px 0 #2DD4BF;');
console.log('%c"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"', 'font-style: italic; color: #888;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D4AF37;');
console.log('%cWelcome, fellow builder. 🔨', 'color: #2DD4BF; font-size: 14px;');
console.log('%cLooking for the source? We appreciate your curiosity.', 'color: #888;');
console.log('%cIf you find any bugs, they\'re actually features in the timechain. 😉', 'color: #888;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D4AF37;');
console.log('%cTip: Try the Konami code... ↑↑↓↓←→←→BA', 'color: #D4AF37; font-size: 12px;');

// =============================================
// 🎹 Konami Code Easter Egg
// =============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    console.log('%c🎉 KONAMI CODE ACTIVATED!', 'font-size: 20px; color: #D4AF37;');

    // Create Satoshi mode overlay
    const overlay = document.createElement('div');
    overlay.id = 'satoshi-mode';
    overlay.innerHTML = `
        <div class="satoshi-content">
            <div class="satoshi-symbol">₿</div>
            <h2>Satoshi Mode Activated</h2>
            <p class="satoshi-quote">"If you don't believe it or don't get it, I don't have the time to try to convince you, sorry."</p>
            <p class="satoshi-attribution">— Satoshi Nakamoto, 2010</p>
            <button class="satoshi-close">Continue Building →</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => overlay.classList.add('active'), 10);

    // Close button
    overlay.querySelector('.satoshi-close').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 500);
    });

    // Also close on escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
}

// =============================================
// 📊 Scroll Progress Bar
// =============================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const bar = progressBar.querySelector('.scroll-progress-bar');

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
};

// =============================================
// ⬆️ Back to Top Button
// =============================================
const createBackToTop = () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    const toggleVisibility = () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
};

// =============================================
// 🔐 Live Hash Visualizer
// =============================================
const initHashVisualizer = () => {
    const container = document.getElementById('hash-visualizer');
    if (!container) return;

    const input = container.querySelector('.hash-input');
    const output = container.querySelector('.hash-output');

    if (!input || !output) return;

    const updateHash = async () => {
        const text = input.value || 'TimeChainTech';
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Animate the hash output
            output.classList.add('updating');
            setTimeout(() => {
                output.textContent = hashHex;
                output.classList.remove('updating');
            }, 150);
        } catch (e) {
            output.textContent = 'Hashing not supported in this context';
        }
    };

    input.addEventListener('input', updateHash);
    updateHash();
};

// =============================================
// ⛓️ Animated Timechain Visualization
// =============================================
const initTimechain = () => {
    const container = document.getElementById('timechain-visual');
    if (!container) return;

    let blockCount = 0;
    const maxBlocks = 6;

    const createBlock = () => {
        blockCount++;
        const block = document.createElement('div');
        block.className = 'chain-block';
        block.innerHTML = `
            <div class="block-number">#${blockCount}</div>
            <div class="block-hash">${generateMiniHash()}</div>
            <div class="block-time">${new Date().toLocaleTimeString()}</div>
        `;

        // Add connecting chain
        if (container.children.length > 0) {
            const chain = document.createElement('div');
            chain.className = 'chain-link';
            chain.innerHTML = '⟷';
            container.appendChild(chain);
        }

        container.appendChild(block);

        // Animate in
        setTimeout(() => block.classList.add('mined'), 50);

        // Remove old blocks if too many
        while (container.children.length > maxBlocks * 2 - 1) {
            container.removeChild(container.firstChild);
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    };

    // Generate mini hash for display
    const generateMiniHash = () => {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 8; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash + '...';
    };

    // Start the chain
    createBlock();

    // Mine new blocks periodically
    if (!prefersReducedMotion) {
        setInterval(createBlock, 4000);
    }
};

// =============================================
// 📜 Satoshi Quote Rotator
// =============================================
const satoshiQuotes = [
    "The root problem with conventional currency is all the trust that's required to make it work.",
    "It might make sense just to get some in case it catches on.",
    "Lost coins only make everyone else's coins worth slightly more.",
    "The nature of Bitcoin is such that once version 0.1 was released, the core design was set in stone for the rest of its lifetime.",
    "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
];

const initQuoteRotator = () => {
    const quoteEl = document.getElementById('satoshi-quote');
    if (!quoteEl) return;

    let currentQuote = 0;

    const showNextQuote = () => {
        quoteEl.classList.add('fading');
        setTimeout(() => {
            quoteEl.textContent = `"${satoshiQuotes[currentQuote]}"`;
            quoteEl.classList.remove('fading');
            currentQuote = (currentQuote + 1) % satoshiQuotes.length;
        }, 500);
    };

    showNextQuote();
    setInterval(showNextQuote, 8000);
};

// =============================================
// ⏱️ Block Time Counter
// =============================================
const initBlockCounter = () => {
    const counter = document.getElementById('block-counter');
    if (!counter) return;

    // Bitcoin genesis block timestamp: January 3, 2009, 18:15:05 UTC
    const genesisTime = new Date('2009-01-03T18:15:05Z').getTime();

    const updateCounter = () => {
        const now = Date.now();
        const elapsed = now - genesisTime;

        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        counter.innerHTML = `
            <span class="counter-value">${days.toLocaleString()}</span> days,
            <span class="counter-value">${hours}</span>h
            <span class="counter-value">${minutes}</span>m
            <span class="counter-value">${seconds}</span>s
            <span class="counter-label">since genesis block</span>
        `;
    };

    updateCounter();
    setInterval(updateCounter, 1000);
};

// =============================================
// Initialize Everything
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    createBackToTop();
    initHashVisualizer();
    initTimechain();
    initQuoteRotator();
    initBlockCounter();
});

// =============================================
// Smooth Scroll for Anchor Links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// =============================================
// Active Navigation Highlighting
// =============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// =============================================
// Simple Fade-in on Scroll
// =============================================
if (!prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.prop-card, .principle-item, .solution-card').forEach(el => {
            el.classList.add('fade-in');
            fadeObserver.observe(el);
        });
    });
}

// =============================================
// Mobile Menu Toggle
// =============================================
const initMobileMenu = () => {
    const nav = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    if (!nav || !navLinks || window.innerWidth > 768) return;

    // Only create if doesn't exist
    if (document.querySelector('.menu-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
};

initMobileMenu();
window.addEventListener('resize', initMobileMenu);

// =============================================
// Basic Form Validation
// =============================================
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            const value = field.value.trim();
            field.classList.remove('invalid');

            if (!value) {
                isValid = false;
                field.classList.add('invalid');
            } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                field.classList.add('invalid');
            }
        });

        if (isValid) {
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } else {
            showNotification('Please fill in all required fields correctly.', 'error');
        }
    });
});

// =============================================
// Simple Notification
// =============================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
