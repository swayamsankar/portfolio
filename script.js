/* ============================================================
   SWAYAM PORTFOLIO — script.js
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────────
window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
  });
  
  // ── Mobile menu ──────────────────────────────────────────────
  function openNav() {
    document.getElementById('nav-links')?.classList.add('open');
  }
  function closeNav() {
    document.getElementById('nav-links')?.classList.remove('open');
  }
  document.querySelectorAll('#nav-links a').forEach(a => {
    a.addEventListener('click', closeNav);
  });
  
  // ── Scroll Reveal (IntersectionObserver) ─────────────────────
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal], [data-reveal-delay]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }
  
  // ── Counter animation ─────────────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('.counter[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 1800;
      const step = target / (duration / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(t);
      }, 16);
    });
  }
  
  function initCounters() {
    const section = document.querySelector('.why-stats-row');
    if (!section) return;
    let fired = false;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        animateCounters();
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(section);
  }
  
  // ── Portfolio filter ──────────────────────────────────────────
  function filterProjects(cat, btn) {
    // Update active tab
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  
    document.querySelectorAll('.pcard').forEach(card => {
      if (cat === 'all' || card.getAttribute('data-cat') === cat) {
        card.classList.remove('hidden');
        card.style.display = '';
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
  }
  
  // ── Certificates toggle + popup ───────────────────────────────
  function toggleCerts(btn) {
    const hidden = document.querySelectorAll('.hidden-cert');
    const showing = hidden[0] && hidden[0].style.display !== 'none';
  
    if (showing) {
      hidden.forEach(c => { c.style.display = 'none'; });
      btn.textContent = 'See More Certificates';
    } else {
      hidden.forEach((c, i) => {
        c.style.display = 'block';
        setTimeout(() => { c.classList.add('visible'); }, i * 60);
      });
      btn.textContent = 'Show Less';
    }
  }
  
  function openCertPopup(src) {
    const popup = document.getElementById('cert-popup');
    document.getElementById('cert-popup-img').src = src;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCertPopup() {
    document.getElementById('cert-popup')?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function initCertClicks() {
    document.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) openCertPopup(img.src);
      });
    });
    document.getElementById('cert-popup')?.addEventListener('click', e => {
      if (e.target === document.getElementById('cert-popup')) closeCertPopup();
    });
  }
  
  // ── Gallery Carousel ──────────────────────────────────────────
  let slideIndex = 0;
  let slideTimer;
  
  function showSlide(n) {
    const slides = document.querySelectorAll('.c-slide');
    if (!slides.length) return;
    slideIndex = ((n % slides.length) + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === slideIndex));
  }
  function nextSlide() { showSlide(slideIndex + 1); }
  function prevSlide() { showSlide(slideIndex - 1); }
  
  function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    slideTimer = setInterval(nextSlide, 3500);
    carousel.addEventListener('mouseenter', () => clearInterval(slideTimer));
    carousel.addEventListener('mouseleave', () => { slideTimer = setInterval(nextSlide, 3500); });
    showSlide(0);
  }
  
  // ── Contact form ──────────────────────────────────────────────
  function initContactForm() {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzyMW1ZywB1UJke1jGcKQ9iLXHi1hZM335d9By1lpPcOsy0KO0wEXwxoRSPv8yFn8QHZA/exec";
    const form = document.querySelector('form[name="submit-to-google-sheet"]');
    const msg = document.getElementById("msg");
    if (!form || !msg) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "Sending...";
      msg.style.color = "var(--gray)";
  
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#ef4444'; valid = false; }
        else { f.style.borderColor = ''; }
      });
      if (!valid) {
        msg.textContent = "Please fill in all required fields.";
        msg.style.color = "#ef4444";
        return;
      }
  
      try {
        const res = await fetch(scriptURL, { method:"POST", body: new FormData(form) });
        const data = await res.json();
        msg.textContent = data.message || "Message sent successfully! 🎉";
        msg.style.color = "#22c55e";
        form.reset();
      } catch(err) {
        msg.textContent = "Error sending. Please try again.";
        msg.style.color = "#ef4444";
      }
    });
  }
  
  // ── Keyboard close for popup ──────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCertPopup();
  });
  
  // ── Init all ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCounters();
    initCarousel();
    initCertClicks();
    initContactForm();
  });