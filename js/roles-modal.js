/** Rollar modali — matn + o'ngda real SuperApp mockup */
const rolesAppIcons = {
  lms: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  jadval: '<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
  baholar: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
  ttj: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  tolov: '<path d="M2 10h20M2 10v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  didox: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="m9 15 2 2 4-4"/>',
  ovqat: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20"/>',
  ai: '<path d="M12 8V4H8M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
  reja: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  baho: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
  davomat: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  ilmiy: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  topshiriq: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  panel: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  kpi: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  xodim: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  buyruq: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>',
  hisobot: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
  nazorat: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  otaona: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  hamkor: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  abituriyent: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 3.3 3 6 3s6-1.3 6-3v-5"/>',
  holat: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  hujjat: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  aloqa: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
};

function appItem(iconKey, label) {
  const path = rolesAppIcons[iconKey] || rolesAppIcons.ai;
  return `<div class="app-item">
    <div class="app-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${path}</svg></div>
    <span>${label}</span>
  </div>`;
}

function renderRolesPhone(app) {
  const grid = app.apps.map((a) => appItem(a.icon, a.label)).join('');
  return `
    <div class="dynamic-island" aria-hidden="true"></div>
    <div class="screen">
      <div class="status-bar" aria-hidden="true">
        <span class="status-time">9:41</span>
        <span class="status-icons"><span class="status-signal"></span><span class="status-wifi"></span><span class="status-battery"></span></span>
      </div>
      <div class="app-header"><span class="app-header-icon">${app.headerLetter}</span> ${app.headerTitle}</div>
      <div class="app-grid">${grid}</div>
      <nav class="app-tabbar" aria-hidden="true">
        <span class="tab tab-active"></span><span class="tab"></span><span class="tab"></span><span class="tab"></span>
      </nav>
      <div class="home-indicator" aria-hidden="true"></div>
    </div>`;
}

const rolesModalData = {
  student: {
    label: 'Talaba interfeysi',
    title: 'Talaba',
    desc: 'SuperApp orqali o\'quv jarayoni, xizmatlar va moliyaviy masalalar — bitta mobil ilovada.',
    accentClass: 'roles-modal--student',
    themeClass: 'student',
    app: {
      badge: 'TALABA',
      sub: 'Student interfeysi',
      headerLetter: 'T',
      headerTitle: 'Talaba',
      apps: [
        { icon: 'lms', label: 'LMS' },
        { icon: 'jadval', label: 'Jadval' },
        { icon: 'baholar', label: 'Baholar' },
        { icon: 'ttj', label: 'TTJ' },
        { icon: 'tolov', label: 'To\'lov' },
        { icon: 'chat', label: 'Chat' },
        { icon: 'didox', label: 'Didox' },
        { icon: 'ovqat', label: 'Ovqat' },
        { icon: 'ai', label: 'AI' },
      ],
    },
    groups: [
      {
        name: 'Asosiy imkoniyatlar',
        items: ['Dars jadvali va eslatmalar', 'Baholar va transkript', 'LMS — materiallar va topshiriqlar', 'TTJ va kampus xizmatlari', 'Kontrakt va to\'lovlar'],
      },
      {
        name: 'Qulaylik',
        items: ['24/7 AI yordamchi', 'Murojaat va chat', 'Push-bildirishnomalar', 'O\'zbek tilida interfeys'],
      },
    ],
  },
  teacher: {
    label: 'O\'qituvchi interfeysi',
    title: 'O\'qituvchi',
    desc: 'Dars rejalari, baholash, davomat va LMS boshqaruvi — o\'qituvchi kabineti.',
    accentClass: 'roles-modal--teacher',
    themeClass: 'teacher',
    app: {
      badge: 'O\'QITUVCHI',
      sub: 'Teacher interfeysi',
      headerLetter: 'O',
      headerTitle: 'Ustoz',
      apps: [
        { icon: 'reja', label: 'Reja' },
        { icon: 'baho', label: 'Baho' },
        { icon: 'davomat', label: 'Davomat' },
        { icon: 'lms', label: 'LMS' },
        { icon: 'jadval', label: 'Jadval' },
        { icon: 'chat', label: 'Chat' },
        { icon: 'ilmiy', label: 'Ilmiy' },
        { icon: 'topshiriq', label: 'Topshiriq' },
        { icon: 'ai', label: 'AI' },
      ],
    },
    groups: [
      {
        name: 'O\'quv jarayoni',
        items: ['Dars rejasi va semestr', 'Topshiriq va imtihon baholash', 'Davomat nazorati', 'LMS kurs boshqaruvi'],
      },
      {
        name: 'Tahlil',
        items: ['Guruh natijalari', 'O\'quvchilar progressi', 'Hisobotlar eksport'],
      },
    ],
  },
  leader: {
    label: 'Rahbar interfeysi',
    title: 'Rahbar',
    desc: 'Universitet KPI, dashboard va analitika — qarorlar uchun yagona ko\'rinish.',
    accentClass: 'roles-modal--leader',
    themeClass: 'admin',
    app: {
      badge: 'RAHBAR',
      sub: 'Leader interfeysi',
      headerLetter: 'R',
      headerTitle: 'Rahbar',
      apps: [
        { icon: 'panel', label: 'Panel' },
        { icon: 'kpi', label: 'KPI' },
        { icon: 'xodim', label: 'Xodim' },
        { icon: 'buyruq', label: 'Buyruq' },
        { icon: 'hisobot', label: 'Hisobot' },
        { icon: 'nazorat', label: 'Nazorat' },
        { icon: 'didox', label: 'Didox' },
        { icon: 'jadval', label: 'Jadval' },
        { icon: 'ai', label: 'AI' },
      ],
    },
    groups: [
      {
        name: 'Boshqaruv',
        items: ['KPI dashboard', 'O\'quv va moliyaviy analitika', 'Buyruq va tasdiqlash oqimi', 'Reyting va hisobotlar'],
      },
      {
        name: 'Nazorat',
        items: ['Real-vaqt ko\'rsatkichlar', 'Fakultet / kafedra kesimi', 'Xavfsizlik va audit'],
      },
    ],
  },
  customer: {
    label: 'Mijoz interfeysi',
    title: 'Mijoz',
    desc: 'Ota-ona, hamkor va abituriyentlar uchun aloqa va ma\'lumot kanali.',
    accentClass: 'roles-modal--customer',
    themeClass: 'customer',
    app: {
      badge: 'MIJOZ',
      sub: 'Customer interfeysi',
      headerLetter: 'M',
      headerTitle: 'Mijoz',
      apps: [
        { icon: 'otaona', label: 'Ota-ona' },
        { icon: 'hamkor', label: 'Hamkor' },
        { icon: 'abituriyent', label: 'Abituriyent' },
        { icon: 'tolov', label: 'To\'lov' },
        { icon: 'holat', label: 'Holat' },
        { icon: 'chat', label: 'Chat' },
        { icon: 'hujjat', label: 'Hujjat' },
        { icon: 'aloqa', label: 'Aloqa' },
        { icon: 'ai', label: 'AI' },
      ],
    },
    groups: [
      {
        name: 'Foydalanuvchilar',
        items: ['Ota-ona monitoring', 'Hamkorlik va shartnomalar', 'Abituriyent arizalari', 'Murojaat markazi'],
      },
      {
        name: 'Xizmatlar',
        items: ['Holat va bildirishnomalar', 'Onlayn to\'lov ko\'rinishi', 'Hujjatlar va arxiv'],
      },
    ],
  },
};

function renderRolesModalContent(roleId) {
  const data = rolesModalData[roleId];
  const modal = document.getElementById('rolesModal');
  if (!data || !modal) return;

  modal.classList.remove(
    'roles-modal--student',
    'roles-modal--teacher',
    'roles-modal--leader',
    'roles-modal--customer'
  );
  modal.classList.add(data.accentClass);

  const label = modal.querySelector('#rolesModalLabel');
  const title = modal.querySelector('#rolesModalTitle');
  const desc = modal.querySelector('#rolesModalDesc');
  const groups = modal.querySelector('#rolesModalGroups');
  const appCol = modal.querySelector('#rolesModalAppCol');
  const appBadge = modal.querySelector('#rolesModalAppBadge');
  const appSub = modal.querySelector('#rolesModalAppSub');
  const phone = modal.querySelector('#rolesModalPhone');

  if (label) label.textContent = data.label;
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (groups) {
    groups.innerHTML = data.groups
      .map(
        (g) => `
      <div class="roles-modal-group">
        <h4>${g.name}</h4>
        <ul>${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>`
      )
      .join('');
  }

  if (appCol) {
    appCol.className = `roles-modal-app demo-role-col ${data.themeClass}`;
  }
  if (appBadge) appBadge.textContent = data.app.badge;
  if (appSub) appSub.textContent = data.app.sub;
  if (phone) {
    phone.innerHTML = renderRolesPhone(data.app);
    phone.removeAttribute('aria-hidden');
  }
}

window.renderRolesModalContent = renderRolesModalContent;
window.rolesModalData = rolesModalData;
