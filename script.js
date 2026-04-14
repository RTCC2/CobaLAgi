/* ═══════════════════════════════════════════════════
   PORTFOLIO — script.js
   Features:
   - Sticky nav + active link on scroll
   - Mobile hamburger menu
   - Cursor glow effect
   - Scroll reveal animations
   - Skill bar animation
   - Portfolio filter
   - Typed role text animation
   - Contact form (with EmailJS or Formspree ready)
   - Current year in footer
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     1. CURSOR GLOW
  ────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }

  /* ──────────────────────────────────────
     2. NAVBAR — scroll + active links
  ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav__item[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // Sticky shadow
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ──────────────────────────────────────
     3. MOBILE HAMBURGER MENU
  ────────────────────────────────────── */
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      // Cukup block scroll body saat menu terbuka di HP
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Tutup menu saat link diklik
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Tutup menu saat klik di luar area menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !burger.contains(e.target)) {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ──────────────────────────────────────
     4. SCROLL REVEAL ANIMATION
  ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger items in same container
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((el, idx) => {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          });
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────
     5. SKILL BAR ANIMATION
  ────────────────────────────────────── */
  const skillBarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-bar-item__fill');
          fills.forEach(fill => {
            const width = fill.getAttribute('data-width') || '0';
            setTimeout(() => {
              fill.style.width = width + '%';
            }, 200);
          });
          skillBarObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsBlock = document.querySelector('.skills-bar-list');
  if (skillsBlock) skillBarObserver.observe(skillsBlock.closest('.skills-block'));

  /* ──────────────────────────────────────
     6. TYPED ROLE ANIMATION
  ────────────────────────────────────── */
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    const roles = [
      'Water Resource Engineering Student',
      'Leadership Management',
      'Problem Solver',
      'Analitis',
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function typeRole() {
      const currentRole = roles[roleIdx];

      if (!deleting) {
        // Typing
        typedEl.textContent = currentRole.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
          // Pause before deleting
          deleting = true;
          pauseTimer = setTimeout(typeRole, 2200);
          return;
        }
        setTimeout(typeRole, 90);
      } else {
        // Deleting
        typedEl.textContent = currentRole.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typeRole, 400);
          return;
        }
        setTimeout(typeRole, 50);
      }
    }

    // Add cursor blink via CSS
    typedEl.style.borderRight = '2px solid var(--gold)';
    typedEl.style.paddingRight = '3px';
    typedEl.style.animation = 'blink 0.8s step-end infinite';

    // Inject blink keyframe if not already added
    if (!document.getElementById('blink-style')) {
      const style = document.createElement('style');
      style.id = 'blink-style';
      style.textContent = `
        @keyframes blink {
          0%, 100% { border-color: var(--gold); }
          50%       { border-color: transparent; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(typeRole, 800);
  }

  /* ──────────────────────────────────────
     7. SHOWCASE DOT NAVIGATION
     Klik dot → scroll mulus ke proyek
  ────────────────────────────────────── */
  const showcaseDots     = document.querySelectorAll('.showcase-dot');
  const showcaseCards    = document.querySelectorAll('.showcase-card');
  const showcaseProgress = document.getElementById('showcaseProgress');

  // Update progress bar & active dot berdasarkan card yang terlihat
  function updateShowcaseNav() {
    if (!showcaseCards.length) return;

    let activeIdx = 0;
    const navH = navbar ? navbar.offsetHeight : 70;

    showcaseCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      // Card dianggap "aktif" jika lebih dari setengah terlihat
      if (rect.top < window.innerHeight * 0.55) activeIdx = i;
    });

    showcaseDots.forEach((dot, i) => {
      dot.classList.toggle('showcase-dot--active', i === activeIdx);
    });

    // Progress bar: 0% = card 1, 100% = card terakhir
    const pct = showcaseCards.length > 1
      ? (activeIdx / (showcaseCards.length - 1)) * 100
      : 100;
    if (showcaseProgress) showcaseProgress.style.width = pct + '%';
  }

  // Klik dot → scroll ke card tujuan
  showcaseDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const target   = document.getElementById(targetId);
      if (target) {
        const navH  = navbar ? navbar.offsetHeight : 70;
        const top   = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', updateShowcaseNav, { passive: true });
  updateShowcaseNav();

  /* ──────────────────────────────────────
     8. CONTACT FORM
     
     Opsi A: Gunakan Formspree (gratis, mudah)
     Cara: Daftar di formspree.io → buat form → salin endpoint
     Ganti URL di bawah dengan endpoint Formspree kamu:
     https://formspree.io/f/XXXXXXXX
     
     Opsi B: Gunakan EmailJS (gratis tier tersedia)
     Cara: emailjs.com → setup service + template
  ────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e55353';
          valid = false;
          setTimeout(() => { field.style.borderColor = ''; }, 3000);
        }
      });
      if (!valid) return;

      // Loading state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Mengirim...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      /* ── OPSI A: Formspree ─────────────────────────
         Uncomment dan ganti URL dengan endpoint kamu:
      ─────────────────────────────────────────────── */
      /*
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formspree.io/f/XXXXXXXX', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          showSuccess();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        alert('Terjadi kesalahan. Silakan hubungi langsung via email.');
        resetBtn();
      }
      */

      /* ── DEMO MODE (hapus ini jika pakai Formspree/EmailJS) ── */
      setTimeout(() => {
        showSuccess();
      }, 1500);

      function showSuccess() {
        contactForm.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      }

      function resetBtn() {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }
    });

    // Clear error highlight on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  /* ──────────────────────────────────────
     9. CURRENT YEAR IN FOOTER
  ────────────────────────────────────── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ──────────────────────────────────────
     10. SMOOTH SCROLL untuk browser lama
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const top = target.offsetTop - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────
     11. PHOTO: auto-show placeholder
         jika gambar gagal load
  ────────────────────────────────────── */
  document.querySelectorAll('.project-card__visual img').forEach(img => {
    img.addEventListener('error', function () {
      this.parentElement.classList.add('no-img');
    });
    // Trigger for already-broken cached images
    if (img.complete && img.naturalWidth === 0) {
      img.parentElement.classList.add('no-img');
    }
  });
  /* ──────────────────────────────────────
     12. SLIDESHOW — Foto ganti-ganti di background proyek
         Fitur:
         - Auto-play dengan interval dari data-interval (ms)
         - Klik tombol ← → untuk ganti manual
         - Klik dot untuk loncat ke slide tertentu
         - Pause saat mouse hover di atas card
         - Progress bar animasi timer
  ────────────────────────────────────── */
  document.querySelectorAll('.slideshow').forEach(ss => {
    const track    = ss.querySelector('.slideshow__track');
    const slides   = Array.from(ss.querySelectorAll('.slideshow__slide'));
    const dotsWrap = ss.querySelector('.slideshow__dots');
    const btnPrev  = ss.querySelector('.slideshow__btn--prev');
    const btnNext  = ss.querySelector('.slideshow__btn--next');
    const counterCur = ss.querySelector('.slideshow__current');
    const counterTot = ss.querySelector('.slideshow__total');
    const interval = parseInt(ss.getAttribute('data-interval')) || 4000;

    if (!slides.length) return;

    // Perbarui total counter
    if (counterTot) counterTot.textContent = slides.length;

    // Auto-hide prev/next jika hanya 1 slide
    if (slides.length <= 1) {
      if (btnPrev) btnPrev.style.display = 'none';
      if (btnNext) btnNext.style.display = 'none';
    }

    let current   = 0;
    let timer     = null;
    let paused    = false;

    // ── Build dot indicators ──
    const dotEls = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'slideshow__dot-item' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Foto ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(d);
      return d;
    });

    // ── Progress bar element ──
    const progressBar = document.createElement('div');
    progressBar.className = 'slideshow__progress-bar';
    ss.appendChild(progressBar);

    // ── Go to slide index ──
    function goTo(idx) {
      slides[current].classList.remove('active');
      dotEls[current] && dotEls[current].classList.remove('active');

      current = (idx + slides.length) % slides.length;

      slides[current].classList.add('active');
      dotEls[current] && dotEls[current].classList.add('active');
      if (counterCur) counterCur.textContent = current + 1;

      // Restart progress bar
      resetProgress();
    }

    // ── Auto-play timer ──
    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) goTo(current + 1);
      }, interval);
    }

    function resetProgress() {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // Force reflow
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${interval}ms linear`;
      progressBar.style.width = '100%';
    }

    // ── Button events ──
    if (btnPrev) btnPrev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    if (btnNext) btnNext.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

    // ── Pause on hover ──
    const card = ss.closest('.showcase-card');
    if (card) {
      card.addEventListener('mouseenter', () => { paused = true; progressBar.style.animationPlayState = 'paused'; });
      card.addEventListener('mouseleave', () => {
        paused = false;
        resetProgress();
      });
    }

    // ── Touch / swipe support ──
    let touchStartX = 0;
    ss.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    ss.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });

    // ── Handle slides with broken images → show fallback ──
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        img.addEventListener('error', () => slide.classList.add('no-img'));
        if (img.complete && img.naturalWidth === 0) slide.classList.add('no-img');
      }
    });

    // ── Init ──
    startAuto();
    resetProgress();
  });


});
