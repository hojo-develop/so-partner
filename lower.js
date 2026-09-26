(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.service-hero, .lower-hero');
  const reveals = document.querySelectorAll('.reveal-item');
  let ticking = false;

  function clamp(v, min = 0, max = 1) { return Math.min(max, Math.max(min, v)); }

  function update() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--page-progress', clamp(window.scrollY / maxScroll).toFixed(4));

    if (hero && !reduced.matches) {
      const rect = hero.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, hero.offsetHeight));
      root.style.setProperty('--lower-layer-x', `${(-3.5 * p).toFixed(2)}vw`);
      root.style.setProperty('--lower-layer-y', `${(2.2 * p).toFixed(2)}vh`);
      root.style.setProperty('--lower-main-x', `${(-2.2 * p).toFixed(2)}vw`);
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  const menuButton = document.querySelector('.menu-button');
  const globalNav = document.querySelector('.global-nav');
  const mobileMenu = window.matchMedia('(max-width: 980px)');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  menuButton?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  globalNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  mobileMenu.addEventListener?.('change', (event) => { if (!event.matches) setMenu(false); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

(() => {
  const buttons = document.querySelectorAll('.works-filter button');
  const cards = document.querySelectorAll('.works-catalog .works-card');
  if (!buttons.length || !cards.length) return;
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      button.classList.add('is-active');
      const key = button.textContent.trim().toUpperCase();
      cards.forEach((card) => {
        if (key === 'ALL') { card.hidden = false; return; }
        const labels = Array.from(card.querySelectorAll('li')).map((li) => li.textContent.toUpperCase()).join(' ');
        const normalized = key === 'IMPROVEMENT' ? '改善' : key;
        card.hidden = !(labels.includes(key) || labels.includes(normalized));
      });
    });
  });
})();
