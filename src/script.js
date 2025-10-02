(function () {
    function setActive() {
        try {
            const links = document.querySelectorAll('.nav-menu a');
            if (!links || links.length === 0) return;
            const current = window.location.pathname.replace(/\/$/, '');
            links.forEach(a => {
                a.classList.remove('active');
                try {
                    const resolved = new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/$/, '');
                    if (resolved === current || (resolved === '' && (current === '' || current === '/'))) {
                        a.classList.add('active')
                    }
                } catch (e) { }
            })
        } catch (e) { console.warn('setActive nav failed', e) }
    }

    function setupMobileToggle() {
        try {
            const navContainer = document.querySelector('.nav-container');
            if (!navContainer) return;

            function ensureToggle() {
                const existing = document.querySelector('.mobile-toggle');
                const isSmall = window.matchMedia('(max-width: 720px)').matches;
                if (isSmall && !existing) {
                    const btn = document.createElement('button');
                    btn.className = 'mobile-toggle';
                    btn.setAttribute('aria-label', 'Toggle navigation');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.innerHTML = '\u2630'; // simple hamburger
                    btn.addEventListener('click', () => {
                        const open = document.body.classList.toggle('nav-open');
                        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
                    });
                    navContainer.appendChild(btn);
                } else if (!isSmall && existing) {
                    existing.remove();
                    document.body.classList.remove('nav-open');
                }
            }

            ensureToggle();
            window.addEventListener('resize', ensureToggle);

            document.addEventListener('click', (e) => {
                if (!document.body.classList.contains('nav-open')) return;
                const menu = document.querySelector('.nav-menu');
                const toggle = document.querySelector('.mobile-toggle');
                if (!menu) return;
                if (e.target === toggle) return;
                if (menu.contains(e.target)) {
                    if (e.target.tagName === 'A') document.body.classList.remove('nav-open');
                    return;
                }
                if (!navContainer.contains(e.target)) document.body.classList.remove('nav-open');
            });
        } catch (e) { console.warn('mobile toggle setup failed', e) }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setActive();
        setupMobileToggle();
        if (document.body.classList.contains('nav-open') && !window.matchMedia('(max-width:720px)').matches) {
            document.body.classList.remove('nav-open');
        }
    });
})();
