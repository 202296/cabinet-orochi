/* =============================================
   CABINET OROCHI — MAIN JAVASCRIPT
   Global functions: nav, scroll, animations
   ============================================= */

(function () {
  'use strict';

  /* ---- Sticky Header ---- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Close on overlay link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Intersection Observer: Fade-in on scroll ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Counter animation ---- */
  function animateCounter(el, target, suffix = '') {
    const duration = 1500;
    const start = performance.now();
    const update = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
            counterObs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObs.observe(el));
  }

  /* ---- Basic Form Validation ---- */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const wrapper = field.closest('.form-group');
      const errorEl = wrapper ? wrapper.querySelector('.field-error') : null;
      field.classList.remove('is-invalid');

      if (!field.value.trim()) {
        valid = false;
        field.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = 'Ce champ est requis.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        valid = false;
        field.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = 'Adresse e-mail invalide.';
      } else if (field.type === 'tel' && !/^[\d\s\+\-\(\)]{8,}$/.test(field.value)) {
        valid = false;
        field.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = 'Numéro de téléphone invalide.';
      } else {
        if (errorEl) errorEl.textContent = '';
      }
    });
    return valid;
  }

  function showAlert(form, type, message) {
    const alert = form.querySelector('.alert');
    if (alert) {
      alert.className = `alert alert-${type} show`;
      alert.textContent = message;
      alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => alert.classList.remove('show'), 6000);
    }
  }

  /* ---- Contact Form Handler ---- */
  const contactForms = document.querySelectorAll('[data-form="contact"]');
  contactForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const btn = form.querySelector('[type="submit"]');
        const origText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Envoi en cours…';
        // Simulate async send
        setTimeout(() => {
          form.reset();
          btn.disabled = false;
          btn.textContent = origText;
          showAlert(form, 'success', '✓ Votre message a été envoyé ! Nous vous répondrons dans les 24h.');
        }, 1200);
      }
    });
  });

  /* ---- Add inline error elements ---- */
  document.querySelectorAll('.form-group [required]').forEach(field => {
    const wrapper = field.closest('.form-group');
    if (wrapper && !wrapper.querySelector('.field-error')) {
      const err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'display:block;font-size:0.78rem;color:#dc3545;margin-top:4px;';
      wrapper.appendChild(err);
    }
  });

  /* ---- Whatsapp float button pulse ---- */
  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) {
    setTimeout(() => waBtn.classList.add('pulse'), 3000);
  }

  /* ---- Back to top ---- */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

})();
