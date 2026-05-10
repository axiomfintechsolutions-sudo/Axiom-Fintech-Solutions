/* ============================================================
   AXIOM FINTECH SOLUTIONS — script.js
   Finance · Technology · Innovation
   Single file · Config-based · EmailJS integrated
   ============================================================

   TABLE OF CONTENTS
   1.  CONFIG  — Edit here to update site-wide settings
   2.  NAVBAR  — Scroll effect, logo hover, hamburger, mobile menu
   3.  SCROLL REVEAL — Intersection Observer fade-in
   4.  HERO COUNTER — Animated number counters
   5.  FAQ ACCORDION — Home page & contact page accordions
   6.  PORTFOLIO FILTER — Filter tabs (portfolio page)
   7.  CASE STUDY MODAL — Open/close modal with data injection
   8.  CONTACT FORM — EmailJS send + success state
   9.  SERVICE CHIPS — Toggleable service selector (contact page)
   10. ACTIVE NAV LINK — Highlight current page in navbar
   11. STICKY NAV STRIP — Services & industries sub-nav highlight
   12. SERVICES HERO TAGS — Filter toggle (services page)
   13. PROCESS SECTION — Animated process cards
   14. MOBILE OVERFLOW FIX — Prevent horizontal scroll
   15. INIT — Run everything on DOMContentLoaded
   16. Newsletter Subscription
   17. CASE STUDY DATA
   ============================================================ */


/* ══════════════════════════════════════════════════════════
   1. CONFIG — Change values here, they update everywhere
   ══════════════════════════════════════════════════════════ */
const CONFIG = {
  company: {
    name:      'Axiom Fintech Solutions',
    email:     'axiomfintechsolutions@gmail.com',
    tagline:   'Finance · Technology · Innovation',
    website:   'https://www.axiomfintechsolutions.com',
    phone:     '+92 300 0000000',      // update your number
    location:  'Punjab, Pakistan',
  },
  socials: {
    linkedin:  'https://www.linkedin.com/company/axiomfintechsolutions',
    facebook:  'https://www.facebook.com/axiomfintechsolutions',
    instagram: 'https://www.instagram.com/axiomfintechsolutions',
    handle:    'axiomfintechsolutions',
  },
  emailjs: {
    serviceId:  'service_phaj405',    // replace after EmailJS setup
    templateId: 'template_qv7aydg',  // replace after EmailJS setup
    publicKey:  'GNS5b8ejPMM6G_NUx',   // replace after EmailJS setup
  },
  animation: {
    revealThreshold:   0.08,
    revealRootMargin:  '0px 0px -30px 0px',
    counterDuration:   2000,          // ms
    counterDelay:      400,           // ms before counters start
  },
};


/* ══════════════════════════════════════════════════════════
   2. NAVBAR
   ══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const logoName  = document.querySelector('.logo-name');
  const logoImg   = document.querySelector('.logo-img');

  if (!navbar) return;

  /* Scroll — black bg + gold border. Never white. */
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Logo name appears after scrolling past hero */
    if (logoName) {
      if (window.scrollY > 120) {
        logoName.classList.add('visible');
      } else {
        logoName.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on mobile link click */
    mobileMenu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* Logo hover — show name on hover, hide on leave */
  if (logoImg && logoName) {
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
      navLogo.addEventListener('mouseenter', () => logoName.classList.add('visible'));
      navLogo.addEventListener('mouseleave', () => {
        /* Only hide if not scrolled past threshold */
        if (window.scrollY <= 120) logoName.classList.remove('visible');
      });
    }
  }
}


/* ══════════════════════════════════════════════════════════
   3. SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  /* Immediately show all — then let IntersectionObserver handle visibility */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  CONFIG.animation.revealThreshold,
    rootMargin: CONFIG.animation.revealRootMargin,
  });

  elements.forEach(el => observer.observe(el));

  /* Fallback — make everything visible after 1.5s in case Observer fails */
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 1500);
}


/* ══════════════════════════════════════════════════════════
   4. HERO COUNTER — Animated number counters
   ══════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = CONFIG.animation.counterDuration;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease out cubic */
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => animateCounter(entry.target), CONFIG.animation.counterDelay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════════════
   5. FAQ ACCORDION
   ══════════════════════════════════════════════════════════ */
function initFAQ() {
  /* Home page FAQ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      /* Close all siblings */
      item.closest('.faq-list, .faq-right')
        ?.querySelectorAll('.faq-item.open')
        .forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Contact page mini FAQ */
  document.querySelectorAll('.faq-mini-card').forEach(card => {
    const header = card.querySelector('.faq-mini-header');
    const answer = card.querySelector('.faq-mini-answer');
    if (!header || !answer) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('active');
      /* Close all */
      document.querySelectorAll('.faq-mini-card.active').forEach(c => {
        c.classList.remove('active');
        c.querySelector('.faq-mini-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        card.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}


/* ══════════════════════════════════════════════════════════
   6. PORTFOLIO FILTER
   ══════════════════════════════════════════════════════════ */
function initPortfolioFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.p-card');
  const count = document.querySelector('.filter-count span');

  if (!tabs.length || !cards.length) return;

  function updateCount(visible) {
    if (count) count.textContent = visible;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter  = tab.dataset.filter;
      let   visible = 0;

      cards.forEach(card => {
        const category = card.dataset.category || '';
        const show = filter === 'all' || category === filter || category.includes(filter);
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      updateCount(visible);
    });
  });

  /* Initial count */
  updateCount(cards.length);
}


/* ══════════════════════════════════════════════════════════
   7. CASE STUDY MODAL
   ══════════════════════════════════════════════════════════ */
function initCaseModal() {
  const backdrop = document.getElementById('caseModalBackdrop');
  const modal    = document.getElementById('caseModal');
  const closeBtn = document.getElementById('modalClose');
  if (!backdrop) return;

  // Hide all cases, show only the clicked one
  function openModal(caseId) {
    backdrop.querySelectorAll('.modal-case').forEach(c => c.style.display = 'none');
    const target = backdrop.querySelector(`.modal-case[data-case="${caseId}"]`);
    if (!target) return;
    target.style.display = 'block';
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (modal) modal.scrollTop = 0;
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-case]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.case));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el.dataset.case); }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
/* ══════════════════════════════════════════════════════════
   8. CONTACT FORM — EmailJS integration
   ══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form        = document.querySelector('#contactForm');
  const submitBtn   = document.querySelector('#formSubmit');
  const formContent = document.querySelector('.form-content');
  const formSuccess = document.querySelector('.form-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Collect selected service chips */
    const selectedChips = [...document.querySelectorAll('.service-chip.selected')]
      .map(c => c.textContent.trim())
      .join(', ');

    /* Build template params */
    const templateParams = {
      from_name:    form.querySelector('[name="name"]')?.value    || '',
      from_email:   form.querySelector('[name="email"]')?.value   || '',
      company:      form.querySelector('[name="company"]')?.value || '',
      phone:        form.querySelector('[name="phone"]')?.value   || '',
      service:      form.querySelector('[name="service"]')?.value || selectedChips || '',
      budget:       form.querySelector('[name="budget"]')?.value  || '',
      message:      form.querySelector('[name="message"]')?.value || '',
      to_email:     CONFIG.company.email,
      company_name: CONFIG.company.name,
    };

    /* Disable button, show loading */
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner">⏳</span> Sending…';
    }

    try {
      /* EmailJS send */
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          CONFIG.emailjs.serviceId,
          CONFIG.emailjs.templateId,
          templateParams
        );
      } else {
        /* Fallback: simulate success in dev (remove in production) */
        await new Promise(r => setTimeout(r, 1200));
      }

      /* Show success */
      if (formContent) formContent.classList.add('hidden');
      if (formSuccess) formSuccess.classList.add('visible');

    } catch (err) {
      console.error('EmailJS error:', err);
      if (submitBtn) {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Try Again — Send Message ✦';
      }
      alert('Something went wrong. Please email us directly at ' + CONFIG.company.email);
    }
  });
}


/* ══════════════════════════════════════════════════════════
   9. SERVICE CHIPS — Toggle selection (contact page)
   ══════════════════════════════════════════════════════════ */
function initServiceChips() {
  document.querySelectorAll('.service-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });
}


/* ══════════════════════════════════════════════════════════
   10. ACTIVE NAV LINK — Highlight current page
   ══════════════════════════════════════════════════════════ */
function initActiveNavLink() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();

    if (
      linkFile === filename ||
      (filename === '' && linkFile === 'index.html') ||
      (filename === 'index.html' && linkFile === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}


/* ══════════════════════════════════════════════════════════
   11. STICKY SUB-NAV — Services & Industries page nav strip
   ══════════════════════════════════════════════════════════ */
function initStickySubNav() {
  const navLinks = document.querySelectorAll('.services-nav-link, .industries-nav-link');
  if (!navLinks.length) return;

  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const active = sections.find(s => s.section === entry.target);
        if (active) {
          navLinks.forEach(l => l.classList.remove('active'));
          active.link.classList.add('active');
          
          /* REMOVED: scrollIntoView was causing the page jump */
        }
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-72px 0px -40% 0px',
  });

  sections.forEach(({ section }) => observer.observe(section));
}

/* ══════════════════════════════════════════════════════════
   12. SERVICES HERO TAGS — Filter toggle
   ══════════════════════════════════════════════════════════ */
function initServicesHeroTags() {
  const tags     = document.querySelectorAll('.services-hero-tag');
  const sections = document.querySelectorAll('.service-detail');

  if (!tags.length) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.dataset.filter;
      if (!filter || filter === 'all') {
        sections.forEach(s => s.style.display = '');
        return;
      }

      sections.forEach(section => {
        const id = section.id || '';
        section.style.display = id.includes(filter) ? '' : 'none';
      });
    });
  });
}


/* ══════════════════════════════════════════════════════════
   13. PROCESS SECTION — Entrance animation
   ══════════════════════════════════════════════════════════ */
function initProcessCards() {
  const cards = document.querySelectorAll('.process-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(card);
  });
}


/* ══════════════════════════════════════════════════════════
   14. MOBILE OVERFLOW FIX
   ══════════════════════════════════════════════════════════ */
function fixMobileOverflow() {
  /* Lock body + all major wrappers to viewport width */
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    .hero, .about-section, .services-section,
    .industries-section, .portfolio-section,
    .testimonials-section, .faq-section,
    .contact-section, .footer,
    .about-hero, .services-hero, .industries-hero,
    .portfolio-hero, .contact-hero,
    .service-detail, .industry-detail,
    .story-section, .mv-section, .values-section,
    .founder-section, .future-section,
    .portfolio-grid-section, .portfolio-filter-section,
    .contact-main-section, .contact-faq-section,
    .tools-section, .process-section {
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    * { min-width: 0; }
  `;
  document.head.appendChild(style);

  /* Detect and log overflow source in dev */
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    const allEls = document.querySelectorAll('*');
    allEls.forEach(el => {
      if (el.offsetWidth > document.documentElement.offsetWidth) {
        console.warn('[Overflow]', el, el.offsetWidth);
      }
    });
  }
}


/* ══════════════════════════════════════════════════════════
   15. INIT — Run everything on DOM ready
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fixMobileOverflow();
  initNavbar();
  initScrollReveal();
  initCounters();
  initFAQ();
  initPortfolioFilter();
  initCaseModal();
  initContactForm();
  initServiceChips();
  initActiveNavLink();
  initStickySubNav();
  initServicesHeroTags();
  initProcessCards();
});
/* ══════════════════════════════════════════════════════════
   16. Newsletter Subscription
   ══════════════════════════════════════════════════════════ */
(function () {
  const SHEET_URL  = 'https://script.google.com/macros/s/AKfycbxAtiyRZCkPuWRxVfaGvcHu-NDMLs356nusZhWqd7wZRPnfmBX0C0sStrSFmDQoAvg5/exec';

  const overlay    = document.getElementById('popupOverlay');
  const popup      = document.getElementById('newsletterPopup');
  const closeBtn   = document.getElementById('popupClose');
  const submitBtn  = document.getElementById('popupSubmit');
  const success    = document.getElementById('popupSuccess');
  const emailInput = document.getElementById('popupEmail');

  let shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    overlay.classList.add('active');
    setTimeout(() => popup.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger at 20% scroll
  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if ((scrollTop / docHeight) >= 0.20) showPopup();
  });

  overlay.addEventListener('click', hidePopup);
  closeBtn.addEventListener('click', hidePopup);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hidePopup();
  });

  // Submit
  submitBtn.addEventListener('click', function () {
    const email = emailInput.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) { emailInput.focus(); return; }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(() => {
      emailInput.style.display = 'none';
      submitBtn.style.display  = 'none';
      success.classList.add('show');
      setTimeout(hidePopup, 2500);
    })
    .catch(() => {
      submitBtn.textContent = 'Try Again';
      submitBtn.disabled = false;
    });
  });

})();

/* ══════════════════════════════════════════════════════════
   EMAILJS SETUP GUIDE
   ══════════════════════════════════════════════════════════
   1. Go to https://www.emailjs.com and sign up (free plan works)
   2. Add an Email Service → connect your Gmail (axiomfintechsolutions@gmail.com)
      → copy the Service ID → paste into CONFIG.emailjs.serviceId above
   3. Create an Email Template:
      Subject: New Inquiry from {{from_name}} — {{company}}
      Body:
        Name:    {{from_name}}
        Email:   {{from_email}}
        Company: {{company}}
        Phone:   {{phone}}
        Service: {{service}}
        Budget:  {{budget}}
        Message: {{message}}
      → copy the Template ID → paste into CONFIG.emailjs.templateId above
   4. Go to Account → API Keys → copy Public Key
      → paste into CONFIG.emailjs.publicKey above
   5. In your contact.html, add this BEFORE script.js:
      <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
      <script>emailjs.init("YOUR_PUBLIC_KEY");</script>
   ══════════════════════════════════════════════════════════ */
