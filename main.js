/* ═══════════════════════════════════════════
   SOLVINGCLUB — SHARED JS
═══════════════════════════════════════════ */

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
