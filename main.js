// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) { this.x -= dx * 0.01; this.y -= dy * 0.01; }
    }
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.14 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

// ===== SLIDE NAVIGATION =====
const slides = document.querySelectorAll('.slide');
const progressBar = document.querySelector('.progress-bar');
const slideNumberFixed = document.querySelector('.slide-number-fixed');
let currentSlide = 0;
const totalSlides = slides.length;

function updateSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'exit-left');
    if (i < index) slide.classList.add('exit-left');
    if (i === index) slide.classList.add('active');
  });
  const progress = ((index + 1) / totalSlides) * 100;
  progressBar.style.width = progress + '%';
  const num = String(index + 1).padStart(2, '0');
  const total = String(totalSlides).padStart(2, '0');
  slideNumberFixed.textContent = num + ' / ' + total;
  if (index === 0) setHeroParticles(true);
  else setHeroParticles(false);
  const slide = slides[index];
  if (slide.classList.contains('slide-digit')) animateDigitTiers();
  if (slide.classList.contains('slide-roi')) animateROI();
  if (slide.classList.contains('slide-results')) animateResults();
  handleRolesVideo(slide);
  currentSlide = index;
}

const slideVideos = [
  { el: document.querySelector('.roles-banner-video'), slideClass: 'slide-roles' },
  { el: document.querySelector('.arch-banner-video'), slideClass: 'slide-arch' },
  { el: document.querySelector('.roadmap-banner-video'), slideClass: 'slide-roadmap' },
];

function handleRolesVideo(activeSlide) {
  slideVideos.forEach(({ el, slideClass }) => {
    if (!el) return;
    if (activeSlide.classList.contains(slideClass)) {
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      el.pause();
    }
  });
}

function setHeroParticles(enhanced) {
  particles.forEach((p) => {
    if (p._baseOpacity === undefined) p._baseOpacity = p.opacity;
    p.opacity = enhanced ? Math.min(p._baseOpacity * 1.6, 0.75) : p._baseOpacity;
  });
}

function animateDigitTiers() {
  const fills = document.querySelectorAll('.slide-digit.active .tier-meter-fill[data-width]');
  fills.forEach((bar) => {
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = bar.getAttribute('data-width');
    }, 200);
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    function update() {
      current += step;
      if (current >= target) { counter.textContent = target.toLocaleString(); return; }
      counter.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(update);
    }
    update();
  });
}

function animateROI() {
  const counters = document.querySelectorAll('.roi-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    function update() {
      current += step;
      if (current >= target) { counter.textContent = target + suffix; return; }
      counter.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
    update();
  });
}

function animateResults() {
  const counters = document.querySelectorAll('.rc-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    function update() {
      current += step;
      if (current >= target) { counter.textContent = target + suffix; return; }
      counter.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
    update();
  });
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  updateSlide(index);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goToSlide(currentSlide + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(currentSlide - 1); }
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
});

// Initialize first slide
updateSlide(0);
