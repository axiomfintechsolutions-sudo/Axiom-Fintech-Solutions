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
    serviceId:  'YOUR_SERVICE_ID',    // replace after EmailJS setup
    templateId: 'YOUR_TEMPLATE_ID',  // replace after EmailJS setup
    publicKey:  'YOUR_PUBLIC_KEY',   // replace after EmailJS setup
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
  const backdrop = document.querySelector('.case-modal-backdrop');
  const closeBtn = document.querySelector('.modal-close');
  if (!backdrop) return;

  /* All case study data — 6 complete studies */
  const caseStudies = {
    /* ─── Case Study 1 ─── */
    '1': {
      tags:    ['Financial Modeling', 'Excel'],
      title:   'Financial Model & Forecasting System for a Pakistani SME',
      results: ['↑38% Forecast Accuracy', '3× Faster Reporting', 'PKR 2.4M Cost Savings'],
      img:     'assets/port1.jpg',
      overview: 'A manufacturing SME in Lahore needed a reliable financial model to support a bank loan application and internal planning. Their existing spreadsheets were inconsistent and lacked forward-looking projections.',
      challenge: '<strong>The challenge</strong> was building a dynamic 3-year financial model from scratch — integrating revenue forecasting, cost drivers, cash flow projections, and sensitivity analysis — all within a single, audit-ready Excel workbook.',
      deliverables: [
        '3-year P&L, Balance Sheet & Cash Flow model',
        'Revenue scenario engine (Base / Bull / Bear)',
        'Monthly vs annual toggle with automated roll-ups',
        'Bank-ready executive summary dashboard',
        'Sensitivity analysis table for key assumptions',
      ],
      tools: ['Excel', 'Power Query', 'Financial Modeling'],
      stats: [{ val: '38%', label: 'Forecast Accuracy Gain' }, { val: '3×', label: 'Faster Reporting' }],
      industry: 'Manufacturing · SME Finance',
    },
    /* ─── Case Study 2 ─── */
    '2': {
      tags:    ['Bookkeeping', 'Accounting'],
      title:   'Complete Bookkeeping Cleanup & Chart of Accounts for a Retail Chain',
      results: ['18 Months Reconciled', '100% Audit Ready', 'PKR 800K Variance Found'],
      img:     'assets/port2.jpg',
      overview: 'A retail chain with 4 outlets had 18 months of unreconciled books across QuickBooks and manual Excel records. They faced an upcoming tax audit with no clear picture of their actual financial position.',
      challenge: '<strong>The challenge</strong> was untangling 18 months of mixed-currency entries, duplicate transactions, and misclassified expenses — then building a clean, forward-going bookkeeping system that non-accountants could maintain.',
      deliverables: [
        'Full 18-month transaction audit and reconciliation',
        'Redesigned Chart of Accounts aligned to FBR categories',
        'Cleaned QuickBooks file with correct opening balances',
        'Standard Operating Procedure (SOP) for monthly close',
        'Bank reconciliation templates for all 4 outlets',
      ],
      tools: ['QuickBooks', 'Excel', 'FBR Tax Framework'],
      stats: [{ val: '18mo', label: 'Reconciled' }, { val: 'PKR 800K', label: 'Variance Identified' }],
      industry: 'Retail · Multi-outlet',
    },
    /* ─── Case Study 3 ─── */
    '3': {
      tags:    ['Power BI', 'Data Analytics'],
      title:   'Sales Intelligence Dashboard for FMCG Distributor',
      results: ['↑22% Revenue', '60% Faster Insights', '5 Regions Visualized'],
      img:     'assets/port3.jpg',
      overview: 'A mid-sized FMCG distributor covering 5 regions in Punjab was making stock and pricing decisions based on weekly CSV exports. Leadership had no real-time visibility into which products, regions, or reps were performing.',
      challenge: '<strong>The challenge</strong> was connecting disparate data sources — ERP exports, WhatsApp-based order logs, and manual Excel trackers — into a single live Power BI dashboard that refreshed daily without manual effort.',
      deliverables: [
        'Power BI dashboard: Sales by region, SKU, rep & channel',
        'Automated ETL pipeline using Power Query',
        'KPI cards: Revenue, Margin, Returns, Fill Rate',
        'Month-over-month and YoY trend comparisons',
        'Mobile-optimized layout for leadership on the go',
      ],
      tools: ['Power BI', 'Power Query', 'Excel', 'DAX'],
      stats: [{ val: '22%', label: 'Revenue Increase' }, { val: '60%', label: 'Faster Insights' }],
      industry: 'FMCG · Distribution',
    },
    /* ─── Case Study 4 ─── */
    '4': {
      tags:    ['Data Analytics', 'E-Commerce'],
      title:   'E-Commerce Sales Analytics Dashboard — Daraz Seller',
      results: ['↑31% Conversion Rate', '↓18% Return Rate', 'Top 5% Seller Ranking'],
      img:     'assets/port4.jpg',
      overview: 'A Daraz seller running 3 product categories had no structured way to track which listings converted, which promotions worked, or why certain SKUs had high return rates. Revenue was growing but margins were shrinking.',
      challenge: '<strong>The challenge</strong> was building a comprehensive analytics layer on top of raw Daraz export files — identifying margin leakage, return drivers, and the best-performing listing attributes to guide catalog and pricing decisions.',
      deliverables: [
        'SKU-level profitability analysis across all 3 categories',
        'Return rate root-cause breakdown by product type',
        'Conversion funnel model from impressions to orders',
        'Promotional ROI tracker for campaign spend',
        'Weekly automated summary report via Excel + Power Query',
      ],
      tools: ['Excel', 'Power BI', 'Python', 'Pandas'],
      stats: [{ val: '31%', label: 'Conversion Uplift' }, { val: '18%', label: 'Return Rate Drop' }],
      industry: 'E-Commerce · Retail',
    },
    /* ─── Case Study 5 ─── */
    '5': {
      tags:    ['Automation', 'Process Design'],
      title:   'Accounts Payable Automation for a Construction Firm',
      results: ['↓70% Manual Entry', '4× Processing Speed', 'Zero Payment Errors'],
      img:     'assets/port5.jpg',
      overview: 'A mid-size construction firm in Islamabad processed 200+ supplier invoices monthly through a fully manual, paper-based AP workflow. Payment delays were damaging vendor relationships and causing costly penalties.',
      challenge: '<strong>The challenge</strong> was designing an end-to-end digital AP workflow that could handle multi-currency invoices, multi-level approvals, and integration with their existing accounting setup — without requiring expensive ERP software.',
      deliverables: [
        'Digital AP workflow using Excel + Power Automate',
        'Invoice intake form with automatic routing rules',
        'Multi-level approval tracker with email notifications',
        'Vendor ledger reconciliation template',
        'Monthly AP aging report with exception flags',
      ],
      tools: ['Excel', 'Power Automate', 'Power Query', 'Outlook'],
      stats: [{ val: '70%', label: 'Manual Entry Reduced' }, { val: '4×', label: 'Processing Speed' }],
      industry: 'Construction · Finance Ops',
    },
    /* ─── Case Study 6 ─── */
    '6': {
      tags:    ['Financial Reporting', 'IFRS'],
      title:   'IFRS-Compliant Management Accounts for a Tech Startup',
      results: ['Investor-Ready Reports', '100% IFRS Compliant', 'Series A Funding Secured'],
      img:     'assets/port6.jpg',
      overview: 'A SaaS startup preparing for Series A funding needed to restructure their financial reporting to meet investor and IFRS standards. Their existing reports mixed cash and accrual entries, had no segment reporting, and lacked the narrative investors expect.',
      challenge: '<strong>The challenge</strong> was rebuilding their entire reporting stack from scratch — converting historical records to accrual basis, adding segment-level P&L for 2 product lines, and producing a Board Pack that would satisfy VC due diligence.',
      deliverables: [
        'IFRS-compliant P&L, Balance Sheet & Cash Flow statements',
        'Segment reporting for 2 product lines (SaaS + Services)',
        'Monthly Board Pack template with KPI commentary',
        'Deferred revenue and accruals schedule',
        'Investor data room: 3-year financial summary',
      ],
      tools: ['Excel', 'QuickBooks', 'IFRS Standards', 'Power BI'],
      stats: [{ val: '100%', label: 'IFRS Compliant' }, { val: 'Series A', label: 'Funding Secured' }],
      industry: 'SaaS · Tech Startup',
    },
  };

  function openModal(id) {
    const data = caseStudies[id];
    if (!data) return;

    /* Hero image */
    const img = backdrop.querySelector('.modal-hero-img');
    if (img) { img.src = data.img; img.alt = data.title; }

    /* Tags */
    const tagsEl = backdrop.querySelector('.modal-tags');
    if (tagsEl) {
      tagsEl.innerHTML = data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
    }

    /* Title */
    const titleEl = backdrop.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = data.title;

    /* Result pills */
    const resultsEl = backdrop.querySelector('.modal-results');
    if (resultsEl) {
      resultsEl.innerHTML = data.results.map(r =>
        `<span class="modal-result-pill">✦ ${r}</span>`
      ).join('');
    }

    /* Stat boxes */
    const twoCol = backdrop.querySelector('.modal-two-col');
    if (twoCol && data.stats) {
      twoCol.innerHTML = data.stats.map(s =>
        `<div class="modal-stat-box">
          <div class="modal-stat-val">${s.val}</div>
          <div class="modal-stat-label">${s.label}</div>
        </div>`
      ).join('');
    }

    /* Overview */
    const overviewEl = backdrop.querySelector('[data-modal="overview"]');
    if (overviewEl) overviewEl.innerHTML = data.overview;

    /* Challenge */
    const challengeEl = backdrop.querySelector('[data-modal="challenge"]');
    if (challengeEl) challengeEl.innerHTML = data.challenge;

    /* Deliverables list */
    const delEl = backdrop.querySelector('[data-modal="deliverables"]');
    if (delEl) {
      delEl.innerHTML = data.deliverables.map(d =>
        `<li class="modal-list-item">${d}</li>`
      ).join('');
    }

    /* Tools */
    const toolsEl = backdrop.querySelector('[data-modal="tools"]');
    if (toolsEl) {
      toolsEl.innerHTML = data.tools.map(t =>
        `<span class="modal-tool">${t}</span>`
      ).join('');
    }

    /* Industry */
    const industryEl = backdrop.querySelector('[data-modal="industry"]');
    if (industryEl) industryEl.textContent = data.industry;

    /* Open */
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Scroll to top of modal */
    const modal = backdrop.querySelector('.case-modal');
    if (modal) modal.scrollTop = 0;
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Open triggers — cards */
  document.querySelectorAll('[data-case]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.case));
  });

  /* Close button */
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* Close on backdrop click */
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
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
