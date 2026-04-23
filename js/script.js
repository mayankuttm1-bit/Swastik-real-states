/* ================================================
   SWASTIK REAL ESTATES — Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header Scroll Effect ----
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('header--scrolled');
      header.classList.remove('header--transparent');
    } else {
      header.classList.remove('header--scrolled');
      header.classList.add('header--transparent');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on load

  // ---- Mobile Navigation ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString('en-IN');

      // Add + suffix for numbers (except percentages)
      if (progress >= 1) {
        const label = el.nextElementSibling ? el.nextElementSibling.textContent.toLowerCase() : '';
        if (label.includes('%')) {
          el.textContent = target + '%';
        } else {
          el.textContent = target.toLocaleString('en-IN') + '+';
        }
        return;
      }

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ---- Project Filter (Projects Page) ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';

          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = '';
            // Re-trigger animation
            card.classList.remove('revealed');
            setTimeout(() => card.classList.add('revealed'), 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Form Handling ----
  function handleFormSubmit(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log('Form submission:', data);

      // Show success state
      if (success) {
        form.style.display = 'none';
        // Also hide the title/subtitle above the form
        const formTitle = form.parentElement.querySelector('.contact-form__title');
        const formSubtitle = form.parentElement.querySelector('.contact-form__subtitle');
        if (formTitle) formTitle.style.display = 'none';
        if (formSubtitle) formSubtitle.style.display = 'none';
        success.style.display = 'block';
      } else {
        // Simple alert if no success element
        alert('Thank you for your enquiry! Our team will contact you within 2 business hours.');
        form.reset();
      }
    });
  }

  // Initialize forms
  handleFormSubmit('contactForm', 'formSuccess');
  handleFormSubmit('enquirySidebarForm', null);

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Parallax effect on hero (subtle) ----
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero__bg img');

  if (hero && heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroBottom = hero.offsetTop + hero.offsetHeight;

      if (scrolled < heroBottom) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }

  // ---- Gallery lightbox (simple) ----
  const galleryImages = document.querySelectorAll('.gallery-grid img');

  if (galleryImages.length > 0) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.9);
      z-index: 9999; display: none; align-items: center; justify-content: center;
      cursor: zoom-out; opacity: 0; transition: opacity 0.3s ease;
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
      max-width: 90%; max-height: 90vh; border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transform: scale(0.9); transition: transform 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute; top: 20px; right: 30px;
      font-size: 3rem; color: white; background: none;
      border: none; cursor: pointer; line-height: 1;
      z-index: 10000; opacity: 0.7; transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');

    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.style.display = 'flex';
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.9)';
      setTimeout(() => {
        lightbox.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
    }

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) closeLightbox();
    });

    closeBtn.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

  // ---- Active nav link highlight ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
