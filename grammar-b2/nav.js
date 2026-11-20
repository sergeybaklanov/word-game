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

  /* ── Build index-card markup from topic data ──── */
  function buildIndexCard(topic) {
    const a = document.createElement('a');
    a.className = 'index-card';
    a.href = topic.slug + '.html';

    const tag = document.createElement('div');
    tag.className = 'index-card-tag';
    tag.textContent = topic.cardTag;

    const title = document.createElement('div');
    title.className = 'index-card-title';
    title.textContent = topic.cardTitle;

    const desc = document.createElement('div');
    desc.className = 'index-card-desc';
    desc.textContent = topic.cardDesc;

    const arrow = document.createElement('div');
    arrow.className = 'index-card-arrow';
    arrow.textContent = '→';

    a.appendChild(tag);
    a.appendChild(title);
    a.appendChild(desc);
    a.appendChild(arrow);
    return a;
  }

  /* ── Build a page-nav-btn (prev/next) from topic data ── */
  function buildPageNavBtn(cls, href, dir, label) {
    const a = document.createElement('a');
    a.className = cls;
    a.href = href;

    const dirDiv = document.createElement('div');
    dirDiv.className = 'page-nav-dir';
    dirDiv.textContent = dir;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'page-nav-label';
    labelDiv.textContent = label;

    a.appendChild(dirDiv);
    a.appendChild(labelDiv);
    return a;
  }

  /* ── Render sidebar nav items from GRAMMAR_B2_TOPICS ── */
  function renderSidebarTopics() {
    const sidebar = document.querySelector('nav.sidebar');
    if (!sidebar) return;

    const frag = document.createDocumentFragment();
    let lastGroup = null;
    GRAMMAR_B2_TOPICS.forEach(topic => {
      if (topic.navGroup !== lastGroup) {
        const label = document.createElement('div');
        label.className = 'nav-group-label';
        label.textContent = topic.navGroup;
        frag.appendChild(label);
        lastGroup = topic.navGroup;
      }
      const link = document.createElement('a');
      link.className = 'nav-item';
      link.href = topic.slug + '.html';
      link.textContent = topic.navLabel;
      frag.appendChild(link);
    });
    sidebar.appendChild(frag);

    markActivePage();

    /* In-page TOC anchors under the active sidebar item. Labels come
       from the matching topic's `toc` data (the original hardcoded
       anchor text) when present; otherwise fall back to deriving the
       label from each page's own .section-title element. */
    const activeItem = sidebar.querySelector('.nav-item.active');
    if (activeItem) {
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      const currentTopic = GRAMMAR_B2_TOPICS.find(t => t.slug + '.html' === currentFile);
      const sections = document.querySelectorAll('main .section[id]');
      let afterEl = activeItem;
      sections.forEach(section => {
        let label;
        const tocEntry = currentTopic && currentTopic.toc
          ? currentTopic.toc.find(t => t.id === section.id)
          : null;
        if (tocEntry) {
          label = tocEntry.label;
        } else {
          const titleEl = section.querySelector('.section-title');
          label = titleEl ? titleEl.textContent : section.id;
        }
        const anchor = document.createElement('a');
        anchor.className = 'nav-item';
        anchor.setAttribute('href', '#' + section.id);
        anchor.setAttribute('style', 'padding-left:36px;font-size:12px');
        anchor.textContent = label;
        afterEl.insertAdjacentElement('afterend', anchor);
        afterEl = anchor;
      });
    }
  }

  /* ── Render prev/next page-nav buttons from GRAMMAR_B2_TOPICS ── */
  function renderPrevNext() {
    const pageNav = document.querySelector('.page-nav');
    if (!pageNav) return;

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const idx = GRAMMAR_B2_TOPICS.findIndex(t => t.slug + '.html' === currentFile);
    if (idx === -1) { console.warn('[nav.js] current page not found in GRAMMAR_B2_TOPICS:', currentFile); return; }

    if (idx > 0) {
      const prev = GRAMMAR_B2_TOPICS[idx - 1];
      pageNav.appendChild(buildPageNavBtn('page-nav-btn prev', prev.slug + '.html', '← Previous', prev.navLabel));
    } else {
      /* No prev button on the first topic — keep an empty placeholder
         so the 2-column page-nav grid still pushes "Next" into column 2. */
      pageNav.appendChild(document.createElement('div'));
    }

    if (idx < GRAMMAR_B2_TOPICS.length - 1) {
      const next = GRAMMAR_B2_TOPICS[idx + 1];
      pageNav.appendChild(buildPageNavBtn('page-nav-btn next', next.slug + '.html', 'Next →', next.navLabel));
    } else {
      pageNav.appendChild(buildPageNavBtn('page-nav-btn next', 'index.html', 'Back to', 'All Topics'));
    }
  }

  /* ── Render index cards (index.html) from GRAMMAR_B2_TOPICS ── */
  function renderIndexCards() {
    const content = document.querySelector('.index-content');
    if (!content) return;

    const frag = document.createDocumentFragment();
    let lastGroup = null;
    let grid = null;

    GRAMMAR_B2_TOPICS.forEach(topic => {
      if (topic.indexGroup !== lastGroup) {
        const label = document.createElement('div');
        label.className = 'index-group-label';
        label.textContent = topic.indexGroup;
        frag.appendChild(label);

        grid = document.createElement('div');
        grid.className = 'index-grid';
        frag.appendChild(grid);

        lastGroup = topic.indexGroup;
      }
      grid.appendChild(buildIndexCard(topic));
    });

    content.insertBefore(frag, content.firstChild);
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
    if (typeof GRAMMAR_B2_TOPICS !== 'undefined') {
      renderSidebarTopics();
      renderPrevNext();
      renderIndexCards();
    }
    initScrollSpy();
    initSmoothScroll();
    initKeyNav();
  });
})();
