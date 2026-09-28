/* ===== SOLO SALON — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Preloader ----- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.classList.add('hidden'));
    setTimeout(() => preloader.classList.add('hidden'), 2000);
  }

  /* ----- Navbar scroll effect ----- */
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----- Mobile menu ----- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ----- Active nav link ----- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----- Scroll reveal ----- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ----- Counter animation ----- */
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        };

        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ----- Gallery filter ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  /* ----- Contact form ----- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.phone) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate submission
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showNotification('Thank you! We\'ll contact you shortly.', 'success');
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }

  /* ----- Newsletter ----- */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input.value) {
        showNotification('Subscribed successfully!', 'success');
        input.value = '';
      }
    });
  });

  /* ----- Back to top ----- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Highlight current day in hours ----- */
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours-table tr').forEach(row => {
    const dayCell = row.querySelector('td:first-child');
    if (dayCell && dayCell.textContent.trim().startsWith(today)) {
      row.classList.add('today');
    }
  });

  /* ----- Smooth scroll for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ===== Notification Toast ===== */
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `notification ${type}`;
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    padding: '16px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    zIndex: '99999',
    opacity: '0',
    transition: 'all 0.3s ease',
    fontFamily: 'Poppins, sans-serif'
  });

  if (type === 'success') {
    toast.style.background = '#2ecc71';
    toast.style.color = '#fff';
  } else {
    toast.style.background = '#e74c3c';
    toast.style.color = '#fff';
  }

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
