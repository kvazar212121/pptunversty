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
  if (!slide.classList.contains('slide-learning')) closeLearningModal();
  if (!slide.classList.contains('slide-problems')) {
    closeProblemsModal();
    closeIntegrationModal();
  }
  if (!slide.classList.contains('slide-roles')) closeRolesModal();
  handleRolesVideo(slide);
  currentSlide = index;
}

const slideVideos = [
  { el: document.querySelector('.roles-banner-video'), slideClass: 'slide-roles' },
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

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  updateSlide(index);
}

document.addEventListener('keydown', (e) => {
  if (document.body.classList.contains('learning-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLearningModal();
    }
    return;
  }
  if (document.body.classList.contains('integration-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeIntegrationModal();
    }
    return;
  }
  if (document.body.classList.contains('problems-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeProblemsModal();
    }
    return;
  }
  if (document.body.classList.contains('roles-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeRolesModal();
    }
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goToSlide(currentSlide + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(currentSlide - 1); }
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', (e) => {
  if (
    document.body.classList.contains('learning-modal-open') ||
    document.body.classList.contains('integration-modal-open') ||
    document.body.classList.contains('problems-modal-open') ||
    document.body.classList.contains('roles-modal-open')
  ) return;
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
});

// ===== LEARNING MODULLAR — modal =====
const learningModulesData = {
  lms: {
    title: 'LMS kurs boshqaruvi',
    desc: 'Asosiy o\'quv platformasi — kurslar, darslar, topshiriqlar va kabinetlar shu modulda birlashtiriladi.',
    groups: [
      {
        name: 'Kabinetlar (modul ichida)',
        items: ['Talaba kabineti', 'O\'qituvchi kabineti', 'Ota-ona monitoring paneli'],
      },
      {
        name: 'Kurs va darslar',
        items: ['Kurs yaratish va modullar', 'Dars materiallari (video, PDF)', 'Dars jadvali integratsiyasi'],
      },
      {
        name: 'Topshiriqlar',
        items: ['Homework submission', 'Topshiriq baholash', 'Muddat va qayta topshirish'],
      },
      {
        name: 'Boshqaruv',
        items: ['O\'quv jarayonini boshqarish', 'Semestr va guruhlar', 'O\'quv reja nazorati'],
      },
    ],
  },
  hybrid: {
    title: 'Hybrid ta\'lim tizimi',
    desc: 'Auditoriya va masofaviy darslarni bir jadval va formatda boshqarish.',
    groups: [
      {
        name: 'Dars formatlari',
        items: ['Onlayn darslar', 'Offline auditoriya', 'Aralash (blended) rejim'],
      },
      {
        name: 'Jadval va davomat',
        items: ['Hybrid jadval', 'Avtomatik davomat', 'QR / FaceID bilan belgilash'],
      },
    ],
  },
  arvr: {
    title: 'AR/VR laboratoriyalar',
    desc: 'Immersiv laboratoriya tajribalari — virtual va kengaytirilgan haqiqat.',
    groups: [
      {
        name: 'VR laboratoriya',
        items: ['3D virtual muhit', 'Simulyatsiya ssenariylari', 'Xavfsiz tajriba maydoni'],
      },
      {
        name: 'AR materiallar',
        items: ['AR modellar va animatsiya', 'Interaktiv laboratoriya qo\'llanmalari'],
      },
    ],
  },
  conference: {
    title: 'Online konferensiya',
    desc: 'Jonli darslar, uchrashuvlar va yozuvlar — video aloqa moduli.',
    groups: [
      {
        name: 'Jonli aloqa',
        items: ['Video darslar', 'Webinar va uchrashuvlar', 'Ekran ulashish'],
      },
      {
        name: 'Yozuv va arxiv',
        items: ['Dars yozuvlari', 'Transkript va chat arxivi'],
      },
    ],
  },
  exam: {
    title: 'Online test va imtihon',
    desc: 'Baholash tizimi — test bank, imtihon va natijalar.',
    groups: [
      {
        name: 'Testlar',
        items: ['Test bank', 'Random savollar', 'Vaqt cheklovi'],
      },
      {
        name: 'Imtihonlar',
        items: ['Imtihon jadvali', 'Natijalar va qayta topshirish', 'Baholash mezonlari'],
      },
    ],
  },
  proctoring: {
    title: 'AI exam proctoring',
    desc: 'Imtihon paytida sun\'iy intellekt yordamida nazorat va identifikatsiya.',
    groups: [
      {
        name: 'Nazorat kanallari',
        items: ['Kamera nazorati', 'Ekran monitoring', 'Audio tahlil'],
      },
      {
        name: 'AI tahlil',
        items: ['Shubhali holatlar', 'Yuz identifikatsiyasi', 'Hisobot va alertlar'],
      },
    ],
  },
  analytics: {
    title: 'O\'quv analitikasi',
    desc: 'O\'lchanadigan natijalar — dashboard, KPI va shaxsiy tavsiyalar.',
    groups: [
      {
        name: 'Hisobotlar',
        items: ['Dashboard', 'KPI ko\'rsatkichlari', 'Eksport (PDF, Excel)'],
      },
      {
        name: 'Tahlil (modul ichida)',
        items: ['Shaxsiy tavsiyalar', 'Progress va risk guruhi', 'Fan bo\'yicha statistika'],
      },
    ],
  },
  dlab: {
    title: 'Raqamli laboratoriya',
    desc: 'Virtual laboratoriya tajribalari va protokollar.',
    groups: [
      {
        name: 'Tajribalar',
        items: ['Virtual experiment', 'Laboratoriya protokoli', 'Xavfsizlik qoidalari'],
      },
      {
        name: 'Hisob-kitob',
        items: ['Formulalar va grafiklar', 'Natija saqlash va baholash'],
      },
    ],
  },
  library: {
    title: 'Elektron kutubxona',
    desc: 'Raqamli resurslar — kitoblar, jurnallar va o\'qish statistikasi.',
    groups: [
      {
        name: 'Resurslar',
        items: ['Elektron kitoblar', 'Ilmiy jurnallar', 'Ochiq resurslar'],
      },
      {
        name: 'O\'qish',
        items: ['O\'qish statistikasi', 'Bookmark va izohlar', 'Qidiruv va filtr'],
      },
    ],
  },
  micro: {
    title: 'Mikro-kurslar va sertifikatlar',
    desc: 'Qisqa modulli kurslar va avtomatik sertifikatlash.',
    groups: [
      {
        name: 'Mikro-kurslar',
        items: ['Qisqa modulli kurslar', 'Progress tracking', 'Mini-testlar'],
      },
      {
        name: 'Sertifikatlar',
        items: ['Avtomatik sertifikat', 'QR tekshiruv', 'Yutuqlar va badge'],
      },
    ],
  },
  kredit: {
    title: 'Kredit-modul',
    desc: 'Akademik natijalar — avtomatik GPA/ECTS hisoblash, kredit tanlash va raqamli transcript bir tizimda.',
    groups: [
      {
        name: 'Hisoblash va hujjatlar',
        items: ['GPA hisoblash (semestr, umumiy, real-vaqt)', 'Transcript (PDF, QR, imzo, arxiv)', 'Akademik reyting va grant'],
      },
      {
        name: 'Semestr va kredit',
        items: ['Semester boshqaruvi', 'Kredit tanlash', 'Limit va conflict tekshiruvi', 'Navbat (queue)'],
      },
      {
        name: 'Boshqaruv',
        items: ['Dekanat paneli', 'O\'qituvchi tasdiqlash workflow', 'Imzo va log'],
      },
      {
        name: 'Standart va integratsiya',
        items: ['Bologna ECTS', 'Himoyalangan PDF', 'Avtomatik hisob', 'SuperApp integratsiya'],
      },
    ],
  },
};

const learningModal = document.getElementById('learningModal');
const learningModalTitle = learningModal?.querySelector('.learning-modal-title');
const learningModalDesc = learningModal?.querySelector('.learning-modal-desc');
const learningModalGroups = learningModal?.querySelector('.learning-modal-groups');

function openLearningModal(moduleId) {
  const data = learningModulesData[moduleId];
  if (!data || !learningModal) return;

  learningModalTitle.textContent = data.title;
  learningModalDesc.textContent = data.desc;
  learningModalGroups.innerHTML = data.groups
    .map(
      (group) => `
      <div class="learning-modal-group">
        <h4>${group.name}</h4>
        <ul>${group.items.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>`
    )
    .join('');

  learningModal.hidden = false;
  learningModal.classList.add('is-open');
  document.body.classList.add('learning-modal-open');
  learningModal.querySelector('.learning-modal-close')?.focus();
}

function closeLearningModal() {
  if (!learningModal) return;
  learningModal.hidden = true;
  learningModal.classList.remove('is-open');
  document.body.classList.remove('learning-modal-open');
}

function initLearningModules() {
  const slide = document.querySelector('.slide-learning');
  if (!slide || !learningModal) return;

  slide.querySelectorAll('.learning-card[data-module]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLearningModal(btn.getAttribute('data-module'));
    });
  });

  learningModal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeLearningModal);
  });
}

initLearningModules();

// ===== TASHQI MODALLAR (integratsiya + rollar) =====
let integrationModal = null;
let rolesModal = null;

async function appendModalHtml(url) {
  const root = document.getElementById('modals-root');
  if (!root) return false;
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  const wrap = document.createElement('div');
  wrap.innerHTML = await res.text();
  while (wrap.firstChild) root.appendChild(wrap.firstChild);
  return true;
}

async function loadExternalModals() {
  const root = document.getElementById('modals-root');
  if (!root) return;
  root.innerHTML = '';
  try {
    await appendModalHtml('html/integration-modal.html?v=6');
    if (typeof window.renderIntegrationModalGrids === 'function') {
      window.renderIntegrationModalGrids();
    }
    initIntegrationModal();
    await appendModalHtml('html/roles-modals.html?v=2');
    initRolesModal();
  } catch (err) {
    console.warn('Tashqi modallar yuklanmadi:', err);
  }
}

function openIntegrationModal() {
  if (!integrationModal) return;
  integrationModal.hidden = false;
  integrationModal.classList.add('is-open');
  document.body.classList.add('integration-modal-open');
  integrationModal.querySelector('.integration-modal-close')?.focus();
}

function closeIntegrationModal() {
  if (!integrationModal) return;
  integrationModal.hidden = true;
  integrationModal.classList.remove('is-open');
  document.body.classList.remove('integration-modal-open');
}

function initIntegrationModal() {
  integrationModal = document.getElementById('integrationModal');
  document.getElementById('btnOpenIntegration')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openIntegrationModal();
  });
  integrationModal?.querySelectorAll('[data-close-integration-modal]').forEach((el) => {
    el.addEventListener('click', closeIntegrationModal);
  });
}

// ===== ROLLAR MODALI (11-sahifa) =====
function openRolesModal(roleId) {
  if (!rolesModal) rolesModal = document.getElementById('rolesModal');
  if (!rolesModal || !roleId) return;
  if (typeof window.renderRolesModalContent === 'function') {
    window.renderRolesModalContent(roleId);
  }
  rolesModal.hidden = false;
  rolesModal.classList.add('is-open');
  document.body.classList.add('roles-modal-open');
  rolesModal.querySelector('.roles-modal-close')?.focus();
}

function closeRolesModal() {
  if (!rolesModal) rolesModal = document.getElementById('rolesModal');
  if (!rolesModal) return;
  rolesModal.hidden = true;
  rolesModal.classList.remove('is-open');
  document.body.classList.remove('roles-modal-open');
}

function initRolesModal() {
  rolesModal = document.getElementById('rolesModal');
  document.querySelectorAll('[data-open-role-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRolesModal(btn.getAttribute('data-open-role-modal'));
    });
  });
  rolesModal?.querySelectorAll('[data-close-roles-modal]').forEach((el) => {
    el.addEventListener('click', closeRolesModal);
  });
}

// ===== MUAMMOLAR (4-sahifa) — modal =====
const problemsData = {
  paperwork: {
    title: 'Ortiqcha qog\'ozbozlik',
    desc: 'Arizalar, buyruqlar va ma\'lumotnomalar hali ham fizik hujjat va imzo zanjirida.',
    groups: [
      { name: 'Hozirgi holat', items: ['Arizalar qog\'ozda', 'Arxiv xonalarda', 'Qidiruv qiyin'] },
      { name: 'Oqibatlar', items: ['Xarajat ortadi', 'Hujjat yo\'qolishi xavfi'] },
      { name: 'Smart yechim', items: ['Didox elektron imzo', 'Paperless workflow', 'Raqamli arxiv'] },
    ],
  },
  analytics: {
    title: 'Tahlil va reytinglar qo\'lda',
    desc: 'Rahbariyat uchun yagona dashboard yo\'q — KPI Excelda yig\'iladi.',
    groups: [
      { name: 'Hozirgi holat', items: ['Excel jadvallar', 'Qo\'lda yig\'ish', 'Kechikkan ma\'lumot'] },
      { name: 'Oqibatlar', items: ['Noto\'g\'ri qarorlar', 'Reytingda adolatsizlik'] },
      { name: 'Smart yechim', items: ['KPI Dashboard', 'O\'quv analitikasi', 'Avtomatik hisobot'] },
    ],
  },
  security: {
    title: 'Kiberxavfsizlik zaif',
    desc: 'Shaxsiy va akademik ma\'lumotlar himoyasi yetarli emas.',
    groups: [
      { name: 'Hozirgi holat', items: ['Zaif parol siyosati', 'Audit kam', 'Ma\'lumotlar tarqoq'] },
      { name: 'Oqibatlar', items: ['Ma\'lumot oqishi xavfi', 'Ishonch pasayishi'] },
      { name: 'Smart yechim', items: ['RBAC va 2FA', 'Audit log', 'Shifrlash'] },
    ],
  },
  services: {
    title: 'Xizmatlar raqamlashtirilmagan',
    desc: 'TTJ, to\'lov va kampus xizmatlari uchun yagona mobil kanal yo\'q.',
    groups: [
      { name: 'Hozirgi holat', items: ['Navbat va qo\'lda ariza', 'To\'lov alohida', 'Talaba tarqoq murojaat'] },
      { name: 'Oqibatlar', items: ['Talaba norozi', 'Xodim yuklamasi ortadi'] },
      { name: 'Smart yechim', items: ['SuperApp', 'Onlayn to\'lov', 'TTJ moduli'] },
    ],
  },
  workload: {
    title: 'Yuklamalar hisobi murakkab',
    desc: 'Dars soatlari, baholar va yuklama turli tizimlarda.',
    groups: [
      { name: 'Hozirgi holat', items: ['Dars soati alohida', 'Baho LMS/Excelda', 'Qo\'lda tekshiruv'] },
      { name: 'Oqibatlar', items: ['Xatolik va nizolar', 'Reja-fakt farqi'] },
      { name: 'Smart yechim', items: ['Dars yuklamasi moduli', 'LMS integratsiya', 'Avtomatik KPI'] },
    ],
  },
  admission: {
    title: 'Qabulda yagona baza yo\'q',
    desc: 'Abituriyent hujjatlari Telegram, email yoki qog\'ozda.',
    groups: [
      { name: 'Hozirgi holat', items: ['Telegram/qog\'oz', 'Hujjatlar tarqoq', 'Status noma\'lum'] },
      { name: 'Oqibatlar', items: ['Ariza yo\'qolishi', 'Qabul sekin'] },
      { name: 'Smart yechim', items: ['Qabul portali', 'Onlayn status', 'Raqamli arxiv'] },
    ],
  },
  appeals: {
    title: 'Murojaatlar tizimsiz',
    desc: 'Murojaatlar yagona markazda emas — Excel va chatda yo\'qoladi.',
    groups: [
      { name: 'Hozirgi holat', items: ['Telefon/Telegram', 'Ro\'yxatga olinmaydi', 'SLA yo\'q'] },
      { name: 'Oqibatlar', items: ['Murojaat e\'tiborsiz', 'Takroriy savollar'] },
      { name: 'Smart yechim', items: ['Murojaat markazi', 'Ticket va SLA', 'SuperApp'] },
    ],
  },
};

const problemsModal = document.getElementById('problemsModal');
const problemsModalTitle = problemsModal?.querySelector('.problems-modal-title');
const problemsModalDesc = problemsModal?.querySelector('.problems-modal-desc');
const problemsModalGroups = problemsModal?.querySelector('.problems-modal-groups');

function openProblemsModal(problemId) {
  const data = problemsData[problemId];
  if (!data || !problemsModal) return;
  problemsModalTitle.textContent = data.title;
  problemsModalDesc.textContent = data.desc;
  problemsModalGroups.innerHTML = data.groups
    .map(
      (g) => `<div class="problems-modal-group"><h4>${g.name}</h4><ul>${g.items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`
    )
    .join('');
  problemsModal.hidden = false;
  problemsModal.classList.add('is-open');
  document.body.classList.add('problems-modal-open');
  problemsModal.querySelector('.problems-modal-close')?.focus();
}

function closeProblemsModal() {
  if (!problemsModal) return;
  problemsModal.hidden = true;
  problemsModal.classList.remove('is-open');
  document.body.classList.remove('problems-modal-open');
}

function initProblemsModal() {
  const slide = document.querySelector('.slide-problems');
  if (!slide || !problemsModal) return;
  slide.querySelectorAll('.problem-card[data-problem]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProblemsModal(btn.getAttribute('data-problem'));
    });
  });
  problemsModal.querySelectorAll('[data-close-problems-modal]').forEach((el) => {
    el.addEventListener('click', closeProblemsModal);
  });
}

async function bootPresentation() {
  await loadExternalModals();
  initProblemsModal();
  updateSlide(0);
}

bootPresentation();
