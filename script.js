/* ══════════════════════════════════════════════════
   script.js — Portfolio Interactivity
   • Navbar scroll effect
   • Scroll-reveal animations
   • Animated counters (hero stats)
   • Project card tilt effect
   • Contact form validation
   • Typing effect in hero
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: becomes solid on scroll ── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── 2. SCROLL-REVEAL via IntersectionObserver ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));

  /* ── 3. ANIMATED COUNTERS (hero stats) ── */
  function animateCounter(el, target, decimals = 2, duration = 1800) {
    let start = null;
    const startVal = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = (startVal + eased * (target - startVal)).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.num');
        nums.forEach(num => {
          const val = parseFloat(num.textContent);
          if (!isNaN(val) && val > 10) {
            // "3+" style — skip animation
          } else if (!isNaN(val)) {
            animateCounter(num, val, 2, 1500);
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  /* ── 4. TYPING EFFECT on hero tag line ── */
  const tagEl = document.querySelector('#hero .tag');
  if (tagEl) {
    const phrases = [
      '// ECE Engineer · VLSI Enthusiast',
      '// Embedded Systems Developer',
      '// IoT & Hardware Builder',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        tagEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        tagEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 45 : 80);
    }
    // start after initial reveal animation
    setTimeout(type, 900);
  }

  /* ── 5. SKILL CARD interactive pulse on click ── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transition = 'transform 0.1s, box-shadow 0.1s';
      card.style.transform = 'scale(0.93)';
      card.style.boxShadow = '0 0 22px rgba(0,229,190,0.5)';
      setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 200);
    });
  });

  /* ── 6. PROJECT CARD 3D TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });

  /* ── 7. CONTACT FORM VALIDATION ── */
  const form      = document.getElementById('contactForm');
  const nameEl    = document.getElementById('fName');
  const emailEl   = document.getElementById('fEmail');
  const msgEl     = document.getElementById('fMsg');
  const errName   = document.getElementById('errName');
  const errEmail  = document.getElementById('errEmail');
  const errMsg    = document.getElementById('errMsg');
  const successEl = document.getElementById('formSuccess');
  const sendBtn   = document.getElementById('sendBtn');

  function showErr(el, msg) { el.textContent = msg; }
  function clearErr(el)     { el.textContent = ''; }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Real-time clear on input
  nameEl.addEventListener('input',  () => clearErr(errName));
  emailEl.addEventListener('input', () => clearErr(errEmail));
  msgEl.addEventListener('input',   () => clearErr(errMsg));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameEl.value.trim()) {
      showErr(errName, '⚠ Please enter your name.');
      valid = false;
    }
    if (!emailEl.value.trim()) {
      showErr(errEmail, '⚠ Please enter your email.');
      valid = false;
    } else if (!validateEmail(emailEl.value.trim())) {
      showErr(errEmail, '⚠ Please enter a valid email address.');
      valid = false;
    }
    if (!msgEl.value.trim()) {
      showErr(errMsg, '⚠ Please enter a message.');
      valid = false;
    } else if (msgEl.value.trim().length < 10) {
      showErr(errMsg, '⚠ Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      // Simulate sending (button state change)
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';
      setTimeout(() => {
        form.reset();
        sendBtn.disabled = false;
        sendBtn.innerHTML = 'Send Message <i class="bi bi-send-fill"></i>';
        successEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
        successEl.style.display = 'block';
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }, 1400);
    }
  });

  /* ── 8. SMOOTH NAVBAR LINK HIGHLIGHT on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--accent)'
        : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

});
