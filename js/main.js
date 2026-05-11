(() => {
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const marker = document.getElementById('sideScrollMarker');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const heroImage = document.getElementById('heroImage');
  const heroSource = document.getElementById('heroImageSource');
  const siteLogo = document.getElementById('siteLogo');
  const logoSource = document.getElementById('logoSource');
  const footerLogo = document.getElementById('footerLogo');
  const footerLogoSource = document.getElementById('footerLogoSource');
  const scrollGraphics = [...document.querySelectorAll('[data-speed]')];

  const assets = {
    dia: {
      src: 'assets/imagens/isadora/isadora_1200.png',
      srcset: 'assets/imagens/isadora/isadora_300.png 300w, assets/imagens/isadora/isadora_600.png 600w, assets/imagens/isadora/isadora_1200.png 1200w',
      logo: 'assets/logos/logo_600x600.png',
      logoSrcset: 'assets/logos/logo_300x300.png 300w, assets/logos/logo_600x600.png 600w, assets/logos/logo_1200x1200.png 1200w'
    },
    noite: {
      src: 'assets/imagens/isadora/isadora_black_1200.png',
      srcset: 'assets/imagens/isadora/isadora_black_300.png 300w, assets/imagens/isadora/isadora_black_600.png 600w, assets/imagens/isadora/isadora_black_1200.png 1200w',
      logo: 'assets/logos/logo_white_600x600.png',
      logoSrcset: 'assets/logos/logo_white_300x300.png 300w, assets/logos/logo_white_600x600.png 600w, assets/logos/logo_white_1200x1200.png 1200w'
    }
  };

  function setVisualAssets(imageSet) {
    if (!imageSet) return;
    if (heroImage) {
      heroImage.src = imageSet.src;
      heroImage.srcset = imageSet.srcset;
      heroImage.sizes = '(max-width: 650px) 92vw, (max-width: 900px) 58vw, 45vw';
    }
    if (heroSource) {
      heroSource.srcset = imageSet.srcset;
      heroSource.sizes = '(max-width: 650px) 92vw, (max-width: 900px) 58vw, 45vw';
    }
    if (siteLogo) siteLogo.src = imageSet.logo;
    if (logoSource) logoSource.srcset = imageSet.logoSrcset;
    if (footerLogo) footerLogo.src = imageSet.logo;
    if (footerLogoSource) footerLogoSource.srcset = imageSet.logoSrcset;
  }

  function setThemeByHour() {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    body.classList.toggle('tema-dia', isDay);
    body.classList.toggle('tema-noite', !isDay);
    setVisualAssets(isDay ? assets.dia : assets.noite);
  }

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? scrollTop / max : 0;
    if (progress) progress.style.width = `${percent * 100}%`;
    if (marker) marker.style.transform = `translateY(${percent * (window.innerHeight * 0.6 - 44)}px)`;
    if (header) header.classList.toggle('is-scrolled', scrollTop > 20);
    updateScrollGraphics(scrollTop);
  }

  function updateScrollGraphics(scrollTop) {
    if (!scrollGraphics.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    scrollGraphics.forEach((item, index) => {
      const speed = Number(item.dataset.speed || 0);
      const rotate = Number(item.dataset.rotate || 0);
      const y = scrollTop * speed;
      const x = Math.sin((scrollTop / 420) + index) * 10;
      const r = rotate + Math.sin((scrollTop / 650) + index) * 2.5;
      item.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollUI();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function setupMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setupActiveLinks() {
    const links = [...document.querySelectorAll('.main-nav a')];
    const sections = [...document.querySelectorAll('.section-observe')];
    if (!links.length || !sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-42% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  function setupReveals() {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -70px 0px' });
    items.forEach(item => observer.observe(item));
  }

  function setupSkills() {
    const skills = document.querySelectorAll('.skill');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });
    skills.forEach(skill => observer.observe(skill));
  }

  function setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const format = value => new Intl.NumberFormat('pt-BR').format(value);
    const animateCounter = el => {
      const target = Number(el.dataset.count || 0);
      const duration = 1350;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
  }

  function setupCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(card => {
      const track = card.querySelector('[data-track]');
      const prev = card.querySelector('.prev');
      const next = card.querySelector('.next');
      if (!track) return;

      const move = direction => {
        const width = track.clientWidth;
        const nextLeft = track.scrollLeft + direction * width;
        if (nextLeft >= track.scrollWidth - width / 2) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (nextLeft < 0) {
          track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: direction * width, behavior: 'smooth' });
        }
      };

      prev?.addEventListener('click', () => move(-1));
      next?.addEventListener('click', () => move(1));

      let autoplay = setInterval(() => move(1), 4300);
      card.addEventListener('mouseenter', () => clearInterval(autoplay));
      card.addEventListener('mouseleave', () => autoplay = setInterval(() => move(1), 4300));
    });
  }

  function setupChart() {
    const canvas = document.getElementById('resultsChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const getCss = name => getComputedStyle(document.body).getPropertyValue(name).trim();
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['25 Dez', '24 Jan', '22 Fev'],
        datasets: [{
          label: 'Views',
          data: [3876, 3876, 13086],
          borderColor: getCss('--gold') || '#c8a75e',
          backgroundColor: 'rgba(200,167,94,.13)',
          pointBackgroundColor: getCss('--gold') || '#c8a75e',
          pointBorderColor: getCss('--gold') || '#c8a75e',
          borderWidth: 3,
          pointRadius: 5,
          tension: .42,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${new Intl.NumberFormat('pt-BR').format(ctx.parsed.y)} views`
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(200,167,94,.10)' }, ticks: { color: getCss('--muted') || '#b8ad9d' } },
          y: { grid: { color: 'rgba(200,167,94,.10)' }, ticks: { color: getCss('--muted') || '#b8ad9d' } }
        }
      }
    });
  }

  window.addEventListener('load', () => {
    setThemeByHour();
    updateScrollUI();
    setupChart();
  });

  setThemeByHour();
  setupMenu();
  setupActiveLinks();
  setupReveals();
  setupSkills();
  setupCounters();
  setupCarousels();
})();
