/**
 * VOWELLE — RAKSHITH & TEJASWINI DIGITAL WEDDING INVITATION
 * Interactive Functionality & Audio Synthesis
 * 
 * 1. Wax Seal Envelope Opening Experience & Hero Sequence
 * 2. Top Scroll Progress Indicator
 * 3. Auspicious Shehnai / Tanpura Web Audio Synthesizer (Raag Hamsadhwani)
 * 4. Photo Gallery Touch Lightbox
 * 5. Live Countdown Timer to 18 Dec 2026, 09:45 AM IST
 * 6. Add to Calendar (Google & .ics)
 * 7. Quick Actions (Location, Calendar, Share, Music)
 * 8. Scroll Reveal Animations & Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeOpener();
  initAmbientParticles();
  initScrollProgress();
  initAudioSystem();
  initGalleryLightbox();
  initCountdown();
  initCalendar();
  initNavigation();
  initScrollReveal();
  initQuickActions();
});

/* ==========================================================================
   1. WAX SEAL ENVELOPE OPENING, FLOWER SHOWER & HERO TRIGGER
   ========================================================================== */
function initEnvelopeOpener() {
  const openBtn = document.getElementById('openInvitationBtn');
  const cover = document.getElementById('invitationCover');
  const envelopePlatter = document.getElementById('coverEnvelopePlatter');
  const envelopeTrayCard = document.getElementById('envelopeTrayCard');
  const openHotspot = document.getElementById('openEnvelopeHotspot');

  if (!cover) {
    document.body.classList.remove('invitation-locked');
    document.body.classList.add('hero-started');
    return;
  }

  let isOpening = false;

  function openEnvelope(e) {
    if (isOpening) return;
    isOpening = true;

    // Calculate origin coordinates for flower burst (from wax seal)
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight * 0.52;

    if (openHotspot) {
      const rect = openHotspot.getBoundingClientRect();
      if (rect.width > 0) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    } else if (e && e.clientX) {
      originX = e.clientX;
      originY = e.clientY;
    }

    // 1. Launch dynamic celebratory flower & petal shower
    triggerFlowerShower(originX, originY);

    // 2. Animate envelope opening & inner card emerging
    if (envelopeTrayCard) {
      envelopeTrayCard.classList.add('opening');
    }

    // 3. Start auspicious classical wedding raga
    if (window.vowelleAudio && !window.vowelleAudio.isPlaying) {
      window.vowelleAudio.start();
    }

    // 4. Smoothly unlock and transition to full wedding invitation
    setTimeout(() => {
      cover.classList.add('opened');
      document.body.classList.remove('invitation-locked');
      document.body.classList.add('hero-started');

      // Scroll smoothly to the top of the main invitation card
      const wrapper = document.getElementById('invitationWrapper');
      if (wrapper) {
        wrapper.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1150);
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (envelopePlatter) envelopePlatter.addEventListener('click', openEnvelope);
  if (openHotspot) openHotspot.addEventListener('click', openEnvelope);
}

/* ==========================================================================
   DYNAMIC FLOWER & ROSE PETAL SHOWER PARTICLE ENGINE
   ========================================================================== */
function triggerFlowerShower(originX, originY) {
  const canvas = document.getElementById('flowerBurstCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 65;

  const flowerTypes = ['jasmine', 'rose_pink', 'rose_red', 'marigold', 'gold_star'];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Initial radial explosion velocity
    const speed = 4 + Math.random() * 9;
    const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    particles.push({
      x: originX + (Math.random() - 0.5) * 20,
      y: originY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (2 + Math.random() * 4), // upward lift
      size: 10 + Math.random() * 14,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      wobbleSpeed: 0.05 + Math.random() * 0.08,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: 1,
      type: type,
      gravity: 0.18 + Math.random() * 0.08,
      drag: 0.965
    });
  }

  let animationFrameId;
  let startTime = performance.now();
  const maxDuration = 3200; // ms

  function render(time) {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = (p.vy * p.drag) + p.gravity;
      p.rotation += p.rotSpeed;
      p.x += Math.sin(elapsed * p.wobbleSpeed * 0.05 + p.wobbleOffset) * 0.8;

      if (elapsed > 1600) {
        p.opacity = Math.max(0, 1 - (elapsed - 1600) / 1500);
      }

      if (p.opacity > 0 && p.y < canvas.height + 40) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        drawFlowerShape(ctx, p.type, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0 && elapsed < maxDuration) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  animationFrameId = requestAnimationFrame(render);
}

function drawFlowerShape(ctx, type, size) {
  if (type === 'jasmine') {
    // 5 pure white delicate jasmine petals
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#f5eedb';
    ctx.lineWidth = 1;
    for (let j = 0; j < 5; j++) {
      ctx.save();
      ctx.rotate((j * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, size * 0.45, size * 0.22, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // Jasmine golden center
    ctx.fillStyle = '#e5b839';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'rose_pink' || type === 'rose_red') {
    // Soft curved rose petal
    ctx.fillStyle = type === 'rose_pink' ? '#ff85a1' : '#b31e2b';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.bezierCurveTo(size * 0.6, -size * 0.5, size * 0.6, size * 0.5, 0, size * 0.6);
    ctx.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.6, -size * 0.5, 0, -size * 0.5);
    ctx.fill();
  } else if (type === 'marigold') {
    // Golden marigold yellow petal
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'gold_star') {
    // 4-point golden twinkle star
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(0, size * 0.6);
      ctx.lineTo(size * 0.15, size * 0.15);
    }
    ctx.closePath();
    ctx.fill();
  }
}

/* ==========================================================================
   AMBIENT FLOATING DECORATIVE PARTICLES (Jasmine, Lotus & Gold Pollen <15% Opacity)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambientPetalsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;

  function resize() {
    const wrapper = document.getElementById('invitationWrapper');
    width = canvas.width = wrapper ? wrapper.clientWidth : window.innerWidth;
    // Cover the hero and top sections smoothly
    height = canvas.height = Math.min(1800, document.body.scrollHeight || 1800);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const ambientParticles = [];
  const particleCount = 16; // Kept low for silky-smooth mobile 60fps
  const types = ['jasmine', 'rose_pink', 'gold_star'];

  for (let i = 0; i < particleCount; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: 0.35 + Math.random() * 0.45, // Slow, gentle downward drift
      size: 8 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: 0.05 + Math.random() * 0.08, // Maximum ~0.13 (strictly under 15% as specified)
      type: types[i % types.length]
    });
  }

  let isVisible = true;
  window.addEventListener('scroll', () => {
    // Automatically pause simulation when scrolled past hero / top sections
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    isVisible = scrollY < 1600;
  }, { passive: true });

  function render(time) {
    if (isVisible && document.body.classList.contains('hero-started')) {
      ctx.clearRect(0, 0, width, height);

      ambientParticles.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(time * 0.0015 * p.wobbleSpeed + p.wobbleOffset) * 0.4 + p.vx;
        p.rotation += p.rotSpeed;

        // Wrap around seamlessly
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity; // Always under 15%
        drawFlowerShape(ctx, p.type, p.size);
        ctx.restore();
      });
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   3. AUSPICIOUS SHEHNAI / TANPURA WEB AUDIO SYNTHESIZER
   ========================================================================== */
function initAudioSystem() {
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  const qaMusicBtn = document.getElementById('qaMusicBtn');
  const floatingMusicText = document.getElementById('floatingMusicText');

  let audioObj = new Audio('assets/seetha kalayana vaibhogame.mp3');
  audioObj.loop = true;
  let isPlaying = false;

  function startMusic() {
    audioObj.play().then(() => {
      isPlaying = true;
      updateUI(true);
    }).catch(err => {
      console.log('Audio play failed:', err);
    });
  }

  function stopMusic() {
    audioObj.pause();
    isPlaying = false;
    updateUI(false);
  }

  function toggleMusic() {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  const coverMusicBtn = document.getElementById('coverMusicBtn');
  const coverMusicLabel = document.getElementById('coverMusicLabel');

  function updateUI(playing) {
    if (floatingMusicBtn) {
      if (playing) {
        floatingMusicBtn.classList.add('playing');
        if (floatingMusicText) floatingMusicText.textContent = 'Mute';
      } else {
        floatingMusicBtn.classList.remove('playing');
        if (floatingMusicText) floatingMusicText.textContent = 'Music';
      }
    }
    if (coverMusicBtn && coverMusicLabel) {
      coverMusicLabel.textContent = playing ? 'Mute' : 'Play Music';
    }
    const qaLabelEn = document.getElementById('qaMusicLabelEn');
    if (qaLabelEn) {
      qaLabelEn.textContent = playing ? 'Mute' : 'Music';
    }
  }

  if (floatingMusicBtn) {
    floatingMusicBtn.addEventListener('click', () => {
      floatingMusicBtn.classList.add('ripple-active');
      setTimeout(() => floatingMusicBtn.classList.remove('ripple-active'), 600);
      toggleMusic();
    });
  }

  if (coverMusicBtn) {
    coverMusicBtn.addEventListener('click', toggleMusic);
  }

  if (qaMusicBtn) {
    qaMusicBtn.addEventListener('click', toggleMusic);
  }

  // Expose global controller
  window.vowelleAudio = {
    start: startMusic,
    stop: stopMusic,
    toggle: toggleMusic,
    get isPlaying() { return isPlaying; }
  };
}

/* ==========================================================================
   4. PHOTO GALLERY TOUCH LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const caption = item.getAttribute('data-caption');

      if (fullSrc) lightboxImg.src = fullSrc;
      if (caption && lightboxCaption) lightboxCaption.textContent = caption;

      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. LIVE COUNTDOWN TIMER WITH MICRO-GLOW TRANSITIONS
   ========================================================================== */
function initCountdown() {
  // Wedding Date: 18 December 2026, 09:45:00 AM IST (UTC+5:30)
  const weddingDate = new Date('2026-12-18T09:45:00+05:30').getTime();

  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
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

    const sStr = String(seconds).padStart(2, '0');
    if (secondsEl) {
      if (secondsEl.textContent !== sStr) {
        secondsEl.textContent = sStr;
        const parentUnit = secondsEl.closest('.timer-unit');
        if (parentUnit) {
          parentUnit.classList.add('tick');
          setTimeout(() => parentUnit.classList.remove('tick'), 450);
        }
      }
    }

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   6. ADD TO CALENDAR & MODAL
   ========================================================================== */
function initCalendar() {
  const btnVenueCalendar = document.getElementById('btnVenueCalendar');
  const qaCalendarBtn = document.getElementById('qaCalendarBtn');
  const calendarModal = document.getElementById('calendarModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');

  function openModal() {
    if (calendarModal) calendarModal.classList.add('open');
  }

  function closeModal() {
    if (calendarModal) calendarModal.classList.remove('open');
  }

  if (btnVenueCalendar) btnVenueCalendar.addEventListener('click', openModal);
  if (qaCalendarBtn) qaCalendarBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (calendarModal) {
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) closeModal();
    });
  }

  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      generateAndDownloadIcs();
      closeModal();
      showToast('Wedding calendar invite (.ics) downloaded!');
    });
  }

  function generateAndDownloadIcs() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vowelle//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:wedding-rakshith-tejaswini-20261218@vowelle.com',
      'SUMMARY:Rakshith & Tejaswini Wedding Ceremony',
      'DESCRIPTION:With the divine blessings of Sri Kedaralingeshwara Swamy\\, cordially inviting you to the wedding of Chi. Rakshith & Chi. La. Sow. Tejaswini on Friday\\, 18 December 2026 at 9:45 AM.',
      'LOCATION:Z - CONVENTION HALL\\, Behind Teja International School\\, Parimala Colony\\, Vaddepally\\, Hanamkonda\\, Telangana',
      'DTSTART:20261218T041500Z',
      'DTEND:20261218T083000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Rakshith_Tejaswini_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/* ==========================================================================
   7. QUICK ACTIONS (Location, Calendar, Share, Music)
   ========================================================================== */
function initQuickActions() {
  const qaLocationBtn = document.getElementById('qaLocationBtn');
  const qaShareBtn = document.getElementById('qaShareBtn');

  if (qaLocationBtn) {
    qaLocationBtn.addEventListener('click', () => {
      const venueSection = document.getElementById('venue');
      if (venueSection) {
        venueSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (qaShareBtn) {
    qaShareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Rakshith & Tejaswini Wedding Invitation',
        text: 'You are cordially invited to celebrate the wedding of Rakshith & Tejaswini on 18 December 2026 at Z - Convention Hall, Hanamkonda.',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard();
          }
        }
      } else {
        copyToClipboard();
      }
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Invitation link copied to clipboard!');
    }).catch(() => {
      showToast('Please copy the URL from browser address bar.');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   8. NAVIGATION & CINEMATIC SCROLL REVEAL OBSERVER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link, .btn-invited-nav').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.section, .vowelle-signature-divider, .couple-card, .couple-center-weds, .muhurtham-card-2x2, ' +
    '.tripartite-col, .interactive-panel, .venue-details-col, .venue-map-col, ' +
    '.royal-maroon-shubhamastu-banner, .heartfelt-message-wrap, .vowelle-footer, .complete-album-access'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const parentSec = entry.target.closest('.section') || entry.target;
        if (parentSec && parentSec.classList) {
          parentSec.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  revealTargets.forEach(el => observer.observe(el));
}
