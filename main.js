/* ═══════════════════════════════════════════
   SOLVINGCLUB — SHARED JS
═══════════════════════════════════════════ */

// ── Dark Mode Toggle ──────────────────────
// Apply theme ASAP to avoid flash of wrong theme
; (function () {
  const saved = localStorage.getItem('sc-theme');
  const theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}());

// ── Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Active nav link
const navLinks = document.querySelectorAll('.nav-links a');
const currentPage = location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Marquee pause on hover (already in CSS, this is a fallback)
document.querySelectorAll('.marquee-track').forEach(t => {
  t.parentElement.addEventListener('mouseenter', () => t.style.animationPlayState = 'paused');
  t.parentElement.addEventListener('mouseleave', () => t.style.animationPlayState = 'running');
});

// ── Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const dur = 1800;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val = (ease * target).toFixed(decimals);
    el.textContent = val + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ── Theme toggle button click handler
const LOGO_LIGHT = 'assets/brand/solvingclub-logo.png';
const LOGO_DARK = 'assets/brand/solvingclub-logo-dark.svg';

function applyLogoForTheme(theme) {
  const src = theme === 'dark' ? LOGO_DARK : LOGO_LIGHT;
  document.querySelectorAll('.nav-logo img, .footer-logo img').forEach(img => {
    img.src = src;
  });
}

// ── Simple auto-carousel for project mockups ──────────────────────
function initProjectCarousels() {
  document.querySelectorAll('.proj-img--carousel .proj-carousel-track').forEach(track => {
    const slides = Array.from(track.querySelectorAll('img'));
    if (slides.length <= 1) return;

    let index = 0;

    setInterval(() => {
      index = (index + 1) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply correct logo on initial load
  applyLogoForTheme(document.documentElement.getAttribute('data-theme'));

  // Init project carousels (JobsNext, Saral Events, etc.)
  initProjectCarousels();

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('sc-theme', next);
      applyLogoForTheme(next);
    });
  }

  const nav = document.querySelector('.nav');
  const menuBtn = document.getElementById('navMenuToggle');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });

    nav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
      });
    });
  }
});
