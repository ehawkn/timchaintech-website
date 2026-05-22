/* Timechain — site.js
   Minimal vanilla JS. Mobile nav + active-link highlighting. */
(function () {
  'use strict';

  // Mobile nav toggle
  const burger = document.querySelector('.topbar__burger');
  const topbar = document.querySelector('.topbar');
  if (burger && topbar) {
    burger.addEventListener('click', function () {
      topbar.classList.toggle('is-open');
      const isOpen = topbar.classList.contains('is-open');
      burger.setAttribute('aria-expanded', isOpen);
      burger.textContent = isOpen ? '✕ Close' : '☰ Menu';
    });
  }

  // Highlight current-page nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topbar__nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('is-current');
    }
  });

  // Encode inquiry-type into mailto subject on contact form
  const form = document.querySelector('form[data-mailto]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const org = (data.get('organization') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const inquiry = (data.get('inquiry') || 'General inquiry').toString();
      const message = (data.get('message') || '').toString().trim();

      const subject = '[Timechain] ' + inquiry + (org ? ' — ' + org : '');
      const body = [
        'Name: ' + name,
        'Organization: ' + org,
        'Email: ' + email,
        'Phone: ' + phone,
        'Inquiry type: ' + inquiry,
        '',
        'Message:',
        message
      ].join('\n');

      const to = form.getAttribute('data-mailto');
      const href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = href;
    });
  }
})();
