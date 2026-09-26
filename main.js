(() => {
  const root = document.documentElement;
  const heroStage = document.querySelector('.hero-stage');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let ticking = false;

  function clamp(v, min = 0, max = 1) {
    return Math.min(max, Math.max(min, v));
  }

  function resetHero() {
    root.style.setProperty('--hero-progress', '0');
    root.style.setProperty('--hero-layer-air-x', '150vw');
    root.style.setProperty('--hero-layer-main-x', '164vw');
    root.style.setProperty('--hero-layer-deep-x', '178vw');
    root.style.setProperty('--hero-layer-air-opacity', '0');
    root.style.setProperty('--hero-layer-main-opacity', '0');
    root.style.setProperty('--hero-layer-deep-opacity', '0');
    root.style.setProperty('--hero-content-opacity', '1');
    root.style.setProperty('--hero-mist-a-opacity', '.72');
    root.style.setProperty('--hero-mist-a-x', '0vw');
    root.style.setProperty('--hero-mist-a-y', '0vh');
    root.style.setProperty('--hero-mist-a-scale', '1');
    root.style.setProperty('--hero-mist-b-scale', '1');
    root.style.setProperty('--philosophy-opacity', '0');
    root.style.setProperty('--philosophy-y', '0px');
  }

  function updateHero() {
    if (!heroStage) return;

    const rect = heroStage.getBoundingClientRect();
    const scrolledInsideStage = Math.max(0, -rect.top);
    const totalTravel = Math.max(1, heroStage.offsetHeight - window.innerHeight);
    const progress = clamp(scrolledInsideStage / totalTravel);

    if (reduced.matches) {
      const showPhilosophy = progress >= 0.5;
      root.style.setProperty('--hero-layer-air-x', showPhilosophy ? '0vw' : '150vw');
      root.style.setProperty('--hero-layer-main-x', showPhilosophy ? '0vw' : '164vw');
      root.style.setProperty('--hero-layer-deep-x', showPhilosophy ? '0vw' : '178vw');
      root.style.setProperty('--hero-layer-air-opacity', showPhilosophy ? '1' : '0');
      root.style.setProperty('--hero-layer-main-opacity', showPhilosophy ? '1' : '0');
      root.style.setProperty('--hero-layer-deep-opacity', showPhilosophy ? '1' : '0');
      root.style.setProperty('--hero-content-opacity', '1');
      root.style.setProperty('--philosophy-opacity', showPhilosophy ? '1' : '0');
      root.style.setProperty('--philosophy-y', '0px');
      document.body.classList.toggle('hero-is-cobalt', showPhilosophy);
      return;
    }

    // The existing blue atmosphere reacts first. Large BLUE LAYERS then drift
    // in from outside the viewport, so there is no visible geometric origin or
    // obvious "animation start" point.
    const smoothstep = (t) => t * t * (3 - 2 * t);

    const airStart = 0.08;
    const airEnd = 0.70;
    const airProgress = clamp((progress - airStart) / (airEnd - airStart));
    const airEase = smoothstep(airProgress);

    const mainStart = 0.15;
    const mainEnd = 0.82;
    const mainProgress = clamp((progress - mainStart) / (mainEnd - mainStart));
    const mainEase = smoothstep(mainProgress);

    const deepStart = 0.27;
    const deepEnd = 0.94;
    const deepProgress = clamp((progress - deepStart) / (deepEnd - deepStart));
    const deepEase = smoothstep(deepProgress);

    // HERO copy remains stationary. The colour fields pass over the same canvas.
    const heroContentOpacity = 1;

    // PHILOSOPHY appears only after most of the HERO has become cobalt.
    const philosophyStart = 0.62;
    const philosophyEnd = 0.89;
    const philosophyProgress = clamp((progress - philosophyStart) / (philosophyEnd - philosophyStart));
    const philosophyEase = 1 - Math.pow(1 - philosophyProgress, 2.3);

    // The existing mist is the lead-in. It expands before the large surfaces are
    // consciously noticeable, making the transition feel continuous.
    const atmosphere = 1 - Math.pow(1 - progress, 1.55);

    const airX = 150 * (1 - airEase);
    const mainX = 164 * (1 - mainEase);
    const deepX = 178 * (1 - deepEase);

    root.style.setProperty('--hero-progress', atmosphere.toFixed(4));
    root.style.setProperty('--hero-layer-air-x', `${airX.toFixed(2)}vw`);
    root.style.setProperty('--hero-layer-main-x', `${mainX.toFixed(2)}vw`);
    root.style.setProperty('--hero-layer-deep-x', `${deepX.toFixed(2)}vw`);
    root.style.setProperty('--hero-layer-air-opacity', Math.min(1, airProgress * 1.35).toFixed(4));
    root.style.setProperty('--hero-layer-main-opacity', Math.min(1, mainProgress * 1.42).toFixed(4));
    root.style.setProperty('--hero-layer-deep-opacity', Math.min(1, deepProgress * 1.55).toFixed(4));
    root.style.setProperty('--hero-content-opacity', heroContentOpacity.toFixed(4));
    root.style.setProperty('--hero-mist-a-opacity', (.72 + .18 * atmosphere).toFixed(4));
    root.style.setProperty('--hero-mist-a-x', `${(-7.5 * atmosphere).toFixed(3)}vw`);
    root.style.setProperty('--hero-mist-a-y', `${(1.4 * atmosphere).toFixed(3)}vh`);
    root.style.setProperty('--hero-mist-a-scale', (1 + .78 * atmosphere).toFixed(4));
    root.style.setProperty('--hero-mist-b-scale', (1 + .48 * atmosphere).toFixed(4));
    root.style.setProperty('--philosophy-opacity', philosophyEase.toFixed(4));
    root.style.setProperty('--philosophy-y', '0px');

    document.body.classList.toggle('hero-is-cobalt', mainProgress > 0.54);
  }


  function updatePageThread() {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = clamp(window.scrollY / maxScroll);
    root.style.setProperty('--page-progress', progress.toFixed(4));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHero();
      updatePageThread();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduced.addEventListener?.('change', updateHero);
  updateHero();
  updatePageThread();

  const menuButton = document.querySelector('.menu-button');
  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
  });
})();
