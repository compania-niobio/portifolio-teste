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

      const slides = [...track.children].filter(slide => slide.matches('img, picture, figure, div'));
      const hasMultipleSlides = slides.length > 1;
      let currentIndex = 0;
      let autoplay = null;

      if (!hasMultipleSlides) {
        prev?.classList.add('is-hidden');
        next?.classList.add('is-hidden');
        return;
      }

      prev?.setAttribute('type', 'button');
      next?.setAttribute('type', 'button');

      const getSlideWidth = () => track.getBoundingClientRect().width || track.clientWidth || 1;

      const goToSlide = index => {
        const total = slides.length;
        currentIndex = (index + total) % total;
        track.scrollTo({
          left: currentIndex * getSlideWidth(),
          behavior: 'smooth'
        });
      };

      const move = direction => goToSlide(currentIndex + direction);

      const syncIndexFromScroll = () => {
        currentIndex = Math.round(track.scrollLeft / getSlideWidth());
      };

      const startAutoplay = () => {
        stopAutoplay();
        autoplay = window.setInterval(() => move(1), 5200);
      };

      const stopAutoplay = () => {
        if (autoplay) {
          window.clearInterval(autoplay);
          autoplay = null;
        }
      };

      const restartAutoplay = () => {
        stopAutoplay();
        startAutoplay();
      };

      prev?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        move(-1);
        restartAutoplay();
      });

      next?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        move(1);
        restartAutoplay();
      });

      track.addEventListener('scroll', () => {
        window.requestAnimationFrame(syncIndexFromScroll);
      }, { passive: true });

      card.addEventListener('mouseenter', stopAutoplay);
      card.addEventListener('mouseleave', startAutoplay);
      card.addEventListener('focusin', stopAutoplay);
      card.addEventListener('focusout', startAutoplay);

      window.addEventListener('resize', () => {
        track.scrollTo({ left: currentIndex * getSlideWidth(), behavior: 'auto' });
      }, { passive: true });

      startAutoplay();
    });
  }


  function setupMakingOfPlayer() {
    document.querySelectorAll('[data-video-player]').forEach(player => {
      const video = player.querySelector('video');
      const frame = player.querySelector('.making-video-frame');
      const centerBtn = player.querySelector('.video-center-play');
      const centerIcon = player.querySelector('.video-center-icon');
      const toggleBtn = player.querySelector('.video-toggle');
      const muteBtn = player.querySelector('.video-mute');
      const fullscreenBtn = player.querySelector('.video-fullscreen');
      const progress = player.querySelector('.video-progress');
      const current = player.querySelector('.video-current');
      const duration = player.querySelector('.video-duration');
      if (!video || !frame || !progress) return;

      const formatTime = seconds => {
        if (!Number.isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };

      const setPlayState = () => {
        const paused = video.paused;
        frame.classList.toggle('is-paused', paused);
        const icon = paused ? '▶' : 'Ⅱ';
        if (centerIcon) centerIcon.textContent = icon;
        if (toggleBtn) {
          toggleBtn.textContent = icon;
          toggleBtn.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
        }
        if (centerBtn) centerBtn.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
      };

      const setMuteState = () => {
        if (!muteBtn) return;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
        muteBtn.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Silenciar vídeo');
      };

      const updateProgress = () => {
        const value = video.duration ? (video.currentTime / video.duration) * 100 : 0;
        progress.value = value;
        progress.style.setProperty('--progress', `${value}%`);
        if (current) current.textContent = formatTime(video.currentTime);
        if (duration) duration.textContent = formatTime(video.duration);
      };

      const togglePlay = () => {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      };

      video.addEventListener('loadedmetadata', updateProgress);
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('play', setPlayState);
      video.addEventListener('pause', setPlayState);
      video.addEventListener('volumechange', setMuteState);
      video.addEventListener('click', togglePlay);
      centerBtn?.addEventListener('click', togglePlay);
      toggleBtn?.addEventListener('click', togglePlay);

      muteBtn?.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted) video.volume = Math.max(video.volume, 0.65);
      });

      progress.addEventListener('input', () => {
        if (!video.duration) return;
        video.currentTime = (Number(progress.value) / 100) * video.duration;
        updateProgress();
      });

      fullscreenBtn?.addEventListener('click', () => {
        const target = player.querySelector('.making-video-frame') || player;
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          target.requestFullscreen?.();
        }
      });

      setPlayState();
      setMuteState();
      updateProgress();
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
  setupMakingOfPlayer();
})();
