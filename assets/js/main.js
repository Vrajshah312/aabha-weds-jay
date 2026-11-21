document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-screen');
  const poster = document.getElementById('door-poster');
  const video = document.getElementById('invitation-video');
  const coupleScreen = document.getElementById('couple-screen');
  const scrollCue = document.getElementById('hero-scroll-cue');
  const audio = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle');

  let hasStarted = false;
  let hasTransitioned = false;

  // Initialize Scroll Reveal Observer (Exact ShubhWeds mechanism)
  initScrollReveal();

  const finishDoorAnimation = () => {
    if (hasTransitioned) return;
    hasTransitioned = true;

    // 1. Reveal Aabha Weds Jay plaque screen
    if (coupleScreen) coupleScreen.classList.add('active');

    // 2. Unlock scrolling (just like ShubhWeds)
    document.documentElement.classList.remove('is-locked');
    document.body.classList.remove('is-locked');

    // 3. Reveal the "Scroll Down ↓" button smoothly
    setTimeout(() => {
      if (scrollCue) scrollCue.classList.add('visible');
    }, 600);
  };

  const handleStart = (e) => {
    if (hasStarted) return;
    hasStarted = true;

    // Start background wedding music (unlocked on this direct user gesture)
    if (audio) {
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (musicToggle) musicToggle.classList.add('playing');
        }).catch(err => {
          console.warn('Audio play error:', err);
        });
      }
    }

    // Hide initial static door immediately
    if (poster) poster.classList.add('hidden');

    if (video) {
      // Ensure muted and playsinline attributes for 100% mobile browser approval
      video.muted = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.currentTime = 0;

      const videoPromise = video.play();
      if (videoPromise !== undefined) {
        videoPromise.catch(err => {
          console.warn('Mobile video autoplay prevented, transitioning to couple plaque:', err);
          finishDoorAnimation();
        });
      }

      // Check when video ends normally
      video.addEventListener('ended', finishDoorAnimation);

      // Fallback timeout in case mobile browser hangs on ended event (video duration is 10.5s)
      setTimeout(finishDoorAnimation, 11500);
    } else {
      finishDoorAnimation();
    }
  };

  // Attach touch and click events across container, poster, and video
  if (container) {
    container.addEventListener('click', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: true });
    container.addEventListener('pointerdown', handleStart);
  }
  if (poster) {
    poster.addEventListener('click', handleStart);
    poster.addEventListener('touchstart', handleStart, { passive: true });
    poster.addEventListener('pointerdown', handleStart);
  }

  // Floating Music Toggle
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      musicToggle.classList.add('playing');
    } else {
      audio.pause();
      musicToggle.classList.remove('playing');
    }
  });

  // Smooth scroll click handler
  scrollCue.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('first-page');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ==========================================================================
   ShubhWeds Intersection Observer for [data-reveal="up"]
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* ==========================================================================
   ShubhWeds Scratch Heart Interactive Card Implementation
   ========================================================================== */
function initScratchCard() {
  const foilCanvas = document.getElementById('scratch-foil');
  const shimmer = document.getElementById('scratch-shimmer');
  const dateEl = document.getElementById('scratch-date');
  const hintEl = document.getElementById('scratch-hint');
  const confettiCanvas = document.getElementById('scratch-confetti');
  const sparksContainer = document.getElementById('sparks');

  if (!foilCanvas) return;

  // 1. Generate Floating Gold Sparks
  if (sparksContainer) {
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      const size = Math.random() * 4 + 2;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.animationDelay = `${Math.random() * 5}s`;
      spark.style.animationDuration = `${Math.random() * 4 + 4}s`;
      sparksContainer.appendChild(spark);
    }
  }

  // 2. Setup HiDPI Metallic Foil Canvas
  const ctx = foilCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let rect = foilCanvas.getBoundingClientRect();
  let width = rect.width || 340;
  let height = rect.height || 340;

  function resizeCanvas() {
    rect = foilCanvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    foilCanvas.width = width * dpr;
    foilCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    renderMetallicFoil();
  }

  function renderMetallicFoil() {
    // Rich 5-Stop Metallic Gold Gradient (Exact ShubhWeds)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.25, '#f6e29a');
    grad.addColorStop(0.5, '#c9a227');
    grad.addColorStop(0.75, '#fdf2a9');
    grad.addColorStop(1, '#aa771c');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Glitter / Noise texture
    const noiseCount = Math.floor(width * height * 0.035);
    for (let i = 0; i < noiseCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // Initial render
  resizeCanvas();
  window.addEventListener('resize', () => {
    if (!isCleared) resizeCanvas();
  });

  // 3. Scratch State & Coverage Grid (8x8 active cells = 64 cells)
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let isCleared = false;
  let hasShimmered = false;
  const gridRows = 8;
  const gridCols = 8;
  const visitedCells = new Set();
  const totalCells = gridRows * gridCols;

  function markGrid(x, y) {
    const col = Math.floor((x / width) * gridCols);
    const row = Math.floor((y / height) * gridRows);
    if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
      visitedCells.add(`${row}-${col}`);
    }
  }

  function checkProgress() {
    const percent = (visitedCells.size / totalCells) * 100;

    // Trigger shimmer at 14%
    if (percent >= 14 && !hasShimmered && shimmer) {
      hasShimmered = true;
      shimmer.removeAttribute('hidden');
    }

    // Auto-reveal at 24%
    if (percent >= 24 && !isCleared) {
      triggerReveal();
    }
  }

  function triggerReveal() {
    isCleared = true;
    foilCanvas.classList.add('is-cleared');
    if (hintEl) hintEl.classList.add('is-done');
    if (dateEl) dateEl.classList.add('is-in');
    runConfetti();
  }

  // 4. Scratch Erase Brush (destination-out radial gradient)
  function eraseDot(x, y) {
    const radius = width * 0.11;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const radGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radGrad.addColorStop(0.65, 'rgba(0,0,0,0.85)');
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    markGrid(x, y);
  }

  function eraseLine(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const step = Math.max(width * 0.02, 3);
    const steps = Math.ceil(dist / step);
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      eraseDot(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
    }
    checkProgress();
  }

  function getCoords(e) {
    const r = foilCanvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  }

  // Pointer Events (Unified touch & mouse)
  foilCanvas.addEventListener('pointerdown', (e) => {
    if (isCleared) return;
    foilCanvas.setPointerCapture(e.pointerId);
    isDrawing = true;
    const { x, y } = getCoords(e);
    lastX = x;
    lastY = y;
    eraseDot(x, y);
    checkProgress();
  });

  foilCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || isCleared) return;
    const { x, y } = getCoords(e);
    eraseLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  });

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    try { foilCanvas.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  foilCanvas.addEventListener('pointerup', stopDrawing);
  foilCanvas.addEventListener('pointercancel', stopDrawing);

  // 5. Gold & Ivory Confetti Shower on Reveal (Exact ShubhWeds)
  function runConfetti() {
    if (!confettiCanvas) return;
    const cCtx = confettiCanvas.getContext('2d');
    const cWidth = confettiCanvas.offsetWidth || 600;
    const cHeight = confettiCanvas.offsetHeight || 600;
    confettiCanvas.width = cWidth * dpr;
    confettiCanvas.height = cHeight * dpr;
    cCtx.scale(dpr, dpr);

    const colors = ['#d4af37', '#fdf2a9', '#c9a227', '#ffffff', '#e8c978'];
    const particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: cWidth / 2,
        y: cHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    function animate() {
      cCtx.clearRect(0, 0, cWidth, cHeight);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          cCtx.save();
          cCtx.translate(p.x, p.y);
          cCtx.rotate((p.rotation * Math.PI) / 180);
          cCtx.globalAlpha = Math.max(0, p.opacity);
          cCtx.fillStyle = p.color;
          cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          cCtx.restore();
        }
      });

      frame++;
      if (alive && frame < 120) {
        requestAnimationFrame(animate);
      } else {
        cCtx.clearRect(0, 0, cWidth, cHeight);
      }
    }
    requestAnimationFrame(animate);
  }
}

// Call on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initScratchCard);


/* ==========================================================================
   Countdown Timer Logic
   ========================================================================== */
function initCountdown() {
  const cdElement = document.getElementById('countdown');
  if (!cdElement) return;

  const targetDateStr = cdElement.getAttribute('data-countdown') || '2027-02-14T19:00:00';
  const targetDate = new Date(targetDateStr).getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

window.addEventListener('DOMContentLoaded', initCountdown);


/* ==========================================================================
   Ensure Event Videos Autoplay on Scroll / View
   ========================================================================== */
function initEventVideos() {
  const eventVideos = document.querySelectorAll('.event__video');
  if (!eventVideos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        vid.muted = true;
        vid.play().catch(e => console.log('Autoplay deferred:', e));
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.25 });

  eventVideos.forEach(vid => {
    observer.observe(vid);
    // Tap to toggle play/pause
    vid.addEventListener('click', () => {
      if (vid.paused) {
        vid.play();
      } else {
        vid.pause();
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', initEventVideos);

/* ==========================================================================
   ShubhWeds 3D Carousel for "Our Story" Section
   ========================================================================== */
function initStoryCarousel() {
  const container = document.getElementById('carousel');
  if (!container) return;

  const slides = Array.prototype.slice.call(container.children);
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const interval = 3500;
  const swipeThreshold = 50;

  function update() {
    slides.forEach((slide, idx) => {
      let diff = idx - currentIndex;
      if (diff > 1) diff -= slides.length;
      if (diff < -1) diff += slides.length;

      slide.classList.toggle('is-current', diff === 0);
      slide.classList.toggle('is-next', diff === 1);
      slide.classList.toggle('is-prev', diff === -1);
    });
  }

  function advance(step) {
    currentIndex = (currentIndex + step + slides.length) % slides.length;
    update();
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => advance(1), interval);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Autoplay only when carousel is visible in viewport
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    }, { threshold: 0.2 }).observe(container);
  } else {
    startAutoplay();
  }

  // Pointer drag and touch swipe support
  let startX = null;

  container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    stopAutoplay();
  });

  container.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > swipeThreshold) {
      advance(diff > 0 ? 1 : -1);
    }
    startX = null;
    startAutoplay();
  });

  container.addEventListener('pointerleave', () => {
    if (startX !== null) {
      startX = null;
      startAutoplay();
    }
  });

  // Clicking directly on prev or next photo navigates to it
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('is-next')) advance(1);
      else if (slide.classList.contains('is-prev')) advance(-1);
    });
  });

  update();
}

window.addEventListener('DOMContentLoaded', initStoryCarousel);
