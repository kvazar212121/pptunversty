/** Integratsiya modali — 8 ta tizim */
const integrationSystems = [
  { title: 'HEMIS', desc: "O'quv jarayoni, talabalar bazasi, baholar va davomat." },
  { title: 'Moodle', desc: "Masofaviy ta'lim, resurslar va topshiriqlar." },
  { title: 'EDO.IJRO', desc: 'Elektron hujjat aylanishi va buyruqlar.' },
  { title: 'UzAsbo 2', desc: 'Buxgalteriya, moliya va ish haqi hisobi.' },
  { title: 'HRM Argos', desc: 'Kadrlar hisobi va xodimlar bazasi.' },
  { title: 'OneID', desc: 'Yagona login va autentifikatsiya.' },
  { title: 'Email', desc: 'Korporativ pochta va tashqi aloqalar.' },
  {
    title: 'Didox — elektron imzo',
    desc: "Shartnoma va hujjatlarni elektron imzo bilan tasdiqlash — alohida platforma, SMART dan mustaqil.",
  },
];

function renderIntegrationModalGrids() {
  const modal = document.getElementById('integrationModal');
  if (!modal) return;

  const sysGrid = modal.querySelector('.integration-systems-grid');
  if (!sysGrid) return;

  sysGrid.innerHTML = integrationSystems
    .map(
      (s) => `
      <article class="integration-sys-card">
        <div class="integration-sys-head">
          <div class="integration-sys-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="14" x="3" y="5" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <span class="integration-sys-badge">Ulanmagan</span>
        </div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </article>`
    )
    .join('');
}

window.renderIntegrationModalGrids = renderIntegrationModalGrids;
