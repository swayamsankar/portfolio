/* ============================================================
   SWAYAM PORTFOLIO — script.js
   ============================================================ */

// ── Blur hero text word-by-word entrance effect ───────────────
(function () {
  const container = document.getElementById('blurHero');
  if (!container) return;

  Array.from(container.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (!w.trim()) {
          frag.appendChild(document.createTextNode(w));
          return;
        }
        const span = document.createElement('span');
        span.className = 'blur-word';
        span.textContent = w;
        frag.appendChild(span);
      });
      container.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const wrap = document.createElement('span');
      wrap.className = 'blur-word';
      node.parentNode.insertBefore(wrap, node);
      wrap.appendChild(node);
    }
  });

  const words = container.querySelectorAll('.blur-word');
  const delay = 150;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), i * delay);
    });
    observer.disconnect();
  }, { threshold: 0.1 });

  observer.observe(container);
})();

// ── TrueFocus effect for Hero action buttons (View Projects / Hire Me) ────
(function () {
  const container = document.getElementById('heroFocus');
  const frame = document.getElementById('heroFocusFrame');
  if (!container || !frame) return;
  const words = Array.from(container.querySelectorAll('.focus-word'));
  if (!words.length) return;
  let currentIndex = 0;
  const animationDuration = 0.5;
  const pauseBetween = 2.2;
  let autoTimer = null;
  let isManualHover = false;

  function moveFrameTo(index) {
    const word = words[index];
    if (!word) return;
    const parentRect = container.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    frame.style.transform = `translate(${wordRect.left - parentRect.left}px, ${wordRect.top - parentRect.top}px)`;
    frame.style.width = `${wordRect.width}px`;
    frame.style.height = `${wordRect.height}px`;
    frame.classList.add('show');
    words.forEach((w, i) => w.classList.toggle('active', i === index));
  }

  function startAutoCycle() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (isManualHover) return;
      currentIndex = (currentIndex + 1) % words.length;
      moveFrameTo(currentIndex);
    }, (animationDuration + pauseBetween) * 1000);
  }

  words.forEach((word, index) => {
    word.addEventListener('mouseenter', () => {
      isManualHover = true;
      currentIndex = index;
      moveFrameTo(index);
    });
    word.addEventListener('mouseleave', () => {
      isManualHover = false;
    });
  });

  requestAnimationFrame(() => moveFrameTo(currentIndex));
  window.addEventListener('resize', () => moveFrameTo(currentIndex));
  startAutoCycle();
})();

// ── RotatingText: cycles hero role titles (port of RotatingText component) ──
document.addEventListener("DOMContentLoaded", function () {

  const roles = [
    "Full Stack Developer",
    "Software Developer",
    "QA Engineer",
    "Product Developer",
    "AI & Cloud Enthusiast",
    "Creative Technologist"
  ];

  const srEl = document.getElementById("heroRotateSR");
  const visibleEl = document.getElementById("heroRotateVisible");

  if (!srEl || !visibleEl) {
    console.log("Hero rotate element not found");
    return;
  }

  let index = 0;

  const rotationInterval = 2200;
  const staggerDuration = 25;

  function splitToChars(text) {
    return Array.from(text);
  }

  function buildCharSpans(text) {
    return splitToChars(text).map((ch) => {
      const span = document.createElement("span");
      span.className = "text-rotate-char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      return span;
    });
  }

  function renderRole(text) {
    const chars = buildCharSpans(text);
    visibleEl.innerHTML = "";
    chars.forEach((char) => {
      visibleEl.appendChild(char);
    });
    srEl.textContent = text;
    requestAnimationFrame(() => {
      chars.forEach((char, i) => {
        setTimeout(() => {
          char.classList.add("enter");
        }, i * staggerDuration);
      });
    });
  }

  function rotateToNext() {
    const currentChars = Array.from(visibleEl.children);
    currentChars.forEach((char, i) => {
      const delay = (currentChars.length - 1 - i) * staggerDuration;
      setTimeout(() => {
        char.classList.remove("enter");
        char.classList.add("exit");
      }, delay);
    });
    const exitTotalTime = currentChars.length * staggerDuration + 350;
    setTimeout(() => {
      index = (index + 1) % roles.length;
      renderRole(roles[index]);
    }, exitTotalTime);
  }

  // Use FontFaceSet.ready if available, to wait for fonts before animating
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      renderRole(roles[index]);
      setInterval(rotateToNext, rotationInterval);
    });
  } else {
    renderRole(roles[index]);
    setInterval(rotateToNext, rotationInterval);
  }

});

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
// Modern project stack carousel + tab filter replacement
(function () {

  /* ── Project data ── */
  const ALL_PROJECTS = [
    { cat:'web',    img:'images/work-1.png',      catLabel:'Photography',  title:'Thrilling Frames Media',    desc:'Event photography & booking platform',                link:'https://eventphotographybooksite.netlify.app/',                        gh:false },
    { cat:'web',    img:'images/work-2.png',      catLabel:'Full Stack',   title:'Gastronome',                desc:'Restaurant booking & ordering system',                link:'https://restaurant-website-k7jb.onrender.com',                         gh:false },
    { cat:'web',    img:'images/work-3.png',      catLabel:'React',        title:'Scientific Calculator',     desc:'React-based advanced math calculator',                link:'https://reactscientificcalculator.netlify.app/',                        gh:false },
    { cat:'design', img:'images/work-4.png',     catLabel:'Design',       title:'Portfolio Website',         desc:'Responsive portfolio with animations',                link:'#',                                                                    gh:false },
    { cat:'design', img:'images/work-9.png', catLabel:'Design', title:'Poster Design Collection', desc:'Modern, eye-catching posters for events and branding', link:'https://drive.google.com/drive/folders/1OzeVcT1GsX3WOi__MCyfih8wRehL8H83?usp=drive_link', gh:false },
    { cat:'design', img:'images/work-6.png', catLabel:'Design', title:'Brand Guideline', desc:'Professional branding, style guide & assets', link:'https://drive.google.com/drive/folders/1GJg2DWypGS2X1ccn4lJdm8h1nEjZGOXY?usp=drive_link', gh:false },
    { cat: 'design', img: 'images/work-7.png', catLabel: 'Design', title: 'Logo Design', desc: 'Creative and modern logo concepts', link: 'https://drive.google.com/drive/folders/1ebbBzEp2cmZjcyqll1ttpHS6A1pA4dRM?usp=drive_link', gh: false },
    { cat:'web',    img:'images/work-5.png',      catLabel:'E-Commerce',   title:'TECHSWAY',                  desc:'Full-stack gadgets e-commerce store',                 link:'https://github.com/swayamsankar/swayams-digital-mart',                 gh:true  },
    { cat:'ai',     img:'images/work-8.png',      catLabel:'AI',           title:'Expenses Intelligence AI',  desc:'Smart expense tracking and analytics powered by AI',  link:'https://github.com/swayamsankar/Expense_Intelligence_Ai',              gh:true  },
    { cat:'group',  img:'images/group-work-1.png',catLabel:'Group',        title:'Apartment Management',      desc:'Tenant & complaint tracking system',                  link:'https://github.com/swayamsankar/Apartmentsystem',                      gh:true  },
    { cat:'group',  img:'images/group-work-2.png',catLabel:'Group',        title:'Student Management',        desc:'Student records & personal details',                  link:'https://github.com/swayamsankar/Students-Record-Management',           gh:true  },
    { cat:'group',  img:'images/group-work-3.png',catLabel:'Group',        title:'Traffic Management',        desc:'Urban traffic monitoring & optimization',             link:'https://github.com/swayamsankar/Traffic_Management_System',            gh:true  },
  ];

  let filtered = [];
  let stackOrder = [];

  function sendToBack() {
    if (stackOrder.length < 2) return;
    const top = stackOrder.pop();
    stackOrder.unshift(top);
    renderAll();
  }

  function goTo(idx) {
    let safety = stackOrder.length * 2;
    while (stackOrder[stackOrder.length - 1] !== idx && safety-- > 0) {
      const t = stackOrder.pop();
      stackOrder.unshift(t);
    }
    renderAll();
  }

  function initStack(projects) {
    filtered = projects;
    stackOrder = projects.map((_, i) => i);
    renderAll();
  }

  function renderStack() {
    const container = document.getElementById('stack-container');
    container.innerHTML = '';
    const len = stackOrder.length;
    if (len === 0) return;
    const visible = Math.min(len, 4);

    stackOrder.forEach((projIdx, i) => {
      const fromTop = len - 1 - i;
      if (fromTop >= visible) return;

      const proj = filtered[projIdx];
      const card = document.createElement('div');
      card.className = 'stack-card' + (fromTop === 0 ? ' is-top' : '');

      const img = document.createElement('img');
      img.src = proj.img;
      img.alt = proj.title;
      img.draggable = false;
      card.appendChild(img);

      const rotate = fromTop * 4;
      const scale  = 1 + i * 0.06 - len * 0.06;
      card.style.zIndex     = len - fromTop;
      card.style.transform  = `rotateZ(${rotate}deg) scale(${Math.max(scale, 0.7)})`;

      if (fromTop === 0) addDrag(card);
      container.appendChild(card);
    });
  }

  function addDrag(card) {
    let sx = 0, sy = 0, didDrag = false, active = false;
    function threshold() { return card.offsetWidth * 0.28; }

    card.addEventListener('pointerdown', function (e) {
      sx = e.clientX; sy = e.clientY; didDrag = false; active = true;
      card.setPointerCapture(e.pointerId);
      card.classList.add('dragging');
    });

    card.addEventListener('pointermove', function (e) {
      if (!active || !(e.buttons & 1)) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) didDrag = true;
      card.style.transform = `translate(${dx}px,${dy}px) rotateZ(${dx * 0.07}deg)`;
    });

    function finish(e) {
      if (!active) return;
      active = false;
      card.classList.remove('dragging');
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      const t  = threshold();

      if (Math.abs(dx) > t || Math.abs(dy) > t) {
        sendToBack();
      } else {
        card.style.transition = 'transform 0.38s cubic-bezier(0.34,1.4,0.64,1)';
        card.style.transform  = 'rotateZ(0deg) scale(1)';
        card.addEventListener('transitionend', function handler() {
          card.removeEventListener('transitionend', handler);
          renderStack();
        });
        if (!didDrag) sendToBack();
      }
    }

    card.addEventListener('pointerup',     finish);
    card.addEventListener('pointercancel', finish);
  }

  function renderInfo() {
    const el = document.getElementById('stack-info');
    if (!filtered.length) {
      el.innerHTML = '<p style="color:var(--gray)">No projects in this category.</p>';
      return;
    }
    const proj    = filtered[stackOrder[stackOrder.length - 1]];
    const current = stackOrder.indexOf(stackOrder[stackOrder.length - 1]) + 1;

    el.innerHTML = `
      <span class="info-cat">${proj.catLabel}</span>
      <h3 class="info-title">${proj.title}</h3>
      <p class="info-desc">${proj.desc}</p>
      <p class="info-counter">
        <span>${current}</span> / ${filtered.length} projects
      </p>
      <div class="info-actions">
        <a class="info-link" href="${proj.link}" target="_blank" rel="noopener">
          ${proj.gh ? 'View on GitHub' : 'View Project'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </a>
        <button class="info-nav" aria-label="Next project" onclick="window._stackNext()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    `;
  }

  function renderDots() {
    const el  = document.getElementById('stack-dots');
    const top = stackOrder[stackOrder.length - 1];
    el.innerHTML = '';
    filtered.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'sdot' + (i === top ? ' active' : '');
      d.setAttribute('aria-label', 'Go to project ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      el.appendChild(d);
    });
  }

  function renderAll() {
    renderStack();
    renderInfo();
    renderDots();
  }

  window._stackNext = sendToBack;

  document.getElementById('portfolio-tabs').addEventListener('click', function (e) {
    const btn = e.target.closest('.ptab');
    if (!btn) return;
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    initStack(cat === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.cat === cat));
  });

  document.addEventListener('DOMContentLoaded', function () {
    initStack(ALL_PROJECTS);
  });
  if (document.readyState !== 'loading') initStack(ALL_PROJECTS);

})();

// ── Service Section: Smooth Scroll Stack Effect ────────────────
// ── Service Section: ScrollStack (exact port of React ScrollStack component) ────────────────
(function () {
  const config = {
    itemDistance: 100,
    itemScale: 0.03,
    itemStackDistance: 30,
    stackPosition: '20%',
    scaleEndPosition: '10%',
    baseScale: 0.85,
    rotationAmount: 0,
    blurAmount: 0,
    useWindowScroll: true
  };

  let cards = [];
  let cardOffsets = [];
  let endElementTop = 0;
  let stackCompleted = false;
  let rafId = null;
  let isUpdating = false;
  const lastTransforms = new Map();

  function parsePercentage(value, containerHeight) {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }

  function getScrollData(scroller) {
    if (config.useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight
      };
    } else {
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight
      };
    }
  }

  function getElementOffset(element) {
    if (config.useWindowScroll) {
      const rect = element.getBoundingClientRect();
      return rect.top + window.scrollY;
    } else {
      return element.offsetTop;
    }
  }

  function calculateProgress(scrollTop, start, end) {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }

  function recalcOffsets(scroller) {
    cards.forEach((card, i) => {
      cardOffsets[i] = getElementOffset(card);
    });
    const endElement = config.useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scroller.querySelector('.scroll-stack-end');
    endElementTop = endElement ? getElementOffset(endElement) : 0;
  }

  function updateCardTransforms(scroller) {
    if (!cards.length || isUpdating) return;
    isUpdating = true;

    const { scrollTop, containerHeight } = getScrollData(scroller);
    const stackPositionPx = parsePercentage(config.stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(config.scaleEndPosition, containerHeight);

    cards.forEach((card, i) => {
      const cardTop = cardOffsets[i];
      const triggerStart = cardTop - stackPositionPx - config.itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - config.itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = config.baseScale + i * config.itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = config.rotationAmount ? i * config.rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (config.blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cards.length; j++) {
          const jCardTop = cardOffsets[j];
          const jTriggerStart = jCardTop - stackPositionPx - config.itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * config.blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + config.itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + config.itemStackDistance * i;
      }

      const t = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const last = lastTransforms.get(i);
      const changed =
        !last ||
        Math.abs(last.translateY - t.translateY) > 0.1 ||
        Math.abs(last.scale - t.scale) > 0.001 ||
        Math.abs(last.rotation - t.rotation) > 0.1 ||
        Math.abs(last.blur - t.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${t.translateY}px, 0) scale(${t.scale}) rotate(${t.rotation}deg)`;
        card.style.filter = t.blur > 0 ? `blur(${t.blur}px)` : '';
        lastTransforms.set(i, t);
      }

      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompleted) stackCompleted = true;
        else if (!inView && stackCompleted) stackCompleted = false;
      }
    });

    isUpdating = false;
  }

  function initScrollStack() {
    const scroller = document.getElementById('servicesStack');
    if (!scroller) return;

    cards = Array.from(
      config.useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${config.itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.perspective = '1000px';
    });

    const handleScroll = () => updateCardTransforms(scroller);

    let lenis;
    if (config.useWindowScroll) {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });
    } else {
      lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6
      });
    }

    lenis.on('scroll', handleScroll);

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    requestAnimationFrame(() => {
      recalcOffsets(scroller);
      updateCardTransforms(scroller);
    });

    window.addEventListener('resize', () => {
      recalcOffsets(scroller);
      updateCardTransforms(scroller);
    });
  }

  document.addEventListener('DOMContentLoaded', initScrollStack);

})();

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
      await fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
        mode: "no-cors"
      });
      msg.textContent = "Message sent successfully! 🎉";
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