// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
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
    this.size = Math.random() * 2.2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.45 + 0.35;
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
    ctx.fillStyle = `rgba(0, 201, 167, ${this.opacity})`;
    ctx.shadowColor = 'rgba(0, 201, 167, 0.65)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 201, 167, ${0.22 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.8;
        ctx.shadowColor = 'rgba(0, 201, 167, 0.4)';
        ctx.shadowBlur = 3;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.shadowBlur = 0;
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
const deckPrevBtn = document.getElementById('deck-prev');
const deckNextBtn = document.getElementById('deck-next');
const deckCountEl = document.getElementById('deck-count');
let currentSlide = 0;
const totalSlides = slides.length;

function updateDeckNav(index) {
  if (!deckCountEl) return;
  const num = String(index + 1).padStart(2, '0');
  const total = String(totalSlides).padStart(2, '0');
  deckCountEl.textContent = num + ' / ' + total;
  if (deckPrevBtn) deckPrevBtn.disabled = index <= 0;
  if (deckNextBtn) deckNextBtn.disabled = index >= totalSlides - 1;
}

function updateSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'exit-left');
    if (i < index) slide.classList.add('exit-left');
    if (i === index) slide.classList.add('active');
  });
  updateDeckNav(index);
  if (index === 0) setHeroParticles(true);
  else setHeroParticles(false);
  const slide = slides[index];
  if (!slide.classList.contains('slide-learning')) closeLearningModal();
  if (!slide.classList.contains('slide-directions')) {
    closeRolesModal();
  }
  if (!slide.classList.contains('slide-problems')) {
    closeProblemsModal();
    closeIntegrationModal();
  }
  if (!slide.classList.contains('slide-strategy')) {
    closeStrategyDetailModal();
  }
  if (!slide.classList.contains('slide-role-models')) closeRoleModelModal();
  else slide.scrollTop = 0;
  if (slide.classList.contains('slide-results') || slide.classList.contains('slide-transform')) slide.scrollTop = 0;
  currentSlide = index;
}

function setHeroParticles(enhanced) {
  particles.forEach((p) => {
    if (p._baseOpacity === undefined) p._baseOpacity = p.opacity;
    p.opacity = enhanced ? Math.min(p._baseOpacity * 1.5, 0.95) : p._baseOpacity;
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
  if (document.body.classList.contains('strategy-detail-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeStrategyDetailModal();
    }
    return;
  }
  if (document.body.classList.contains('role-model-modal-open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeRoleModelModal();
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
    document.body.classList.contains('roles-modal-open') ||
    document.body.classList.contains('strategy-detail-modal-open') ||
    document.body.classList.contains('role-model-modal-open')
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
let strategyDetailModal = null;
let roleModelModal = null;

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

// ===== STRATEGIK YECHIM MODALI (4-sahifa) =====
const strategyDetailData = {
  learning: {
    kicker: 'Strategik yechim 01',
    title: 'Smart Learning',
    intro:
      "Smart Learning universitetning o'quv jarayonlarini yagona akademik platformaga birlashtiradi. Maqsad: rejalashtirish, dars jarayoni, baholash, kontent, amaliyot va o'quv analitikasini bitta boshqariladigan muhitda yuritish.",
    blocks: [
      {
        tone: 'green',
        title: 'Asosiy qamrov',
        items: [
          "O'quv rejalari, fanlar katalogi, ishchi dasturlar va akademik parametrlarni markazlashtirish.",
          "Professor-o'qituvchilar ish rejasi, o'quv yuklamasi va fan taqsimotini yagona bazada yuritish.",
          "Dars jadvali, auditoriya bandligi va guruh/fan/o'qituvchi kesimidagi moslikni nazorat qilish.",
        ],
      },
      {
        tone: 'yellow',
        title: "O'quv jarayoni",
        items: [
          "Ma'ruza, amaliy mashg'ulot, laboratoriya va mustaqil ta'lim materiallarini turli elektron kutubxonada saqlash.",
          "Baholar qaydnomasi, davomat, oraliq va yakuniy nazorat natijalarini elektron yuritish.",
          "Talabalarning o'zlashtirishi, akademik qarzdorlik va xavf guruhlarini tezkor aniqlash.",
        ],
      },
      {
        tone: 'green',
        title: 'AI imkoniyatlari',
        items: [
          "AI professor orqali fan bo'yicha individual tushuntirish, test tayyorlash va qo'shimcha material tavsiya qilish.",
          "Talabaga shaxsiy o'quv progressi asosida tavsiyalar berish.",
          "O'qituvchi va dekanat uchun akademik signalizatsiya va prognoz ko'rsatkichlarini shakllantirish.",
        ],
      },
      {
        tone: 'red',
        title: 'Integratsiyalar',
        items: [
          "HEMIS va Moodle bilan ma'lumot almashinuvi uchun API qatlamini tayyorlash.",
          "Talaba profili, guruh, fan, baholash va kontent ma'lumotlarini yagona master data bilan bog'lash.",
          "Mobil ilova va web kabinetlar orqali talaba, o'qituvchi va dekanat rollarini ulash.",
        ],
      },
      {
        tone: 'gold',
        title: 'Kutiladigan natija',
        items: [
          "O'quv jarayonlaridagi takroriy kiritish va qog'oz tasdiqlar kamayadi.",
          "Talaba, o'qituvchi, kafedra va dekanat uchun shaffof akademik monitoring paydo bo'ladi.",
          "Ta'lim sifati va o'zlashtirish bo'yicha real vaqt analitikasi shakllanadi.",
        ],
      },
    ],
  },
  management: {
    kicker: 'Strategik yechim 02',
    title: 'Smart Management',
    intro:
      "Smart Management universitetning ma'muriy, moliyaviy, hujjat, resurs va xizmat jarayonlarini yagona boshqaruv muhitiga olib kiradi. Maqsad: ijro intizomi, shaffoflik, tezkor monitoring va raqamli workflow tizimini yaratish.",
    blocks: [
      {
        tone: 'green',
        title: 'Asosiy qamrov',
        items: [
          "Ichki buyruqlar, xizmat yozishmalari, topshiriqlar va kelishuv jarayonlarini elektron workflow orqali yuritish.",
          "Arizalar, murojaatlar, shartnomalar, arxiv va ombor jarayonlarini yagona platformada boshqarish.",
          "Bo'limlar kesimida ijro muddati, mas'ul shaxs va jarayon statuslarini kuzatish.",
        ],
      },
      {
        tone: 'yellow',
        title: 'Boshqaruv modullari',
        items: [
          "Devonxona va elektron hujjat aylanishi: ro'yxatga olish, yo'naltirish, tanishtirish va ijro nazorati.",
          "HR va xodimlar boshqaruvi: xodim profili, ta'til, xizmat safari va ichki buyruqlar.",
          "Moliya, shartnoma va ombor: to'lov, xarajat, tovar-moddiy boyliklar va inventarizatsiya nazorati.",
        ],
      },
      {
        tone: 'green',
        title: 'Rahbariyat paneli',
        items: [
          "Rektorat uchun KPI, ijro intizomi, bo'limlar samaradorligi va resurslar holatini real vaqt dashboardda ko'rsatish.",
          "Kechikayotgan topshiriqlar, muammoli jarayonlar va resurslardan foydalanish bo'yicha signal indikatorlarini chiqarish.",
          "Strategik qarorlar uchun boshqaruv analitikasi va hisobotlarni avtomatik shakllantirish.",
        ],
      },
      {
        tone: 'red',
        title: 'Integratsiyalar',
        items: [
          "UzASBO 2, hrm.argos.uz va EDO.IJRO.UZ kabi tashqi tizimlar bilan API asosida ma'lumot almashish.",
          "Elektron imzo, role-based access va audit log orqali hujjatlarning qonuniyligi hamda izchilligini ta'minlash.",
          "Smart Learning va Smart Campus ma'lumotlarini boshqaruv dashboardi bilan bog'lash.",
        ],
      },
      {
        tone: 'gold',
        title: 'Kutiladigan natija',
        items: [
          "Qog'oz hujjat aylanishi va qo'lda nazorat qilish hajmi kamayadi.",
          "Ijro intizomi, bo'limlararo koordinatsiya va rahbariyat nazorati kuchayadi.",
          "Universitet boshqaruvi tezkor, o'lchanadigan va shaffof modelga o'tadi.",
        ],
      },
    ],
  },
  campus: {
    kicker: 'Strategik yechim 03',
    title: 'Smart Campus',
    intro:
      "Smart Campus IoT, AI video analytics va AKT texnologiyalari asosida universitet infratuzilmasini aqlli boshqaruv tizimiga aylantiradi. Maqsad: xavfsizlik, resurslardan samarali foydalanish va campus xizmatlarini real vaqt rejimida nazorat qilish.",
    blocks: [
      {
        tone: 'green',
        title: 'Asosiy qamrov',
        items: [
          "Smart kirish: FaceID, QR va raqamli identifikatsiya orqali kirish-chiqish nazorati.",
          "AI video kuzatuv, SOS tizimi va xavfsizlik ogohlantirishlarini markaziy monitoringga ulash.",
          "Parking, universitet transporti, auditoriya va campus resurslarini raqamli kuzatish.",
        ],
      },
      {
        tone: 'yellow',
        title: 'IoT va infratuzilma',
        items: [
          "Harorat, mikroiqlim, auditoriya bandligi va qurilmalar holatini IoT sensorlar orqali kuzatish.",
          "Auditoriya, laboratoriya, TTJ va umumiy joylarda resurslardan foydalanish samaradorligini tahlil qilish.",
          "Texnik xizmat, nosozliklar va servis so'rovlarini raqamli ijro zanjiriga ulash.",
        ],
      },
      {
        tone: 'green',
        title: 'Xavfsizlik modeli',
        items: [
          "Kampus hududidagi ruxsatsiz kirish, favqulodda vaziyat va xavf signallarini tezkor aniqlash.",
          "Xavfsizlik xizmatida real vaqt monitoringi, hodisa tarixi va javob berish mexanizmini yaratish.",
          "Talaba, xodim va mehmonlar uchun ruxsat darajalarini raqamli identifikatsiya asosida boshqarish.",
        ],
      },
      {
        tone: 'red',
        title: 'Integratsiyalar',
        items: [
          "Smart Management bilan xizmat so'rovlari, texnik vazifalar va ijro nazoratini bog'lash.",
          "Smart Learning bilan auditoriya bandligi, dars jadvali va o'quv resurslari monitoringini bog'lash.",
          "Campus qurilmalari, sensorlar, access control va transport GPS ma'lumotlarini yagona dashboardga chiqarish.",
        ],
      },
      {
        tone: 'gold',
        title: 'Kutiladigan natija',
        items: [
          "Campus xavfsizligi, infratuzilma nazorati va xizmat ko'rsatish tezligi oshadi.",
          "Energiya, auditoriya, parking va transport resurslaridan foydalanish samaradorligi yaxshilanadi.",
          "Universitetda smart infrastructure modeli shakllanadi va boshqaruv qarorlari real ma'lumotga tayanadi.",
        ],
      },
    ],
  },
};

function openStrategyDetailModal(id) {
  if (!strategyDetailModal) strategyDetailModal = document.getElementById('strategyDetailModal');
  const data = strategyDetailData[id];
  if (!strategyDetailModal || !data) return;
  const kicker = strategyDetailModal.querySelector('#strategyDetailKicker');
  const title = strategyDetailModal.querySelector('#strategyDetailTitle');
  const intro = strategyDetailModal.querySelector('#strategyDetailIntro');
  const grid = strategyDetailModal.querySelector('#strategyDetailGrid');

  if (kicker) kicker.textContent = data.kicker;
  if (title) title.textContent = data.title;
  if (intro) intro.textContent = data.intro;
  if (grid) {
    grid.innerHTML = data.blocks
      .map(
        (b) => `<section class="strategy-detail-block strategy-detail-block--${b.tone}">
          <h4>${b.title}</h4>
          <ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>
        </section>`
      )
      .join('');
  }

  strategyDetailModal.hidden = false;
  strategyDetailModal.classList.add('is-open');
  document.body.classList.add('strategy-detail-modal-open');
  strategyDetailModal.querySelector('.strategy-detail-close')?.focus();
}

function closeStrategyDetailModal() {
  if (!strategyDetailModal) strategyDetailModal = document.getElementById('strategyDetailModal');
  if (!strategyDetailModal) return;
  strategyDetailModal.hidden = true;
  strategyDetailModal.classList.remove('is-open');
  document.body.classList.remove('strategy-detail-modal-open');
}

function initStrategyDetailModal() {
  strategyDetailModal = document.getElementById('strategyDetailModal');
  document.querySelectorAll('[data-open-strategy-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStrategyDetailModal(btn.getAttribute('data-open-strategy-modal'));
    });
  });
  strategyDetailModal?.querySelectorAll('[data-close-strategy-modal]').forEach((el) => {
    el.addEventListener('click', closeStrategyDetailModal);
  });
}

// ===== ROLLAR MODELI (10-sahifa) — chip modal =====
const ROLE_MODEL_ICON_SVG = {
  student:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  teacher:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  'head-department':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  dean:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>',
  registrar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  'practice-coordinator':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  'academic-admin':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  'academic-analyst':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-6 4 3 5-8"/></svg>',
  rectorate:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M6 21V9l6-4 6 4v12"/><path d="M10 9h4"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>',
  'executive-lead':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  'department-staff':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11v2a4 4 0 0 1-4 4h-1"/></svg>',
  office:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  'hr-specialist':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
  finance:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>',
  'warehouse-manager':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  'archive-officer':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
  'security-service':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  'campus-admin':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-1-2-4-4-4-7-4-10a8 8 0 0 1 16 0c0 3-1 6-4 10-4 4-4 4Z"/><circle cx="12" cy="11" r="2"/></svg>',
  'ttj-manager':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/></svg>',
  'parking-operator':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
  'iot-operator':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
  'transport-dispatcher':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3v-5h-5"/><path d="M6 18H3v-5h5"/></svg>',
  'technical-service':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  'system-admin':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>',
  default:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>',
};

function decorateRoleModelButtons() {
  document.querySelectorAll('[data-open-role-model]').forEach((btn) => {
    if (btn.querySelector('.role-models-btn-label')) return;
    const roleId = btn.getAttribute('data-open-role-model');
    const label = btn.textContent.trim();
    const icon = ROLE_MODEL_ICON_SVG[roleId] || ROLE_MODEL_ICON_SVG.default;
    btn.innerHTML = `<span class="role-models-btn-icon" aria-hidden="true">${icon}</span><span class="role-models-btn-label">${label}</span><span class="role-models-btn-plus" aria-hidden="true">+</span>`;
  });
}

const roleModelDetailsData = {
  student: {
    kicker: 'Smart Learning roli',
    title: 'Talaba',
    intro: "Talabaning kundalik o'quv jarayonlari, baholash va shaxsiy rivojlanishini boshqarish roli.",
    blocks: [
      { title: 'Asosiy funksiyalar', items: ['Dars jadvali va fanlar', "Davomat va baholar", "Topshiriqlar va muddatlar"] },
      { title: 'Xizmatlar', items: ['Ariza yuborish', 'Shaxsiy kabinet', "To'lov va stipendiya holati"] },
    ],
  },
  teacher: {
    kicker: 'Smart Learning roli',
    title: "Professor-o'qituvchi",
    intro: "Darsni rejalashtirish, baholash va kontent yuklashni boshqaradigan akademik rol.",
    blocks: [
      { title: 'O‘quv jarayoni', items: ['Fan reja va syllabus', 'Davomat belgilash', "Oraliq/yakuniy baholash"] },
      { title: 'Kontent', items: ['Maʼruza materiallari', 'Test va topshiriqlar', "Talabalar feedback'i"] },
    ],
  },
  'head-department': { kicker: 'Smart Learning roli', title: 'Kafedra mudiri', intro: "Kafedra miqyosida o'quv yuklama, sifat va ijro nazorati uchun mas'ul rol.", blocks: [{ title: 'Nazorat', items: ['Yuklama taqsimoti', "O'qituvchi KPI", "Fanlar sifati monitoringi"] }, { title: 'Tasdiqlash', items: ['Ishchi dasturlar', 'Jadval bo‘yicha kelishuv', "Hisobotlarni ko'rib chiqish"] }] },
  dean: { kicker: 'Smart Learning roli', title: 'Dekan / Dekanat', intro: 'Fakultet darajasida akademik jarayonlarni boshqarish va tasdiqlash roli.', blocks: [{ title: 'Boshqaruv', items: ['Fakultet davomat statistikasi', 'Akademik qarzdorlik nazorati', 'Kursdan-kursga o‘tish'] }, { title: 'Hujjat', items: ['Buyruq va farmoyishlar', "Talaba harakati bo'yicha qarorlar"] }] },
  registrar: { kicker: 'Smart Learning roli', title: 'Registrator ofisi', intro: "Talaba kontingenti, guruhlar va akademik hujjatlar yuritiladigan markaziy ofis roli.", blocks: [{ title: 'Ma’lumotlar', items: ['Talaba profili va statusi', 'Guruhlar shakllantirish', 'Academic record'] }, { title: 'Xizmatlar', items: ['Ma’lumotnoma berish', 'Transcript tayyorlash'] }] },
  'practice-coordinator': { kicker: 'Smart Learning roli', title: 'Amaliyot koordinatori', intro: 'Ishlab chiqarish amaliyoti va tashkilotlar bilan bog‘liq jarayonlarni boshqarish roli.', blocks: [{ title: 'Amaliyot', items: ['Joylash va biriktirish', 'Amaliyot jadvali', 'Kundalik nazorati'] }, { title: 'Hisobot', items: ['Korxona fikri', 'Amaliyot yakuniy bahosi'] }] },
  'academic-admin': { kicker: 'Smart Learning roli', title: 'Akademik administrator', intro: 'Tizimda o‘quv jarayonining texnik-parametrik sozlamalarini yurituvchi rol.', blocks: [{ title: 'Sozlamalar', items: ['Semestr parametrlari', 'Fan va guruh mapping', 'Kalendar boshqaruvi'] }, { title: 'Qo‘llab-quvvatlash', items: ['Foydalanuvchi huquqlari', 'Xatolarni tezkor bartaraf etish'] }] },
  'academic-analyst': { kicker: 'Smart Learning roli', title: "O'quv analitigi", intro: "O'quv natijalari va KPI bo'yicha tahliliy hisobotlarni tayyorlovchi rol.", blocks: [{ title: 'Analitika', items: ['Progress va risk guruhi', 'Fan kesimidagi natijalar', 'Davomat trendi'] }, { title: 'Hisobotlar', items: ['Dashboard', 'Export (PDF/Excel)'] }] },
  rectorate: { kicker: 'Smart Management roli', title: 'Rektorat', intro: "Universitet bo'ylab strategik boshqaruv qarorlarini qabul qiluvchi yuqori boshqaruv roli.", blocks: [{ title: 'Dashboard', items: ['KPI va strategik indikatorlar', 'Ijro intizomi holati'] }, { title: 'Qarorlar', items: ['Bo‘limlar samaradorligi', 'Resurs taqsimoti'] }] },
  'executive-lead': { kicker: 'Smart Management roli', title: "Mas'ul rahbar", intro: "Yo'nalish va bo'limlar kesimida vazifalar ijrosini kuzatuvchi boshqaruv roli.", blocks: [{ title: 'Ijro', items: ['Topshiriqlar statusi', 'Muddat nazorati'] }, { title: 'Tahlil', items: ['Bo‘lim kesimida muammolar', 'Tezkor eskalatsiya'] }] },
  'department-staff': { kicker: 'Smart Management roli', title: "Bo'lim xodimi", intro: 'Kundalik operatsion vazifalarni workflow asosida bajaruvchi ijrochi rol.', blocks: [{ title: 'Ish jarayoni', items: ['Ariza va topshiriqlarni bajarish', 'Status yangilash'] }, { title: 'Hisobot', items: ['Bajarilgan ishlar', 'Kechikish sabablari'] }] },
  office: { kicker: 'Smart Management roli', title: 'Devonxona', intro: "Rasmiy hujjatlar aylanmasini ro'yxatga olish va yo'naltirish roli.", blocks: [{ title: 'Hujjat', items: ['Kiruvchi/chiquvchi xatlar', "Ro'yxatga olish", 'Rezolyutsiya'] }, { title: 'Nazorat', items: ['Ijroga yuborish', 'Arxivga topshirish'] }] },
  'hr-specialist': { kicker: 'Smart Management roli', title: 'HR mutaxassisi', intro: "Xodimlar bo'yicha kadr jarayonlarini yurituvchi rol.", blocks: [{ title: 'Kadr', items: ['Lavozim va profil', "Ta'til va xizmat safari"] }, { title: 'Monitoring', items: ['Ish haqi bilan bog‘liq maʼlumotlar', 'HR hisobotlari'] }] },
  finance: { kicker: 'Smart Management roli', title: 'Moliya / Buxgalteriya', intro: "To'lovlar, xarajatlar va moliyaviy hujjatlarni boshqaruvchi rol.", blocks: [{ title: 'Moliya', items: ["To'lov hujjatlari", 'Xarajat nazorati'] }, { title: 'Integratsiya', items: ['UzASBO almashinuvi', 'Audit izi'] }] },
  'warehouse-manager': { kicker: 'Smart Management roli', title: 'Ombor mudiri', intro: 'Tovar-moddiy boyliklar, kirim-chiqim va qoldiqni nazorat qiluvchi rol.', blocks: [{ title: 'Ombor', items: ['Qabul va berish', 'Inventarizatsiya'] }, { title: 'Nazorat', items: ['Qoldiq monitoringi', 'Javobgar shaxs hisobi'] }] },
  'archive-officer': { kicker: 'Smart Management roli', title: "Arxiv mas'uli", intro: 'Raqamli va fizik hujjatlar arxivini tartibli yurituvchi rol.', blocks: [{ title: 'Arxiv', items: ['Hujjat tasnifi', 'Qidiruv va retrieval'] }, { title: 'Xavfsizlik', items: ['Saqlash muddatlari', 'Ruxsat darajalari'] }] },
  'security-service': { kicker: 'Smart Campus roli', title: 'Xavfsizlik xizmati', intro: 'Campus hududida xavfsizlik holatini real vaqtda nazorat qiluvchi rol.', blocks: [{ title: 'Monitoring', items: ['AI video kuzatuv', 'SOS signal qabul qilish'] }, { title: 'Javob', items: ['Hodisa kartasi', 'Tezkor choralar'] }] },
  'campus-admin': { kicker: 'Smart Campus roli', title: 'Campus administrator', intro: 'Kampus infratuzilmasini markazlashgan boshqaruv paneli orqali yurituvchi rol.', blocks: [{ title: 'Boshqaruv', items: ['Kampus xizmatlari', 'Resurslar holati'] }, { title: 'Koordinatsiya', items: ['Bo‘limlararo vazifalar', 'Servis sifati'] }] },
  'ttj-manager': { kicker: 'Smart Campus roli', title: "TTJ mas'uli", intro: 'Talabalar turar joyi bo‘yicha kirish, joylash va maishiy murojaatlarni boshqaruvchi rol.', blocks: [{ title: 'TTJ jarayoni', items: ['Yotoqxona joylashuvi', 'Davomat/kirish nazorati'] }, { title: 'Xizmat', items: ['Ariza va nosozliklar', 'Rezident holati'] }] },
  'parking-operator': { kicker: 'Smart Campus roli', title: 'Parking operatori', intro: 'Avtoturargoh oqimi va ruxsat etilgan transportlarni boshqaruvchi rol.', blocks: [{ title: 'Parking', items: ['Joy bandligi', 'Kirish-chiqish'] }, { title: 'Nazorat', items: ['Ruxsatnoma tekshiruvi', 'Hisobotlar'] }] },
  'iot-operator': { kicker: 'Smart Campus roli', title: 'IoT operatori', intro: 'Sensorlar va qurilmalardan keladigan texnik ko‘rsatkichlarni kuzatuvchi rol.', blocks: [{ title: 'Sensorlar', items: ['Harorat va mikroiqlim', 'Qurilma holati'] }, { title: 'Alertlar', items: ['Nosozlik xabarlari', 'Profilaktika vazifalari'] }] },
  'transport-dispatcher': { kicker: 'Smart Campus roli', title: 'Transport dispetcheri', intro: "Universitet transportlari harakati va yo'nalishlarini nazorat qiluvchi rol.", blocks: [{ title: 'Transport', items: ['GPS kuzatuv', "Yo'nalish va jadval"] }, { title: 'Samaradorlik', items: ['Harakat tahlili', 'Yo‘lovchi oqimi'] }] },
  'technical-service': { kicker: 'Smart Campus roli', title: 'Texnik xizmat', intro: 'Campusdagi nosozlik va servis talablarini tezkor bartaraf etuvchi rol.', blocks: [{ title: 'Servis', items: ['Nosozlik ticketlari', 'Ish rejasi'] }, { title: 'Nazorat', items: ['Bajarilish muddati', 'Sifat tekshiruvi'] }] },
  'system-admin': { kicker: 'Smart Campus roli', title: 'Tizim administratori', intro: 'Platforma va qurilmalar infratuzilmasining uzluksiz ishlashini ta’minlovchi rol.', blocks: [{ title: 'Infratuzilma', items: ['Server va tarmoq', 'Access control tizimi'] }, { title: 'Xavfsizlik', items: ['Rolga asoslangan ruxsat', 'Audit va log monitoring'] }] },
};

function openRoleModelModal(roleId) {
  if (!roleModelModal) roleModelModal = document.getElementById('roleModelModal');
  const data = roleModelDetailsData[roleId];
  if (!roleModelModal || !data) return;
  roleModelModal.querySelector('#roleModelKicker').textContent = data.kicker;
  roleModelModal.querySelector('#roleModelTitle').textContent = data.title;
  roleModelModal.querySelector('#roleModelIntro').textContent = data.intro;
  roleModelModal.querySelector('#roleModelGrid').innerHTML = data.blocks
    .map((block) => `<section class="role-model-modal-block"><h4>${block.title}</h4><ul>${block.items.map((item) => `<li>${item}</li>`).join('')}</ul></section>`)
    .join('');
  roleModelModal.hidden = false;
  document.body.classList.add('role-model-modal-open');
  roleModelModal.querySelector('.role-model-modal-close')?.focus();
}

function closeRoleModelModal() {
  if (!roleModelModal) roleModelModal = document.getElementById('roleModelModal');
  if (!roleModelModal) return;
  roleModelModal.hidden = true;
  document.body.classList.remove('role-model-modal-open');
}

function initRoleModelModal() {
  roleModelModal = document.getElementById('roleModelModal');
  if (!roleModelModal) return;
  decorateRoleModelButtons();
  document.querySelectorAll('[data-open-role-model]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRoleModelModal(btn.getAttribute('data-open-role-model'));
    });
  });
  roleModelModal.querySelectorAll('[data-close-role-model-modal]').forEach((el) => {
    el.addEventListener('click', closeRoleModelModal);
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

function initDeckNav() {
  if (deckPrevBtn) {
    deckPrevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  }
  if (deckNextBtn) {
    deckNextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }
}

async function bootPresentation() {
  await loadExternalModals();
  initProblemsModal();
  initStrategyDetailModal();
  initRoleModelModal();
  initDeckNav();
  updateSlide(0);
}

bootPresentation();
