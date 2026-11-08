/* ═══════════════════════════════════════════
   B2 English Grammar — Shared JavaScript
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sidebar scroll-spy ─────────────────── */
  function initScrollSpy() {
    const navItems = document.querySelectorAll('nav.sidebar .nav-item[href^="#"]');
    const sections = document.querySelectorAll('.section[id]');
    if (!navItems.length || !sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navItems.forEach(item => {
              item.classList.toggle('active', item.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -40% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ── Smooth scroll for sidebar links ───── */
  function initSmoothScroll() {
    document.querySelectorAll('nav.sidebar .nav-item[href^="#"]').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const id = item.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── Mark active page in sidebar (cross-page nav) ── */
  function markActivePage() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav.sidebar .nav-item[href]').forEach(item => {
      const href = item.getAttribute('href');
      if (!href.startsWith('#') && href === currentFile) {
        item.classList.add('active');
      }
    });
  }

  /* ── Keyboard navigation (←/→ for prev/next page) ── */
  function initKeyNav() {
    const prevBtn = document.querySelector('.page-nav-btn.prev');
    const nextBtn = document.querySelector('.page-nav-btn.next');
    if (!prevBtn && !nextBtn) return;

    document.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft' && prevBtn) window.location = prevBtn.href;
      if (e.key === 'ArrowRight' && nextBtn) window.location = nextBtn.href;
    });
  }

  /* ── Init ─────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initSmoothScroll();
    markActivePage();
    initKeyNav();
  });
})();
