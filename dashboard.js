/* ============================================================
   MEDICARE PLUS — dashboard.js
   Patient / Doctor / Admin portals (frontend demo only).
   ============================================================ */

/* ============================================================
   RESPONSIVE CSS — injected once into <head>
   ============================================================ */
const RESPONSIVE_CSS = `
<style id="mp-responsive-css">
/* ---------- Doctor option base (desktop) ---------- */
.doc-option {
  flex-direction: row !important;
  align-items: center !important;
  gap: 16px !important;
}

/* ---------- Tablet ---------- */
@media (max-width: 1024px) {
  .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
  .panel-grid { grid-template-columns: 1fr !important; }
  .quick-actions-grid { grid-template-columns: repeat(2,1fr) !important; }
  .doc-welcome-banner { padding: 24px !important; }
}

/* ---------- Mobile: off-canvas sidebar ---------- */
@media (max-width: 900px) {
  .portal { display: block !important; }
  .p-sidebar {
    position: fixed !important; top:0; left:0; bottom:0;
    width: 280px !important; max-width: 85vw;
    z-index: 10000 !important;
    transform: translateX(-100%) !important;
    transition: transform .28s ease;
    overflow-y: auto;
  }
  .p-sidebar.open { transform: translateX(0) !important; }
  .p-scrim {
    position: fixed; inset:0;
    background: rgba(15,23,42,.55);
    z-index: 9999; display: none;
  }
  .p-scrim.show { display: block !important; }
  .p-burger { display: inline-flex !important; }
  .p-main { width: 100% !important; margin-left: 0 !important; }
  .p-search { display: none !important; }
  .p-user > div { display: none !important; }
  .p-topbar { padding: 12px 16px !important; }
  .p-content { padding: 16px !important; }

  .table-wrap { overflow-x:auto !important; -webkit-overflow-scrolling:touch; display:block; }
  .data { min-width: 640px; }

  .form-row { display: block !important; }
  .form-row .field { margin-bottom: 14px; }

  .summary-row { flex-direction: column !important; align-items:flex-start !important; gap:4px; }
  .summary-row b, .summary-row b[style] { max-width: 100% !important; word-break: break-word; }

  .doc-welcome-banner { flex-direction: column !important; text-align:center !important; gap:16px; }
  .dwb-actions { justify-content:center; flex-wrap:wrap; }
  .dwb-right { display: none !important; }

  .week-grid { grid-template-columns: repeat(2,1fr) !important; }

  .wizard-steps { overflow-x:auto !important; flex-wrap:nowrap !important; padding-bottom:6px; }
  .wstep { flex: 0 0 auto !important; }
}

/* ---------- Mobile portrait ---------- */
@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr !important; gap:10px !important; }
  .p-topbar-left h1 { font-size: 1rem !important; }
  .p-topbar-right { gap: 4px !important; }
  .p-icon-btn { width:34px !important; height:34px !important; font-size:.82rem !important; }

  .panel-head { flex-direction: column !important; align-items:flex-start !important; gap:10px !important; padding:14px 16px !important; }
  .panel-head h2 { font-size: 1rem !important; }
  .panel-body { padding: 14px 16px !important; }
  .panel-body.pad-0 { padding: 0 !important; }
  .card-pad { padding: 14px !important; }

  .quick-actions-grid { grid-template-columns: 1fr 1fr !important; gap:10px !important; }
  .qa-card { padding:12px 6px !important; font-size:.78rem; }
  .qa-icon { width:36px !important; height:36px !important; font-size:.95rem !important; }

  .doc-welcome-banner { padding:18px !important; }
  .doc-welcome-banner h2 { font-size:1.1rem !important; }
  .dwb-actions { flex-direction: column; }
  .dwb-actions .btn { width: 100%; }

  .option-grid { grid-template-columns: 1fr !important; gap:10px !important; }
  .option { padding: 12px !important; }

  /* Doctor option buttons — stack vertically */
  .doc-option {
    flex-direction: column !important;
    text-align: center !important;
    align-items: center !important;
    padding: 14px 12px !important;
  }
  .doc-option > div { text-align: center !important; }
  .doc-option .badge { margin-top: 8px; }
  .doc-option img,
  .doc-option .avatar-img { width:60px !important; height:60px !important; }

  .slot-grid { grid-template-columns: repeat(2,1fr) !important; gap:8px !important; }
  .slot { font-size:.8rem !important; padding:10px 4px !important; }

  .cal-head { flex-wrap: wrap; gap:8px; }
  .cal-days span { font-size:.68rem !important; }
  .cal-cell { font-size:.82rem !important; padding:8px 2px !important; min-height:auto !important; }

  .wizard-actions { flex-direction: column-reverse !important; gap:10px !important; margin-top:16px; }
  .wizard-actions .btn { width: 100%; }

  .wstep span:not(.n) { display:none; }
  .wstep.active span:not(.n) { display:inline; font-size:.75rem; }
  .wstep { padding:6px 8px !important; gap:6px !important; }
  .wstep .n { width:26px !important; height:26px !important; font-size:.75rem !important; }

  .success-panel { padding:20px 14px !important; }
  .success-panel h2 { font-size:1.25rem !important; }
  .booking-id { font-size:.95rem !important; padding:10px 14px !important; }
  .success-panel .flex { flex-direction: column; gap:8px; }
  .success-panel .flex .btn { width: 100%; }

  .doc-timeline-item { flex-direction: column !important; align-items:flex-start !important; gap:6px; }
  .dti-time { font-size:.82rem !important; font-weight:700; color:var(--blue); }
  .dti-actions { flex-wrap: wrap; width:100%; gap:6px; margin-top:8px; }
  .dti-actions .btn { flex: 1 1 auto; }

  .cnc-vitals { flex-wrap: wrap !important; gap:6px 10px !important; }
  .cnc-vitals span { font-size:.73rem !important; }
  .consult-note-card { padding: 12px !important; }

  .queue-item { flex-wrap: wrap !important; gap:8px !important; }
  .queue-item img, .queue-item .avatar-img { width:32px !important; height:32px !important; }
  .qi-info { flex: 1 1 100%; }
  .queue-number { font-size: 2.5rem !important; }
  .queue-display { padding: 14px !important; }

  .revenue-chart { gap:4px !important; height:160px !important; }
  .rev-val { display: none !important; }
  .rev-label { font-size:.6rem !important; }
  .rev-summary { flex-direction: column !important; gap:10px; padding-top:10px; }

  .tab-pills { width:100% !important; overflow-x:auto !important; white-space:nowrap; padding-bottom:4px; -webkit-overflow-scrolling:touch; }
  .tab-pills .pill { flex: 0 0 auto !important; font-size:.72rem !important; padding:6px 10px !important; }

  .week-grid { grid-template-columns: 1fr !important; }

  .rx-paper { padding: 14px !important; }
  .rx-preview-header { flex-direction: column !important; text-align:center !important; gap:10px !important; }
  .rx-preview-header > div { text-align: center !important; }
  .rx-row { flex-direction: column !important; align-items:flex-start !important; gap:4px; }

  .pdm-header { flex-direction: column !important; text-align:center !important; gap:10px !important; }
  .pdm-header > div { text-align: center !important; }

  .chip-row, .slot-chips { flex-wrap: wrap !important; gap:6px !important; }
  .slot-chip { font-size:.7rem !important; padding:4px 8px !important; }

  .p-search[style*="width:240px"] { width: 100% !important; }

  .cell-user { gap: 8px !important; }
  .cell-user img { width:32px !important; height:32px !important; }

  .donut { width:130px !important; height:130px !important; }
  .donut-center b { font-size: 1.4rem !important; }

  .modal-backdrop, .modal-overlay { padding: 8px !important; align-items: flex-end !important; }
  .modal, .modal-dialog, .modal-content {
    width: 100% !important; max-width: 100% !important;
    border-radius: 16px 16px 0 0 !important;
    max-height: 92vh !important;
  }

  .row-actions { flex-wrap: wrap !important; gap:4px !important; }
  .btn-xs { font-size:.68rem !important; padding:4px 8px !important; }
  .btn-sm { font-size:.78rem !important; }
}

/* ---------- Extra small ---------- */
@media (max-width: 400px) {
  .quick-actions-grid { grid-template-columns: 1fr !important; }
  .slot-grid { grid-template-columns: 1fr !important; }
  .p-content { padding: 10px !important; }
  .panel-head, .panel-body { padding: 12px !important; }
  .summary-row { padding: 10px 0 !important; }
}
</style>`;

function injectResponsiveCSS() {
  if (document.getElementById('mp-responsive-css')) return;
  document.head.insertAdjacentHTML('beforeend', RESPONSIVE_CSS);
}

/* ============================================================
   PORTALS CONFIG
   ============================================================ */
const PORTALS = {
  patient: {
    title: 'Patient Portal',
    nav: [
      { group:'Overview', items:[
        { href:'#/patient/dashboard', icon:'fa-gauge-high', label:'Dashboard' },
        { href:'#/patient/appointments', icon:'fa-calendar-check', label:'My Appointments' },
        { href:'#/patient/notifications', icon:'fa-bell', label:'Notifications', count:() => DB.all('notifications').filter(n => !n.read).length }
      ]},
      { group:'Health Records', items:[
        { href:'#/patient/history', icon:'fa-notes-medical', label:'Medical History' },
        { href:'#/patient/prescriptions', icon:'fa-prescription', label:'Prescriptions' },
        { href:'#/patient/lab-reports', icon:'fa-flask-vial', label:'Lab Reports' }
      ]},
      { group:'Account', items:[
        { href:'#/patient/profile', icon:'fa-user', label:'My Profile' },
        { href:'#/', icon:'fa-arrow-left', label:'Back to Website' }
      ]}
    ]
  },
  doctor: {
    title: 'Doctor Portal',
    nav: [
      { group:'Overview', items:[
        { href:'#/doctor/dashboard', icon:'fa-gauge-high', label:'Dashboard' },
        { href:'#/doctor/appointments', icon:'fa-calendar-check', label:'Appointments' },
        { href:'#/doctor/patients', icon:'fa-users', label:'Patient List' }
      ]},
      { group:'Practice', items:[
        { href:'#/doctor/schedule', icon:'fa-calendar-days', label:'My Schedule' },
        { href:'#/doctor/prescription', icon:'fa-prescription-bottle-medical', label:'Write Prescription' },
        { href:'#/doctor/profile', icon:'fa-user-doctor', label:'My Profile' },
        { href:'#/', icon:'fa-arrow-left', label:'Back to Website' }
      ]}
    ]
  },
  admin: {
    title: 'Admin Panel',
    nav: [
      { group:'Overview', items:[
        { href:'#/admin/dashboard', icon:'fa-gauge-high', label:'Dashboard' },
        { href:'#/admin/appointments', icon:'fa-calendar-check', label:'Appointments' }
      ]},
      { group:'Management', items:[
        { href:'#/admin/doctors', icon:'fa-user-doctor', label:'Doctors' },
        { href:'#/admin/patients', icon:'fa-users', label:'Patients' },
        { href:'#/admin/departments', icon:'fa-hospital', label:'Departments' },
        { href:'#/admin/services', icon:'fa-stethoscope', label:'Services' },
        { href:'#/admin/blog', icon:'fa-newspaper', label:'Blog Posts' }
      ]},
      { group:'Engagement', items:[
        { href:'#/admin/reviews', icon:'fa-star', label:'Reviews' },
        { href:'#/admin/messages', icon:'fa-envelope', label:'Messages', count:() => DB.all('messages').filter(m => m.status === 'New').length },
        { href:'#/admin/settings', icon:'fa-gear', label:'Settings' },
        { href:'#/', icon:'fa-arrow-left', label:'Back to Website' }
      ]}
    ]
  }
};

const PORTAL_USER = {
  patient: () => DB.get('profile', DATA.patientSeed),
  doctor: () => { const dp = typeof getDocProfile === 'function' ? getDocProfile() : {}; return { name: dp.name || 'Dr. Ayesha Rahman', role: dp.specialty || 'Cardiologist', email: dp.email || 'doctor@demo.com', img: dp.img || '' }; },
  admin: () => ({ name:'Alex Morgan', role:'Administrator', email:'admin@demo.com' })
};

/* ---------- Shell ---------- */
function portalShell(kind, activeHref, title, contentHTML) {
  injectResponsiveCSS();          // 🔧 inject once
  const cfg = PORTALS[kind];
  const user = PORTAL_USER[kind]();
  const navHTML = cfg.nav.map(g => `
    <div class="p-nav-label">${g.group}</div>
    ${g.items.map(i => {
      const count = i.count ? i.count() : 0;
      return `<a href="${i.href}" class="${activeHref === i.href ? 'active' : ''}">
        <i class="fa-solid ${i.icon}"></i>${i.label}
        ${count ? `<span class="count">${count}</span>` : ''}
      </a>`;
    }).join('')}`).join('');

  return `
    <div class="portal">
      <aside class="p-sidebar" id="pSidebar">
        <div class="p-sidebar-brand">
          <span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span>
          <div><b>MEDICARE PLUS</b><small>${esc(cfg.title)}</small></div>
        </div>
        <nav class="p-sidebar-nav">${navHTML}</nav>
        <div class="p-sidebar-foot">
          <a href="#/" class="btn btn-outline btn-sm" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff">
            <i class="fa-solid fa-arrow-left"></i> Exit portal
          </a>
        </div>
      </aside>
      <div class="p-scrim" id="pScrim"></div>
      <div class="p-main">
        <header class="p-topbar">
          <div class="p-topbar-left">
            <button class="p-burger" id="pBurger"><i class="fa-solid fa-bars"></i></button>
            <h1>${esc(title)}</h1>
          </div>
          <div class="p-topbar-right">
            <div class="p-search"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Search…" id="pSearch"></div>
            <button class="p-icon-btn" id="pTheme" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
            <button class="p-icon-btn" data-bell aria-label="Notifications"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>
            <div class="p-user">
              <img src="${user.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" alt="${esc(user.name)}" class="avatar-img img-animated" style="width:34px;height:34px">
              <div><b>${esc(user.name)}</b><span>${esc(user.role || 'Patient')}</span></div>
            </div>
            <button class="p-icon-btn" id="pLogout" aria-label="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </header>
        <div class="p-content">${contentHTML}</div>
      </div>
    </div>`;
}

function portalInit(kind) {
  const sb = $('#pSidebar'), scrim = $('#pScrim'), burger = $('#pBurger');
  if (burger) burger.onclick = () => { sb.classList.add('open'); scrim.classList.add('show'); };
  if (scrim) scrim.onclick = () => { sb.classList.remove('open'); scrim.classList.remove('show'); };
  const th = $('#pTheme');
  if (th) {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    th.innerHTML = `<i class="fa-solid ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
    th.onclick = () => { toggleTheme(); portalInitRefresh(); };
  }
  const lo = $('#pLogout');
  if (lo) lo.onclick = () => {
    openModal({
      title: 'Sign out',
      body: `<p class="text-muted">You are about to sign out of the demo portal. No real session exists — this simply returns you to the website.</p>`,
      footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-primary" id="doLogout">Sign out</button>`,
      onMount(root, close) {
        root.querySelector('[data-c]').onclick = close;
        root.querySelector('#doLogout').onclick = () => { localStorage.removeItem('mp_session'); close(); toast('Signed out (demo).', 'info'); location.hash = '#/'; };
      }
    });
  };
  $$('[data-bell]').forEach(b => b.onclick = () => { location.hash = kind === 'patient' ? '#/patient/notifications' : kind === 'doctor' ? '#/doctor/dashboard' : '#/admin/messages'; });
  const ps = $('#pSearch');
  if (ps) ps.onkeydown = e => { if (e.key === 'Enter' && ps.value.trim()) { toast(`No results for "${ps.value}" in this demo.`, 'info'); } };
}

function portalInitRefresh() {
  const path = currentPath();
  const kind = path.split('/')[1];
  portalInit(kind);
}

/* ---------- Small partials ---------- */
const statCard = (icon, tone, value, label, trend) => `
  <div class="stat-card">
    <div class="sc-top">
      <div class="sc-icon ${tone}"><i class="fa-solid ${icon}"></i></div>
      ${trend ? `<span class="sc-trend ${trend.dir}"><i class="fa-solid fa-arrow-${trend.dir === 'up' ? 'up' : 'down'}"></i> ${trend.text}</span>` : ''}
    </div>
    <div><div class="sc-val">${value}</div><div class="sc-label">${label}</div></div>
  </div>`;

const statusBadge = s => {
  const map = { 'In Progress':'badge-info', Confirmed:'badge-ok', Completed:'badge-info', Pending:'badge-warn', Cancelled:'badge-danger', Ready:'badge-ok', Processing:'badge-warn', Active:'badge-ok', New:'badge-info', Read:'badge-neutral' };
  return `<span class="badge ${map[s] || 'badge-neutral'}">${esc(s)}</span>`;
};

const emptyState = (icon, title, text) => `<div class="empty"><i class="fa-solid ${icon}"></i><b>${esc(title)}</b><p>${esc(text)}</p></div>`;

/* ============================================================
   PATIENT PORTAL
   ============================================================ */
function PatientDashboard() {
  const p = DB.get('profile', DATA.patientSeed);
  const appts = DB.all('appointments').filter(a => a.email === p.email);
  const upcoming = appts.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
  const past = appts.filter(a => a.status === 'Completed');
  const rxs = DB.all('prescriptions').filter(x => x.email === p.email);
  const labs = DB.all('labs').filter(x => x.email === p.email);
  const notes = DB.all('notifications');

  const content = `
    <div class="stat-grid">
      ${statCard('fa-calendar-check','blue', upcoming.length, 'Upcoming Appointments', { dir:'up', text:'Next this week' })}
      ${statCard('fa-prescription','teal', rxs.filter(r => r.status === 'Active').length, 'Active Prescriptions')}
      ${statCard('fa-flask-vial','navy', labs.length, 'Lab Reports')}
      ${statCard('fa-heart-pulse','warn', '72 bpm', 'Last Recorded Pulse')}
    </div>

    <div class="panel-grid">
      <div>
        <div class="panel">
          <div class="panel-head">
            <div><h2>Upcoming appointments</h2><p>Your next scheduled visits</p></div>
            <a href="#/patient/appointments" class="btn-link">View all →</a>
          </div>
          <div class="panel-body pad-0">
            ${upcoming.length ? `<div class="table-wrap" style="border:0;border-radius:0"><table class="data">
              <thead><tr><th>Doctor</th><th>Date &amp; Time</th><th>Status</th><th></th></tr></thead>
              <tbody>${upcoming.map(a => {
                const d = DATA.doctors.find(x => x.id === a.doctorId);
                return `<tr>
                  <td><div class="cell-user">
                    ${d && d.img ? `<img src="${d.img}" alt="" class="avatar-img img-animated" style="width:38px;height:38px">` : avatar(d ? d.name : 'Doctor', 38)}
                    <div><b>${esc(d ? d.name : 'Specialist')}</b><span>${esc(a.reason ? a.reason.slice(0, 38) : '')}…</span></div>
                  </div></td>
                  <td>${esc(fmtDate(a.date))}<br><span class="small text-muted">${esc(a.time)}</span></td>
                  <td>${statusBadge(a.status)}</td>
                  <td><a href="#/patient/appointment/${a.id}" class="btn btn-outline btn-sm">View</a></td>
                </tr>`;
              }).join('')}</tbody></table></div>`
              : emptyState('fa-calendar-xmark','No upcoming appointments','Book a consultation to get started.')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><div><h2>Recent lab reports</h2><p>Latest diagnostic results</p></div><a href="#/patient/lab-reports" class="btn-link">All reports →</a></div>
          <div class="panel-body">
            ${labs.slice(0, 3).map(l => `
              <div class="flex between" style="padding:12px 0;border-bottom:1px solid var(--line-2)">
                <div class="flex" style="gap:12px">
                  <div class="sc-icon navy" style="width:38px;height:38px;border-radius:10px"><i class="fa-solid fa-flask-vial"></i></div>
                  <div><b style="font-family:var(--head);font-size:.87rem;display:block;color:var(--heading)">${esc(l.test)}</b><span class="small text-muted">${esc(l.id)} · ${fmtDate(l.date)}</span></div>
                </div>
                ${statusBadge(l.status)}
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h2>Health snapshot</h2></div>
          <div class="panel-body">
            <div class="donut-wrap">
              <div class="donut" style="background:conic-gradient(var(--blue) 0 42%, var(--teal) 42% 70%, var(--line-2) 70% 100%)">
                <div class="donut-center"><b>78</b><span>Health score</span></div>
              </div>
            </div>
            <div class="progress-list mt-3">
              ${[['Blood pressure','128/84','72'],['Cholesterol','214 mg/dL','58'],['Blood sugar','94 mg/dL','80']].map(([l, v, w]) => `
                <div class="progress-item">
                  <div class="pi-top"><span>${l}</span><b>${v}</b></div>
                  <div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>Notifications</h2><a href="#/patient/notifications" class="btn-link">All →</a></div>
          <div class="panel-body">
            ${notes.slice(0, 3).map(n => `
              <div class="flex" style="gap:12px;padding:10px 0;border-bottom:1px solid var(--line-2)">
                <div class="sc-icon ${n.type === 'ok' ? 'teal' : n.type === 'warn' ? 'warn' : 'blue'}" style="width:34px;height:34px;border-radius:10px;flex:0 0 auto"><i class="fa-solid ${n.read ? 'fa-envelope-open' : 'fa-envelope'}"></i></div>
                <div><b style="font-family:var(--head);font-size:.82rem;color:var(--heading);display:block">${esc(n.title)}</b><span class="small text-muted">${esc(n.time)}</span></div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  return { html: portalShell('patient', '#/patient/dashboard', 'Dashboard', content), init: () => portalInit('patient') };
}

function PatientAppointments() {
  const p = DB.get('profile', DATA.patientSeed);
  const appts = DB.all('appointments').filter(a => a.email === p.email);
  const content = `
    <div class="panel">
      <div class="panel-head">
        <div><h2>All appointments</h2><p>${appts.length} total record${appts.length === 1 ? '' : 's'}</p></div>
        <a href="#/appointment" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> New appointment</a>
      </div>
      <div class="panel-body pad-0">
        ${appts.length ? `<div class="table-wrap" style="border:0;border-radius:0"><table class="data">
          <thead><tr><th>Booking ID</th><th>Doctor</th><th>Date &amp; Time</th><th>Fee</th><th>Status</th><th></th></tr></thead>
          <tbody>${appts.map(a => {
            const d = DATA.doctors.find(x => x.id === a.doctorId);
            return `<tr>
              <td><b style="font-family:var(--head);font-size:.8rem">${esc(a.id)}</b></td>
              <td><div class="cell-user">
                ${d && d.img ? `<img src="${d.img}" alt="" class="avatar-img img-animated" style="width:34px;height:34px">` : avatar(d ? d.name : 'Doctor', 34)}
                <div><b>${esc(d ? d.name : 'Specialist')}</b><span>${esc(d ? d.specialty : '')}</span></div>
              </div></td>
              <td>${esc(fmtDate(a.date))}<br><span class="small text-muted">${esc(a.time)}</span></td>
              <td>${money(a.fee || 0)}</td>
              <td>${statusBadge(a.status)}</td>
              <td><div class="row-actions">
                <a href="#/patient/appointment/${a.id}" class="icon-btn" title="View"><i class="fa-solid fa-eye"></i></a>
                ${a.status === 'Pending' || a.status === 'Confirmed'
                  ? `<button class="icon-btn danger" data-cancel="${a.id}" title="Cancel"><i class="fa-solid fa-xmark"></i></button>` : ''}
              </div></td>
            </tr>`;
          }).join('')}</tbody></table></div>`
          : emptyState('fa-calendar-xmark','No appointments yet','Your booking history will appear here.')}
      </div>
    </div>`;

  return {
    html: portalShell('patient', '#/patient/appointments', 'My Appointments', content),
    init() {
      portalInit('patient');
      $$('[data-cancel]').forEach(b => b.onclick = () => {
        const id = b.dataset.cancel;
        openModal({
          title: 'Cancel appointment',
          body: `<p class="text-muted">Are you sure you want to cancel booking <b>${esc(id)}</b>? This cannot be undone in the demo.</p>`,
          footer: `<button class="btn btn-outline" data-c>Keep it</button><button class="btn btn-danger" id="confirmCancel">Cancel appointment</button>`,
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#confirmCancel').onclick = () => {
              DB.update('appointments', id, { status: 'Cancelled' });
              close(); toast('Appointment cancelled (demo).', 'warn'); navigate();
            };
          }
        });
      });
    }
  };
}

function PatientAppointmentDetails({ id }) {
  const a = DB.all('appointments').find(x => x.id === id);
  if (!a) return { html: portalShell('patient', '#/patient/appointments', 'Appointment', emptyState('fa-circle-question','Not found','This appointment does not exist.')) };
  const d = DATA.doctors.find(x => x.id === a.doctorId);
  const dept = DATA.departments.find(x => x.id === a.dept);
  const content = `
    <a href="#/patient/appointments" class="btn-link" style="display:inline-block;margin-bottom:18px"><i class="fa-solid fa-arrow-left"></i> Back to appointments</a>
    <div class="panel-grid">
      <div class="panel">
        <div class="panel-head"><div><h2>Booking ${esc(a.id)}</h2><p>Created ${esc(fmtDate(a.date))}</p></div>${statusBadge(a.status)}</div>
        <div class="panel-body">
          <div class="summary-rows" style="padding:0">
            <div class="summary-row"><span>Doctor</span><b>${esc(d ? d.name : '—')}</b></div>
            <div class="summary-row"><span>Specialty</span><b>${esc(d ? d.specialty : '—')}</b></div>
            <div class="summary-row"><span>Department</span><b>${esc(dept ? dept.name : '—')}</b></div>
            <div class="summary-row"><span>Date</span><b>${esc(fmtDate(a.date))}</b></div>
            <div class="summary-row"><span>Time</span><b>${esc(a.time)}</b></div>
            <div class="summary-row"><span>Consultation fee</span><b>${money(a.fee || 0)}</b></div>
            <div class="summary-row"><span>Patient</span><b>${esc(a.patient)}</b></div>
            <div class="summary-row"><span>Contact</span><b style="font-size:.8rem">${esc(a.phone || '')}<br>${esc(a.email || '')}</b></div>
            <div class="summary-row"><span>Reason</span><b style="font-weight:500;word-break:break-word">${esc(a.reason || '—')}</b></div>
          </div>
        </div>
      </div>
      <div>
        <div class="panel">
          <div class="panel-head"><h2>Visit status</h2></div>
          <div class="panel-body">
            <div class="timeline">
              <div class="tl-item done"><h4>Booking created</h4><p>Your appointment request was recorded.</p><time>${esc(fmtDate(a.date))}</time></div>
              <div class="tl-item ${a.status !== 'Pending' ? 'done' : ''}"><h4>Confirmed by clinic</h4><p>${a.status !== 'Pending' ? 'The clinic has confirmed this slot.' : 'Awaiting confirmation from reception.'}</p></div>
              <div class="tl-item ${a.status === 'Completed' ? 'done' : ''}"><h4>Consultation</h4><p>Scheduled for ${esc(fmtDate(a.date))} at ${esc(a.time)}.</p></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Your doctor</h2></div>
          <div class="panel-body">
            <div class="flex" style="gap:14px">
              ${d && d.img ? `<img src="${d.img}" alt="" class="avatar-img img-animated" style="width:56px;height:56px">` : avatar(d ? d.name : 'Doctor', 56)}
              <div><b style="font-family:var(--head);color:var(--heading)">${esc(d ? d.name : '—')}</b><p class="small text-muted">${esc(d ? d.specialty : '')}</p></div>
            </div>
            <a href="#/doctor/${a.doctorId}" class="btn btn-outline btn-block mt-3">View full profile</a>
          </div>
        </div>
      </div>
    </div>`;
  return { html: portalShell('patient', '#/patient/appointments', 'Appointment Details', content), init: () => portalInit('patient') };
}

function PatientHistory() {
  const events = [
    { date:'2024-11-10', title:'Hypertension diagnosis recorded', text:'Stage 1 hypertension identified during routine screening.', done:true },
    { date:'2024-11-09', title:'Acute viral URI treated', text:'Consultation with Dr. Emily Watson; symptomatic treatment prescribed.', done:true },
    { date:'2024-06-22', title:'Annual health screening', text:'Full blood panel, ECG and vision test — all within reference range.', done:true },
    { date:'2023-09-14', title:'Childhood vaccination record transferred', text:'Immunisation history imported from previous provider.', done:true },
    { date:'2022-03-02', title:'Registered as a MEDICARE PLUS patient', text:'Initial registration and baseline assessment.', done:true }
  ];
  const content = `
    <div class="panel-grid">
      <div class="panel">
        <div class="panel-head"><div><h2>Medical history</h2><p>Chronological record of your care</p></div></div>
        <div class="panel-body">
          <div class="timeline">
            ${events.map(e => `<div class="tl-item ${e.done ? 'done' : ''}"><h4>${esc(e.title)}</h4><p>${esc(e.text)}</p><time>${esc(fmtDate(e.date))}</time></div>`).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="panel">
          <div class="panel-head"><h2>Allergies &amp; conditions</h2></div>
          <div class="panel-body">
            <p class="small text-muted" style="margin-bottom:10px"><strong>Allergies</strong></p>
            <div class="chip-row"><span class="chip" style="cursor:default">Penicillin</span><span class="chip" style="cursor:default">Pollen</span></div>
            <p class="small text-muted mt-3" style="margin-bottom:10px"><strong>Ongoing conditions</strong></p>
            <div class="chip-row"><span class="chip" style="cursor:default">Hypertension</span></div>
            <p class="small text-muted mt-3" style="margin-bottom:10px"><strong>Blood group</strong></p>
            <p style="font-family:var(--head);font-weight:800;font-size:1.2rem;color:var(--heading)">O+</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Vitals trend</h2></div>
          <div class="panel-body">
            <div class="progress-list">
              ${[['Weight','68 kg','66'],['Blood pressure','128/84','72'],['Resting heart rate','72 bpm','60']].map(([l, v, w]) => `
                <div class="progress-item"><div class="pi-top"><span>${l}</span><b>${v}</b></div><div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  return { html: portalShell('patient', '#/patient/history', 'Medical History', content), init: () => portalInit('patient') };
}

function PatientPrescriptions() {
  const p = DB.get('profile', DATA.patientSeed);
  const rxs = DB.all('prescriptions').filter(x => x.email === p.email);
  const content = `
    <div class="panel">
      <div class="panel-head"><div><h2>My prescriptions</h2><p>${rxs.length} prescription record${rxs.length === 1 ? '' : 's'}</p></div></div>
      <div class="panel-body">
        ${rxs.length ? rxs.map(rx => {
          const d = DATA.doctors.find(x => x.id === rx.doctorId);
          return `<div class="rx-paper" style="margin-bottom:18px">
            <div class="flex between" style="flex-wrap:wrap;gap:10px;margin-bottom:14px">
              <div><b style="font-family:var(--head);font-size:.98rem;color:var(--heading)">${esc(rx.id)}</b>
                <p class="small text-muted">${esc(d ? d.name : 'Consultant')} · ${esc(fmtDate(rx.date))}</p></div>
              ${statusBadge(rx.status)}
            </div>
            <p class="small" style="margin-bottom:12px"><strong style="color:var(--heading)">Diagnosis:</strong> <span class="text-muted">${esc(rx.diagnosis)}</span></p>
            ${rx.meds.map(m => `
              <div class="rx-row">
                <div><b style="font-family:var(--head);font-size:.87rem;color:var(--heading)">${esc(m.name)}</b>
                  <p class="small text-muted">${esc(m.dose)} · ${esc(m.freq)}</p></div>
                <span class="badge badge-neutral">${esc(m.dur)}</span>
              </div>`).join('')}
            <p class="small text-muted mt-3"><strong style="color:var(--heading)">Advice:</strong> ${esc(rx.advice)}</p>
            <div class="flex mt-3" style="gap:8px;flex-wrap:wrap">
              <button class="btn btn-outline btn-sm" data-print="${rx.id}"><i class="fa-solid fa-print"></i> Print</button>
              <button class="btn btn-outline btn-sm" data-refill="${rx.id}"><i class="fa-solid fa-rotate"></i> Request refill</button>
            </div>
          </div>`;
        }).join('') : emptyState('fa-prescription','No prescriptions','Prescriptions issued by your doctor will appear here.')}
      </div>
    </div>`;
  return {
    html: portalShell('patient', '#/patient/prescriptions', 'Prescriptions', content),
    init() {
      portalInit('patient');
      $$('[data-print]').forEach(b => b.onclick = () => { toast('Print dialog would open here (demo).', 'info'); window.print(); });
      $$('[data-refill]').forEach(b => b.onclick = () => toast('Refill request sent to your doctor (demo only).', 'success'));
    }
  };
}

function PatientLabReports() {
  const p = DB.get('profile', DATA.patientSeed);
  const labs = DB.all('labs').filter(x => x.email === p.email);
  const content = `
    <div class="panel">
      <div class="panel-head"><div><h2>Lab reports</h2><p>${labs.length} report${labs.length === 1 ? '' : 's'} on file</p></div></div>
      <div class="panel-body">
        ${labs.map(l => `
          <div class="panel" style="margin-bottom:16px">
            <div class="panel-head">
              <div><h2 style="font-size:.92rem">${esc(l.test)}</h2><p>${esc(l.id)} · ${esc(fmtDate(l.date))}</p></div>
              ${statusBadge(l.status)}
            </div>
            <div class="panel-body pad-0">
              ${l.results.length ? `<div class="table-wrap" style="border:0;border-radius:0"><table class="data">
                <thead><tr><th>Parameter</th><th>Result</th><th>Reference range</th><th>Flag</th></tr></thead>
                <tbody>${l.results.map(r => `<tr>
                  <td>${esc(r.name)}</td>
                  <td><b style="font-family:var(--head)">${esc(r.value)}</b></td>
                  <td class="text-muted">${esc(r.range)}</td>
                  <td>${r.flag === 'high' ? '<span class="badge badge-warn">Above range</span>' : '<span class="badge badge-ok">Normal</span>'}</td>
                </tr>`).join('')}</tbody></table></div>`
                : `<div class="panel-body">${emptyState('fa-hourglass-half','Processing','Results will appear once the laboratory completes analysis.')}</div>`}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  return { html: portalShell('patient', '#/patient/lab-reports', 'Lab Reports', content), init: () => portalInit('patient') };
}

function PatientProfile() {
  const p = DB.get('profile', DATA.patientSeed);
  const content = `
    <div class="panel-grid">
      <div class="panel">
        <div class="panel-head"><div><h2>Personal information</h2><p>Update your details below</p></div></div>
        <div class="panel-body">
          <form id="profileForm" novalidate>
            <div class="form-row">
              <div class="field"><label>Full name</label><input name="name" value="${esc(p.name)}"><span class="err-msg">Required.</span></div>
              <div class="field"><label>Email address</label><input name="email" type="email" value="${esc(p.email)}"><span class="err-msg">Enter a valid email.</span></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Phone</label><input name="phone" value="${esc(p.phone)}"></div>
              <div class="field"><label>Age</label><input name="age" type="number" value="${esc(p.age)}"></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Gender</label>
                <select name="gender">${['Female','Male','Non-binary','Prefer not to say'].map(g => `<option ${p.gender === g ? 'selected' : ''}>${g}</option>`).join('')}</select>
              </div>
              <div class="field"><label>Blood group</label>
                <select name="blood">${['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(b => `<option ${p.blood === b ? 'selected' : ''}>${b}</option>`).join('')}</select>
              </div>
            </div>
            <div class="field"><label>Address</label><input name="address" value="${esc(p.address)}"></div>
            <button class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Save changes</button>
          </form>
        </div>
      </div>
      <div>
        <div class="panel">
          <div class="panel-head"><h2>Account</h2></div>
          <div class="panel-body center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="" class="avatar-img img-animated" style="width:96px;height:96px">
            <h3 class="mt-2">${esc(p.name)}</h3>
            <p class="small text-muted">${esc(p.email)}</p>
            <span class="badge badge-teal mt-2">Patient since ${esc(p.since || '2022')}</span>
            <div class="summary-rows mt-3" style="text-align:left;padding:0">
              <div class="summary-row"><span>Blood group</span><b>${esc(p.blood)}</b></div>
              <div class="summary-row"><span>Age</span><b>${esc(p.age)}</b></div>
              <div class="summary-row"><span>Phone</span><b style="font-size:.8rem">${esc(p.phone)}</b></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Security</h2></div>
          <div class="panel-body">
            <button class="btn btn-outline btn-block" id="changePw"><i class="fa-solid fa-lock"></i> Change password</button>
            <button class="btn btn-outline btn-block mt-2" id="clearData" style="color:var(--danger);border-color:rgba(220,38,38,.3)"><i class="fa-solid fa-trash"></i> Clear demo data</button>
          </div>
        </div>
      </div>
    </div>`;
  return {
    html: portalShell('patient', '#/patient/profile', 'My Profile', content),
    init() {
      portalInit('patient');
      const f = $('#profileForm');
      f.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        const setErr = (n, bad) => { f[n].closest('.field').classList.toggle('error', bad); if (bad) ok = false; };
        setErr('name', !f.name.value.trim());
        setErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value));
        if (!ok) { toast('Please fix the highlighted fields.', 'error'); return; }
        DB.set('profile', { ...DB.get('profile', {}), name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), age: f.age.value, gender: f.gender.value, blood: f.blood.value, address: f.address.value.trim() });
        toast('Profile updated (demo).', 'success');
        navigate();
      });
      const cp = $('#changePw');
      if (cp) cp.onclick = () => toast('Password change is disabled in the demo.', 'info');
      const cd = $('#clearData');
      if (cd) cd.onclick = () => {
        openModal({
          title: 'Clear demo data',
          body: `<p class="text-muted">This removes all demo bookings, prescriptions and notifications stored in your browser. Continue?</p>`,
          footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-danger" id="doClear">Clear everything</button>`,
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#doClear').onclick = () => { localStorage.clear(); close(); toast('Demo data cleared.', 'warn'); location.reload(); };
          }
        });
      };
    }
  };
}

function PatientNotifications() {
  const notes = DB.all('notifications');
  const unreadCount = notes.filter(n => !n.read).length;
  const content = `
    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Notifications</h2>
          <p>${notes.length} total notification${notes.length === 1 ? '' : 's'}${unreadCount ? ` · <b style="color:var(--teal)">${unreadCount} unread</b>` : ''}</p>
        </div>
        ${unreadCount ? `<button class="btn btn-outline btn-sm" id="markAllRead"><i class="fa-solid fa-check-double"></i> Mark all as read</button>` : ''}
      </div>
      <div class="panel-body">
        ${notes.length ? notes.map(n => `
          <div class="flex between" style="padding:16px 0;border-bottom:1px solid var(--line-2);align-items:flex-start">
            <div class="flex" style="gap:14px;align-items:flex-start">
              <div class="sc-icon ${n.type === 'ok' ? 'teal' : n.type === 'warn' ? 'warn' : 'blue'}" style="width:40px;height:40px;border-radius:10px;flex:0 0 auto">
                <i class="fa-solid ${n.read ? 'fa-envelope-open' : 'fa-bell'}"></i>
              </div>
              <div>
                <b style="font-family:var(--head);font-size:.92rem;color:var(--heading);display:block">${esc(n.title)}</b>
                <p class="text-muted small mt-1" style="line-height:1.5">${esc(n.text)}</p>
                <span class="small text-muted mt-1" style="display:inline-block"><i class="fa-regular fa-clock"></i> ${esc(n.time)}</span>
              </div>
            </div>
            <div>
              ${n.read ? '<span class="badge badge-neutral">Read</span>' : '<span class="badge badge-teal">New</span>'}
            </div>
          </div>`).join('') : emptyState('fa-bell-slash','No notifications','You are all caught up!')}
      </div>
    </div>`;

  return {
    html: portalShell('patient', '#/patient/notifications', 'Notifications', content),
    init() {
      portalInit('patient');
      const mr = $('#markAllRead');
      if (mr) mr.onclick = () => {
        const list = DB.all('notifications').map(n => ({ ...n, read: true }));
        DB.set('notifications', list);
        toast('All notifications marked as read.', 'success');
        navigate();
      };
    }
  };
}

/* routes for patient portal */
route('/patient', () => { location.hash = '#/patient/dashboard'; });
route('/patient/dashboard', PatientDashboard);
route('/patient/notifications', PatientNotifications);
route('/patient/appointments', PatientAppointments);
route('/patient/appointment/:id', PatientAppointmentDetails);
route('/patient/history', PatientHistory);
route('/patient/prescriptions', PatientPrescriptions);
route('/patient/lab-reports', PatientLabReports);
route('/patient/profile', PatientProfile);

/* ============================================================
   DOCTOR PORTAL — Auth Guard + Full Dashboard + Sub-Pages
   ============================================================ */

function doctorAuthGuard() {
  const session = DB.get('session', null);
  if (!session || session.role !== 'doctor') {
    toast('Please sign in as a doctor to access this portal.', 'warn', 'Access Denied');
    setTimeout(() => { location.hash = '#/login'; }, 100);
    return false;
  }
  return true;
}

function getDocProfile() {
  const session = DB.get('session', null);
  const saved = DB.get('doctorProfile', null);
  if (saved) return saved;
  const d = DATA.doctors.find(x => x.id === 'd1');
  return {
    id: 'd1', name: d.name, specialty: d.specialty, dept: d.dept,
    qual: d.qual, exp: d.exp, fee: d.fee, rating: d.rating,
    reviews: d.reviews, days: d.days, lang: d.lang, gender: d.gender,
    bio: d.bio, img: d.img, email: session ? session.email : 'doctor@demo.com',
    phone: '+1 555 010 2400', medicalId: 'MC-DR-2024-001',
    consultHours: '09:00 AM - 05:30 PM'
  };
}

const DEMO_PATIENTS = [
  { id:'pt1', name:'Sarah Mitchell', age:34, gender:'Female', blood:'O+', phone:'+1 555 010 7788', email:'patient@demo.com', img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', lastVisit:'2025-01-18', diagnosis:'Stage 1 Hypertension', status:'Active' },
  { id:'pt2', name:'Ahmed Karim', age:42, gender:'Male', blood:'A+', phone:'+1 555 022 3344', email:'ahmed@demo.com', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', lastVisit:'2025-01-15', diagnosis:'Knee osteoarthritis', status:'Active' },
  { id:'pt3', name:'Linda Osei', age:28, gender:'Female', blood:'B+', phone:'+1 555 033 5566', email:'linda@demo.com', img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', lastVisit:'2025-01-10', diagnosis:'Routine checkup', status:'Active' },
  { id:'pt4', name:'David Ferreira', age:55, gender:'Male', blood:'AB-', phone:'+1 555 044 7788', email:'david@demo.com', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', lastVisit:'2024-12-22', diagnosis:'Type 2 Diabetes', status:'Follow-up' },
  { id:'pt5', name:'Meera Pillai', age:31, gender:'Female', blood:'O-', phone:'+1 555 055 9900', email:'meera@demo.com', img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', lastVisit:'2024-12-18', diagnosis:'Cardiac arrhythmia', status:'Active' },
  { id:'pt6', name:'James Turner', age:67, gender:'Male', blood:'A-', phone:'+1 555 066 1122', email:'james@demo.com', img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', lastVisit:'2024-11-30', diagnosis:'Chronic angina', status:'Discharged' },
  { id:'pt7', name:'Fatima Al-Zahra', age:29, gender:'Female', blood:'B-', phone:'+1 555 077 3344', email:'fatima@demo.com', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', lastVisit:'2025-02-01', diagnosis:'Mitral valve prolapse', status:'Active' },
  { id:'pt8', name:'Robert Lang', age:48, gender:'Male', blood:'O+', phone:'+1 555 088 5566', email:'robert@demo.com', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', lastVisit:'2025-01-28', diagnosis:'Hyperlipidemia', status:'Follow-up' }
];

function getConsultNotes() {
  return DB.get('consultNotes', [
    { id:'cn1', patientId:'pt1', patient:'Sarah Mitchell', date:'2025-01-18', time:'10:30 AM', type:'Follow-up', notes:'BP 128/84, stable on current medication. Continue Amlodipine 5mg. Recheck in 3 months.', vitals:{ bp:'128/84', hr:'72', temp:'98.4°F', spo2:'98%' }},
    { id:'cn2', patientId:'pt5', patient:'Meera Pillai', date:'2025-01-16', time:'02:30 PM', type:'New Consult', notes:'ECG shows occasional PVCs. Holter monitor ordered. Advised to reduce caffeine intake.', vitals:{ bp:'118/76', hr:'82', temp:'98.6°F', spo2:'99%' }},
    { id:'cn3', patientId:'pt4', patient:'David Ferreira', date:'2025-01-12', time:'11:00 AM', type:'Follow-up', notes:'HbA1c 7.2%, improved from 8.1%. Continue Metformin. Added Atorvastatin for dyslipidemia.', vitals:{ bp:'140/92', hr:'78', temp:'98.2°F', spo2:'97%' }}
  ]);
}

const MEDICATION_DB = [
  'Amlodipine 5mg','Amlodipine 10mg','Aspirin 75mg','Aspirin 150mg','Atorvastatin 10mg','Atorvastatin 20mg','Atorvastatin 40mg',
  'Azithromycin 250mg','Azithromycin 500mg','Bisoprolol 2.5mg','Bisoprolol 5mg','Captopril 25mg','Clopidogrel 75mg',
  'Diazepam 5mg','Digoxin 0.25mg','Diltiazem 60mg','Enalapril 5mg','Enalapril 10mg','Furosemide 40mg',
  'Glyceryl Trinitrate 0.5mg','Heparin 5000 IU','Isosorbide Mononitrate 20mg','Lisinopril 5mg','Lisinopril 10mg',
  'Losartan 50mg','Losartan 100mg','Metformin 500mg','Metformin 1000mg','Metoprolol 25mg','Metoprolol 50mg',
  'Nitroglycerin 0.4mg','Omeprazole 20mg','Paracetamol 500mg','Propranolol 20mg','Propranolol 40mg',
  'Ramipril 2.5mg','Ramipril 5mg','Rosuvastatin 10mg','Rosuvastatin 20mg','Simvastatin 20mg','Simvastatin 40mg',
  'Spironolactone 25mg','Telmisartan 40mg','Valsartan 80mg','Valsartan 160mg','Warfarin 2mg','Warfarin 5mg'
];

const timeVal = t => { const m = String(t || '').match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + +m[2]; };
const patientByEmail = e => DEMO_PATIENTS.find(p => p.email === e);
const addDaysISO = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

function ensureDoctorSeed() {
  if (DB.get('docSeed_v1', false) || !localStorage.getItem('mp_seeded')) return;
  const reasons = ['Follow-up consultation','New symptoms review','Test results discussion','Medication review','Routine check-up'];
  const times = ['09:00 AM','10:30 AM','11:30 AM','02:00 PM','03:30 PM'];
  const pts = DEMO_PATIENTS.filter(p => p.id !== 'pt1');
  const extra = [];
  DATA.doctors.forEach((d, di) => {
    const plan = [[0,'Confirmed'],[0,'Confirmed'],[0,'Pending'],[1,'Confirmed'],[2,'Pending'],[-3,'Completed'],[-9,'Completed']];
    plan.forEach(([off, status], k) => {
      if (d.id === 'd1' && off === 0 && k > 2) return;
      const p = pts[(di + k) % pts.length];
      extra.push({ id: uid('MP'), doctorId: d.id, dept: d.dept, date: addDaysISO(off), time: times[(k + di) % times.length],
        patient: p.name, email: p.email, phone: p.phone, status, fee: d.fee, reason: reasons[(k + di) % reasons.length] });
    });
  });
  DB.set('appointments', DB.all('appointments').concat(extra));
  DB.set('docSeed_v1', true);
}
function docAppts() {
  ensureDoctorSeed();
  const id = getDocProfile().id;
  return DB.all('appointments').filter(a => a.doctorId === id);
}
function docPatients() {
  const emails = new Set(docAppts().map(a => a.email));
  return DEMO_PATIENTS.filter(p => emails.has(p.email));
}
function docNotes() {
  const id = getDocProfile().id;
  return getConsultNotes().filter(n => (n.doctorId || 'd1') === id);
}

/* ============================================================
   DOCTOR DASHBOARD (Main Page)
   ============================================================ */
function DoctorDashboard() {
  if (!doctorAuthGuard()) return { html:'', init(){} };
  const doc = getDocProfile();
  const appts = docAppts();
  const today = todayISO();
  const todayAppts = appts.filter(a => a.date === today).sort((a, b) => timeVal(a.time) - timeVal(b.time));
  const upcomingAppts = appts.filter(a => a.date >= today && a.status !== 'Cancelled' && a.status !== 'Completed');
  const completedAppts = appts.filter(a => a.status === 'Completed');
  const consultNotes = docNotes();
  const myPatients = docPatients();
  const queue = todayAppts.filter(a => a.status === 'Confirmed');
  const queueCount = queue.length;

  const monthlyRevenue = [4200, 3800, 5100, 4700, 5600, 4900, 5300];
  const monthLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan'];
  const maxRev = Math.max(...monthlyRevenue);
  const totalRevenue = monthlyRevenue.reduce((a,b)=>a+b,0);

  const content = `
    <div class="doc-welcome-banner">
      <div class="dwb-left">
        <h2>Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, ${esc(doc.name.replace('Dr. ',''))}! 👋</h2>
        <p>You have <b>${todayAppts.length}</b> appointment${todayAppts.length !== 1 ? 's' : ''} today and <b>${queueCount}</b> patient${queueCount !== 1 ? 's' : ''} in queue.</p>
        <div class="dwb-actions">
          <a href="#/doctor/appointments" class="btn btn-primary btn-sm"><i class="fa-solid fa-calendar-check"></i> View Schedule</a>
          <button class="btn btn-outline btn-sm" id="startTeleconsult"><i class="fa-solid fa-video"></i> Start Teleconsultation</button>
        </div>
      </div>
      <div class="dwb-right">
        <img src="${doc.img}" alt="${esc(doc.name)}" class="dwb-avatar img-animated">
      </div>
    </div>

    <div class="stat-grid">
      ${statCard('fa-calendar-check','blue', todayAppts.length, "Today's Appointments", { dir:'up', text:'Active' })}
      ${statCard('fa-users','teal', myPatients.filter(p=>p.status==='Active').length, 'Active Patients', { dir:'up', text:myPatients.length + ' total' })}
      ${statCard('fa-star','warn', doc.rating + ' ★', 'Patient Rating', { dir:'up', text:doc.reviews + ' reviews' })}
      ${statCard('fa-sack-dollar','navy', money(totalRevenue), 'Total Revenue', { dir:'up', text:'Last 7 months' })}
    </div>

    <div class="panel-grid">
      <div>
        <div class="panel">
          <div class="panel-head">
            <div><h2>Today's Schedule</h2><p>${fmtDate(today)} · ${todayAppts.length} appointment${todayAppts.length!==1?'s':''}</p></div>
            <a href="#/doctor/appointments" class="btn-link">View all →</a>
          </div>
          <div class="panel-body">
            ${todayAppts.length ? todayAppts.map((a, i) => {
              return `
              <div class="doc-timeline-item ${a.status === 'Completed' ? 'done' : ''}" style="animation-delay:${i*0.08}s">
                <div class="dti-time">${esc(a.time)}</div>
                <div class="dti-body">
                  <div class="dti-top">
                    <b>${esc(a.patient)}</b>
                    ${statusBadge(a.status)}
                  </div>
                  <p class="text-muted small">${esc(a.reason || 'General consultation')}</p>
                  <div class="dti-actions">
                    ${a.status === 'Confirmed' ? `<button class="btn btn-primary btn-xs" data-start-consult="${a.id}"><i class="fa-solid fa-stethoscope"></i> Start</button>` : ''}
                    ${a.status === 'Pending' ? `<button class="btn btn-outline btn-xs" data-confirm-apt="${a.id}"><i class="fa-solid fa-check"></i> Confirm</button>` : ''}
                    <button class="btn btn-outline btn-xs" data-add-note="${a.id}" data-patient="${esc(a.patient)}"><i class="fa-solid fa-note-sticky"></i> Notes</button>
                  </div>
                </div>
              </div>`;
            }).join('') : `
              <div class="empty-schedule">
                <i class="fa-solid fa-calendar-day"></i>
                <b>No appointments today</b>
                <p class="text-muted small">Your next appointment will appear here.</p>
              </div>
            `}
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div><h2>Recent Consultation Notes</h2><p>Latest patient interaction records</p></div>
          </div>
          <div class="panel-body">
            ${consultNotes.slice(0,3).map(cn => `
              <div class="consult-note-card">
                <div class="cnc-header">
                  <div class="cnc-patient">
                    <div class="cnc-badge ${cn.type === 'New Consult' ? 'new' : 'followup'}">${cn.type === 'New Consult' ? 'NEW' : 'F/U'}</div>
                    <div>
                      <b>${esc(cn.patient)}</b>
                      <span class="small text-muted">${esc(fmtDate(cn.date))} at ${esc(cn.time)}</span>
                    </div>
                  </div>
                </div>
                <p class="cnc-notes">${esc(cn.notes)}</p>
                <div class="cnc-vitals">
                  <span><i class="fa-solid fa-heart-pulse"></i> BP: ${cn.vitals.bp}</span>
                  <span><i class="fa-solid fa-wave-square"></i> HR: ${cn.vitals.hr}</span>
                  <span><i class="fa-solid fa-temperature-half"></i> ${cn.vitals.temp}</span>
                  <span><i class="fa-solid fa-lungs"></i> SpO₂: ${cn.vitals.spo2}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head">
            <div><h2><span class="live-dot"></span> Live Patient Queue</h2><p>${queueCount} patient${queueCount!==1?'s':''} waiting</p></div>
          </div>
          <div class="panel-body">
            <div class="queue-display">
              <div class="queue-number">${queueCount}</div>
              <div class="queue-label">In Queue</div>
            </div>
            <div class="queue-list">
              ${queue.map(a => ({ ...(patientByEmail(a.email) || {}), name: a.patient, diagnosis: a.reason || 'Consultation', img: (patientByEmail(a.email) || {}).img || '' })).map((p,i) => `
                <div class="queue-item" style="animation-delay:${i*0.1}s">
                  <div class="qi-rank">${i+1}</div>
                  <img src="${p.img}" alt="" class="avatar-img" style="width:32px;height:32px">
                  <div class="qi-info">
                    <b>${esc(p.name)}</b>
                    <span class="small text-muted">${esc(p.diagnosis)}</span>
                  </div>
                  <span class="badge ${i===0?'badge-ok':'badge-warn'}">${i===0?'Next':'Waiting'}</span>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-block mt-3" id="callNextPatient"><i class="fa-solid fa-bell"></i> Call Next Patient</button>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>Revenue Overview</h2></div>
          <div class="panel-body">
            <div class="revenue-chart">
              ${monthlyRevenue.map((v,i) => `
                <div class="rev-bar-wrap">
                  <div class="rev-bar" style="height:${(v/maxRev)*100}%" title="${money(v)}">
                    <span class="rev-val">${money(v)}</span>
                  </div>
                  <span class="rev-label">${monthLabels[i]}</span>
                </div>
              `).join('')}
            </div>
            <div class="rev-summary">
              <div><span class="text-muted small">Avg / Month</span><b>${money(Math.round(totalRevenue/7))}</b></div>
              <div><span class="text-muted small">This Month</span><b class="text-teal">${money(monthlyRevenue[monthlyRevenue.length-1])}</b></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>Quick Actions</h2></div>
          <div class="panel-body">
            <div class="quick-actions-grid">
              <a href="#/doctor/prescription" class="qa-card">
                <div class="qa-icon blue"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
                <span>Write Prescription</span>
              </a>
              <a href="#/doctor/patients" class="qa-card">
                <div class="qa-icon teal"><i class="fa-solid fa-users"></i></div>
                <span>Patient List</span>
              </a>
              <a href="#/doctor/schedule" class="qa-card">
                <div class="qa-icon navy"><i class="fa-solid fa-calendar-days"></i></div>
                <span>My Schedule</span>
              </a>
              <a href="#/doctor/profile" class="qa-card">
                <div class="qa-icon warn"><i class="fa-solid fa-user-doctor"></i></div>
                <span>My Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/dashboard', 'Dashboard', content),
    init() {
      portalInit('doctor');
      const tc = $('#startTeleconsult');
      if (tc) tc.onclick = () => {
        openModal({
          title: 'Start Teleconsultation',
          body: `<div style="text-align:center;padding:20px 0">
            <div class="sc-icon blue" style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px;font-size:2rem"><i class="fa-solid fa-video"></i></div>
            <h3 style="margin-bottom:8px">Video Consultation Ready</h3>
            <p class="text-muted">Your secure teleconsultation room is being prepared. In a real application, this would open a video call interface.</p>
            <div class="demo-note mt-3"><b>Demo only</b> — No real video call is initiated.</div>
          </div>`,
          footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-primary" id="joinCall"><i class="fa-solid fa-video"></i> Join Call</button>`,
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#joinCall').onclick = () => { close(); toast('Teleconsultation session started (demo).', 'success', 'Video Call'); };
          }
        });
      };
      const cn = $('#callNextPatient');
      if (cn) cn.onclick = () => {
        const next = docAppts().filter(a => a.date === todayISO() && a.status === 'Confirmed').sort((a, b) => timeVal(a.time) - timeVal(b.time))[0];
        if (next) {
          DB.update('appointments', next.id, { status: 'In Progress' });
          toast(`Calling ${next.patient} to the consultation room.`, 'success', 'Patient Called');
          navigate();
        } else {
          toast('No patients in queue.', 'info');
        }
      };
      $$('[data-start-consult]').forEach(b => b.onclick = () => {
        DB.update('appointments', b.dataset.startConsult, { status: 'Completed' });
        toast('Consultation started & marked complete (demo).', 'success');
        navigate();
      });
      $$('[data-confirm-apt]').forEach(b => b.onclick = () => {
        DB.update('appointments', b.dataset.confirmApt, { status: 'Confirmed' });
        toast('Appointment confirmed.', 'success');
        navigate();
      });
      $$('[data-add-note]').forEach(b => b.onclick = () => {
        openModal({
          title: 'Consultation Notes — ' + (b.dataset.patient || 'Patient'),
          body: `<form id="noteForm" novalidate>
            <div class="form-row">
              <div class="field"><label>Consultation Type</label>
                <select name="type"><option>Follow-up</option><option>New Consult</option><option>Emergency</option><option>Teleconsult</option></select>
              </div>
            </div>
            <div class="field"><label>Clinical Notes</label><textarea name="notes" rows="4" placeholder="Enter clinical observations, examination findings, and plan..."></textarea><span class="err-msg">Required.</span></div>
            <div class="form-row">
              <div class="field"><label>Blood Pressure</label><input name="bp" placeholder="120/80"></div>
              <div class="field"><label>Heart Rate</label><input name="hr" placeholder="72 bpm"></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Temperature</label><input name="temp" placeholder="98.6°F"></div>
              <div class="field"><label>SpO₂</label><input name="spo2" placeholder="98%"></div>
            </div>
          </form>`,
          wide: true,
          footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-primary" id="saveNote"><i class="fa-solid fa-floppy-disk"></i> Save Note</button>`,
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#saveNote').onclick = () => {
              const f = root.querySelector('#noteForm');
              if (!f.notes.value.trim()) { f.notes.closest('.field').classList.add('error'); return; }
              const notes = getConsultNotes();
              notes.unshift({
                id: uid('CN'), doctorId: getDocProfile().id, patientId: '', patient: b.dataset.patient || 'Patient',
                date: todayISO(), time: new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),
                type: f.type.value, notes: f.notes.value.trim(),
                vitals: { bp: f.bp.value||'—', hr: f.hr.value||'—', temp: f.temp.value||'—', spo2: f.spo2.value||'—' }
              });
              DB.set('consultNotes', notes);
              close();
              toast('Consultation note saved.', 'success');
              navigate();
            };
          }
        });
      });
    }
  };
}

/* ============================================================
   DOCTOR APPOINTMENTS
   ============================================================ */
function DoctorAppointments() {
  if (!doctorAuthGuard()) return { html:'', init(){} };
  const appts = docAppts();
  const today = todayISO();
  const todayList = appts.filter(a => a.date === today);
  const upcoming = appts.filter(a => a.date > today && a.status !== 'Cancelled' && a.status !== 'Completed');
  const past = appts.filter(a => a.date < today || a.status === 'Completed' || a.status === 'Cancelled');

  const renderTable = (list, label) => {
    if (!list.length) return emptyState('fa-calendar-xmark', 'No ' + label.toLowerCase(), 'No appointments in this category.');
    return `<div class="table-wrap" style="border:0;border-radius:0"><table class="data">
      <thead><tr><th>Time</th><th>Patient</th><th>Reason</th><th>Fee</th><th>Status</th><th></th></tr></thead>
      <tbody>${list.map(a => `<tr>
        <td><b style="font-family:var(--head);font-size:.85rem">${esc(a.time)}</b><br><span class="small text-muted">${esc(fmtDate(a.date))}</span></td>
        <td><div class="cell-user"><div><b>${esc(a.patient)}</b><span>${esc(a.phone || a.email)}</span></div></div></td>
        <td><span class="small">${esc(a.reason || '—')}</span></td>
        <td>${money(a.fee || 0)}</td>
        <td>${statusBadge(a.status)}</td>
        <td><div class="row-actions">
          ${a.status === 'Pending' ? `<button class="icon-btn" data-doc-confirm="${a.id}" title="Confirm"><i class="fa-solid fa-check"></i></button>` : ''}
          ${a.status === 'Confirmed' ? `<button class="icon-btn" data-doc-complete="${a.id}" title="Complete"><i class="fa-solid fa-clipboard-check"></i></button>` : ''}
          ${a.status !== 'Cancelled' && a.status !== 'Completed' ? `<button class="icon-btn danger" data-doc-cancel="${a.id}" title="Cancel"><i class="fa-solid fa-xmark"></i></button>` : ''}
        </div></td>
      </tr>`).join('')}</tbody></table></div>`;
  };

  const content = `
    <div class="panel" data-tabs-wrap>
      <div class="panel-head">
        <div><h2>Appointments</h2><p>${appts.length} total appointment${appts.length!==1?'s':''}</p></div>
        <div class="tab-pills">
          <button class="pill active" data-tab="today">Today (${todayList.length})</button>
          <button class="pill" data-tab="upcoming">Upcoming (${upcoming.length})</button>
          <button class="pill" data-tab="past">Past (${past.length})</button>
          <button class="pill" data-tab="all">All (${appts.length})</button>
        </div>
      </div>
      <div class="panel-body pad-0">
        <div data-tab-panel="today" class="active">${renderTable(todayList, 'today\'s appointments')}</div>
        <div data-tab-panel="upcoming">${renderTable(upcoming, 'upcoming appointments')}</div>
        <div data-tab-panel="past">${renderTable(past, 'past appointments')}</div>
        <div data-tab-panel="all">${renderTable(appts, 'appointments')}</div>
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/appointments', 'Appointments', content),
    init() {
      portalInit('doctor');
      $$('[data-doc-confirm]').forEach(b => b.onclick = () => { DB.update('appointments', b.dataset.docConfirm, { status:'Confirmed' }); toast('Appointment confirmed.','success'); navigate(); });
      $$('[data-doc-complete]').forEach(b => b.onclick = () => { DB.update('appointments', b.dataset.docComplete, { status:'Completed' }); toast('Marked as completed.','success'); navigate(); });
      $$('[data-doc-cancel]').forEach(b => b.onclick = () => {
        openModal({
          title: 'Cancel Appointment',
          body: '<p class="text-muted">Are you sure you want to cancel this appointment?</p>',
          footer: '<button class="btn btn-outline" data-c>Keep</button><button class="btn btn-danger" id="doCancel">Cancel Appointment</button>',
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#doCancel').onclick = () => { DB.update('appointments', b.dataset.docCancel, { status:'Cancelled' }); close(); toast('Appointment cancelled.','warn'); navigate(); };
          }
        });
      });
    }
  };
}

/* ============================================================
   DOCTOR PATIENTS LIST
   ============================================================ */
function DoctorPatients() {
  if (!doctorAuthGuard()) return { html:'', init(){} };

  const content = `
    <div class="panel">
      <div class="panel-head">
        <div><h2>Patient List</h2><p>${docPatients().length} patient${docPatients().length === 1 ? '' : 's'} under your care</p></div>
        <div class="p-search" style="width:240px;max-width:100%"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Search patients…" id="patientSearch"></div>
      </div>
      <div class="panel-body pad-0">
        <div class="table-wrap" style="border:0;border-radius:0"><table class="data" id="patientTable">
          <thead><tr><th>Patient</th><th>Age / Gender</th><th>Blood</th><th>Last Diagnosis</th><th>Last Visit</th><th>Status</th><th></th></tr></thead>
          <tbody>${docPatients().map(p => `<tr data-name="${esc(p.name.toLowerCase())}">
            <td><div class="cell-user">
              <img src="${p.img}" alt="" class="avatar-img img-animated" style="width:38px;height:38px">
              <div><b>${esc(p.name)}</b><span>${esc(p.email)}</span></div>
            </div></td>
            <td>${p.age} / ${p.gender}</td>
            <td><span class="badge badge-neutral">${p.blood}</span></td>
            <td><span class="small">${esc(p.diagnosis)}</span></td>
            <td>${esc(fmtDate(p.lastVisit))}</td>
            <td>${statusBadge(p.status === 'Active' ? 'Active' : p.status === 'Follow-up' ? 'Pending' : 'Completed')}</td>
            <td><div class="row-actions">
              <button class="icon-btn" data-view-patient="${p.id}" title="View history"><i class="fa-solid fa-eye"></i></button>
              <a href="#/doctor/prescription?patient=${encodeURIComponent(p.name)}" class="icon-btn" title="Write prescription"><i class="fa-solid fa-prescription"></i></a>
            </div></td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/patients', 'Patient List', content),
    init() {
      portalInit('doctor');
      const search = $('#patientSearch');
      if (search) search.oninput = () => {
        const q = search.value.toLowerCase();
        $$('#patientTable tbody tr').forEach(tr => {
          tr.style.display = tr.dataset.name.includes(q) ? '' : 'none';
        });
      };
      $$('[data-view-patient]').forEach(b => b.onclick = () => {
        const p = docPatients().find(x => x.id === b.dataset.viewPatient);
        if (!p) return;
        openModal({
          title: p.name + ' — Patient Record',
          wide: true,
          body: `<div class="patient-detail-modal">
            <div class="pdm-header">
              <img src="${p.img}" alt="" class="avatar-img" style="width:64px;height:64px">
              <div>
                <h3>${esc(p.name)}</h3>
                <p class="text-muted">${p.age} years · ${p.gender} · Blood group: ${p.blood}</p>
                <p class="small text-muted"><i class="fa-solid fa-phone"></i> ${esc(p.phone)} · <i class="fa-solid fa-envelope"></i> ${esc(p.email)}</p>
              </div>
            </div>
            <div class="summary-rows mt-3" style="padding:0">
              <div class="summary-row"><span>Status</span>${statusBadge(p.status === 'Active' ? 'Active' : p.status === 'Follow-up' ? 'Pending' : 'Completed')}</div>
              <div class="summary-row"><span>Last Visit</span><b>${esc(fmtDate(p.lastVisit))}</b></div>
              <div class="summary-row"><span>Primary Diagnosis</span><b>${esc(p.diagnosis)}</b></div>
            </div>
            <div class="mt-3">
              <h4 style="font-size:.9rem;margin-bottom:12px">Medical Timeline</h4>
              <div class="timeline">
                <div class="tl-item done"><h4>Last consultation</h4><p>${esc(p.diagnosis)} — routine monitoring and medication review.</p><time>${esc(fmtDate(p.lastVisit))}</time></div>
                <div class="tl-item done"><h4>Initial assessment</h4><p>Patient registered and baseline vitals recorded.</p><time>2024</time></div>
              </div>
            </div>
          </div>`,
          footer: `<a href="#/doctor/prescription?patient=${encodeURIComponent(p.name)}" class="btn btn-primary" onclick="document.querySelector('.modal-backdrop')?.remove()"><i class="fa-solid fa-prescription"></i> Write Prescription</a>
            <button class="btn btn-outline" data-c>Close</button>`,
          onMount(root, close) { root.querySelector('[data-c]').onclick = close; }
        });
      });
    }
  };
}

/* ============================================================
   DOCTOR SCHEDULE
   ============================================================ */
function DoctorSchedule() {
  if (!doctorAuthGuard()) return { html:'', init(){} };
  const doc = getDocProfile();
  const allDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const slots = DATA.timeSlots;
  const appts = docAppts();

  const content = `
    <div class="panel-grid">
      <div class="panel">
        <div class="panel-head"><div><h2>Weekly Availability</h2><p>Toggle your available days</p></div></div>
        <div class="panel-body">
          <div class="week-grid" id="weekGrid">
            ${allDays.map(day => {
              const isAvail = doc.days.includes(day);
              const dayAppts = appts.filter(a => {
                const d = new Date(a.date + 'T00:00:00');
                return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] === day;
              });
              return `
              <div class="week-day-card ${isAvail ? 'available' : 'off'}" data-toggle-day="${day}">
                <div class="wdc-header">
                  <b>${day}</b>
                  <span class="wdc-status">${isAvail ? '✓ Available' : '✗ Off'}</span>
                </div>
                <div class="wdc-body">
                  ${isAvail ? `
                    <span class="small text-muted"><i class="fa-solid fa-clock"></i> ${esc(doc.consultHours || '9:00 AM - 5:30 PM')}</span>
                    <span class="small" style="color:var(--blue)"><i class="fa-solid fa-calendar-check"></i> ${dayAppts.length} booking${dayAppts.length!==1?'s':''}</span>
                  ` : '<span class="small text-muted">Not available</span>'}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h2>Consultation Hours</h2></div>
          <div class="panel-body">
            <div class="summary-rows" style="padding:0">
              <div class="summary-row"><span>Morning</span><b>09:00 AM – 12:00 PM</b></div>
              <div class="summary-row"><span>Afternoon</span><b>02:00 PM – 05:30 PM</b></div>
              <div class="summary-row"><span>Slot Duration</span><b>30 minutes</b></div>
              <div class="summary-row"><span>Max Patients/Day</span><b>15</b></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Time Slots</h2></div>
          <div class="panel-body">
            <div class="slot-chips">
              ${slots.map(s => `<span class="chip slot-chip">${s}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Schedule Stats</h2></div>
          <div class="panel-body">
            <div class="progress-list">
              ${[['Availability Rate', doc.days.length + '/7 days', Math.round((doc.days.length/7)*100)],
                 ['Avg Patients/Day', '8', 53],
                 ['Slot Utilization', '72%', 72]].map(([l,v,w]) => `
              <div class="progress-item">
                <div class="pi-top"><span>${l}</span><b>${v}</b></div>
                <div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/schedule', 'My Schedule', content),
    init() {
      portalInit('doctor');
      $$('[data-toggle-day]').forEach(card => card.onclick = () => {
        const day = card.dataset.toggleDay;
        const prof = getDocProfile();
        const idx = prof.days.indexOf(day);
        if (idx > -1) prof.days.splice(idx, 1);
        else prof.days.push(day);
        DB.set('doctorProfile', prof);
        toast(`${day} ${idx > -1 ? 'marked as off' : 'marked as available'} (demo).`, 'info');
        navigate();
      });
    }
  };
}

/* ============================================================
   DOCTOR PRESCRIPTION WRITER
   ============================================================ */
function DoctorPrescription() {
  if (!doctorAuthGuard()) return { html:'', init(){} };
  const doc = getDocProfile();
  const query = currentQuery();
  const preselectedPatient = query.patient || '';

  const content = `
    <div class="panel-grid">
      <div class="panel" style="grid-column:1/-1">
        <div class="panel-head">
          <div><h2><i class="fa-solid fa-prescription-bottle-medical"></i> Write New Prescription</h2><p>Fill in patient details and medications</p></div>
        </div>
        <div class="panel-body">
          <form id="rxForm" novalidate>
            <div class="rx-section-title"><i class="fa-solid fa-user"></i> Patient Information</div>
            <div class="form-row">
              <div class="field"><label>Patient Name</label>
                <select name="patient" id="rxPatient">
                  <option value="">— Select patient —</option>
                  ${docPatients().map(p => `<option value="${esc(p.name)}" ${p.name === preselectedPatient ? 'selected' : ''}>${esc(p.name)} (${p.age}/${p.gender})</option>`).join('')}
                </select>
                <span class="err-msg">Select a patient.</span>
              </div>
              <div class="field"><label>Diagnosis</label><input name="diagnosis" placeholder="e.g. Stage 1 Hypertension"><span class="err-msg">Required.</span></div>
            </div>

            <div class="rx-section-title"><i class="fa-solid fa-pills"></i> Medications</div>
            <div id="medList">
              <div class="med-row">
                <div class="form-row">
                  <div class="field med-name-field"><label>Medication</label><input name="med_name_0" class="med-autocomplete" placeholder="Start typing…" autocomplete="off"><div class="autocomplete-dropdown" id="acDrop_0"></div></div>
                  <div class="field"><label>Dosage</label><input name="med_dose_0" placeholder="e.g. 1 tablet"></div>
                </div>
                <div class="form-row">
                  <div class="field"><label>Frequency</label>
                    <select name="med_freq_0">
                      <option>Once daily (morning)</option><option>Once daily (evening)</option><option>Twice daily</option><option>Three times daily</option><option>Every 6 hours</option><option>Every 8 hours</option><option>As needed (PRN)</option><option>Before meals</option><option>After meals</option>
                    </select>
                  </div>
                  <div class="field"><label>Duration</label>
                    <select name="med_dur_0">
                      <option>5 days</option><option>7 days</option><option>10 days</option><option>14 days</option><option>21 days</option><option>30 days</option><option>60 days</option><option>90 days</option><option>Until review</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm mt-2" id="addMed"><i class="fa-solid fa-plus"></i> Add Another Medication</button>

            <div class="rx-section-title mt-3"><i class="fa-solid fa-clipboard"></i> Clinical Advice</div>
            <div class="field"><label>Advice / Instructions</label><textarea name="advice" rows="3" placeholder="Lifestyle modifications, follow-up schedule, precautions…"></textarea></div>

            <div class="flex mt-3" style="gap:10px;flex-wrap:wrap">
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Issue Prescription</button>
              <button type="button" class="btn btn-outline" id="previewRx"><i class="fa-solid fa-eye"></i> Preview</button>
              <button type="reset" class="btn btn-outline"><i class="fa-solid fa-rotate-left"></i> Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><div><h2>Recently Issued</h2><p>Prescriptions you've written</p></div></div>
      <div class="panel-body">
        ${DB.all('prescriptions').filter(r => r.doctorId === doc.id).slice(0,5).map(rx => `
          <div class="rx-paper" style="margin-bottom:14px">
            <div class="flex between" style="flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div><b style="font-family:var(--head);font-size:.9rem;color:var(--heading)">${esc(rx.id)}</b>
                <p class="small text-muted">${esc(rx.patient)} · ${esc(fmtDate(rx.date))}</p></div>
              <div class="flex" style="gap:8px;align-items:center;flex-wrap:wrap">${statusBadge(rx.status)}
                <button type="button" class="btn btn-outline btn-xs" data-rx-view="${esc(rx.id)}"><i class="fa-regular fa-eye"></i> View</button>
                <button type="button" class="btn btn-primary btn-xs" data-rx-print="${esc(rx.id)}"><i class="fa-solid fa-print"></i> Print / PDF</button></div>
            </div>
            <p class="small"><strong>Dx:</strong> <span class="text-muted">${esc(rx.diagnosis)}</span></p>
            ${rx.meds.map(m => `<div class="rx-row"><div><b style="font-family:var(--head);font-size:.85rem;color:var(--heading)">${esc(m.name)}</b><p class="small text-muted">${esc(m.dose)} · ${esc(m.freq)}</p></div><span class="badge badge-neutral">${esc(m.dur)}</span></div>`).join('')}
          </div>
        `).join('') || emptyState('fa-prescription','No prescriptions yet','Prescriptions you issue will appear here.')}
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/prescription', 'Write Prescription', content),
    init() {
      portalInit('doctor');
      let medCount = 1;
      const findRx = id => DB.all('prescriptions').find(r => r.id === id);
      $$('[data-rx-view]').forEach(b => b.onclick = () => { const r = findRx(b.dataset.rxView); if (r) openRxModal(r); });
      $$('[data-rx-print]').forEach(b => b.onclick = () => { const r = findRx(b.dataset.rxPrint); if (r) printRx(r); });

      function setupAutocomplete(input, dropId) {
        const drop = document.getElementById(dropId);
        if (!input || !drop) return;
        input.oninput = () => {
          const q = input.value.toLowerCase();
          if (q.length < 2) { drop.innerHTML = ''; drop.style.display = 'none'; return; }
          const matches = MEDICATION_DB.filter(m => m.toLowerCase().includes(q)).slice(0, 6);
          if (!matches.length) { drop.innerHTML = ''; drop.style.display = 'none'; return; }
          drop.innerHTML = matches.map(m => `<div class="ac-option">${esc(m)}</div>`).join('');
          drop.style.display = 'block';
          drop.querySelectorAll('.ac-option').forEach(opt => opt.onclick = () => {
            input.value = opt.textContent;
            drop.innerHTML = '';
            drop.style.display = 'none';
          });
        };
        input.onblur = () => setTimeout(() => { drop.style.display = 'none'; }, 200);
      }
      setupAutocomplete(document.querySelector('[name="med_name_0"]'), 'acDrop_0');

      const addBtn = $('#addMed');
      if (addBtn) addBtn.onclick = () => {
        const row = document.createElement('div');
        row.className = 'med-row';
        row.innerHTML = `
          <div class="form-row">
            <div class="field med-name-field"><label>Medication</label><input name="med_name_${medCount}" class="med-autocomplete" placeholder="Start typing…" autocomplete="off"><div class="autocomplete-dropdown" id="acDrop_${medCount}"></div></div>
            <div class="field"><label>Dosage</label><input name="med_dose_${medCount}" placeholder="e.g. 1 tablet"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Frequency</label>
              <select name="med_freq_${medCount}"><option>Once daily (morning)</option><option>Once daily (evening)</option><option>Twice daily</option><option>Three times daily</option><option>Every 6 hours</option><option>Every 8 hours</option><option>As needed (PRN)</option><option>Before meals</option><option>After meals</option></select>
            </div>
            <div class="field"><label>Duration</label>
              <select name="med_dur_${medCount}"><option>5 days</option><option>7 days</option><option>10 days</option><option>14 days</option><option>21 days</option><option>30 days</option><option>60 days</option><option>90 days</option><option>Until review</option></select>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-xs remove-med" style="color:var(--danger);border-color:rgba(220,38,38,.3);margin-top:4px"><i class="fa-solid fa-trash"></i> Remove</button>`;
        document.getElementById('medList').appendChild(row);
        setupAutocomplete(row.querySelector(`[name="med_name_${medCount}"]`), `acDrop_${medCount}`);
        row.querySelector('.remove-med').onclick = () => { row.remove(); };
        medCount++;
      };

      const form = $('#rxForm');
      if (form) form.onsubmit = e => {
        e.preventDefault();
        let ok = true;
        const setErr = (n, bad) => { const el = form[n]; if (el) { el.closest('.field').classList.toggle('error', bad); if (bad) ok = false; } };
        setErr('patient', !form.patient.value);
        setErr('diagnosis', !form.diagnosis.value.trim());
        if (!ok) { toast('Please fill required fields.', 'error'); return; }
        const meds = [];
        for (let i = 0; i < medCount; i++) {
          const name = form['med_name_'+i]; const dose = form['med_dose_'+i];
          const freq = form['med_freq_'+i]; const dur = form['med_dur_'+i];
          if (name && name.value.trim()) {
            meds.push({ name: name.value.trim(), dose: dose?.value||'As directed', freq: freq?.value||'As needed', dur: dur?.value||'Until review' });
          }
        }
        if (!meds.length) { toast('Add at least one medication.', 'error'); return; }
        const rx = {
          id: uid('RX'), patient: form.patient.value, email: (DEMO_PATIENTS.find(x => x.name === form.patient.value) || {}).email || 'patient@demo.com',
          doctorId: getDocProfile().id, date: todayISO(), diagnosis: form.diagnosis.value.trim(),
          meds, advice: form.advice?.value?.trim() || '', status: 'Active'
        };
        DB.push('prescriptions', rx);
        toast('Prescription issued successfully!', 'success', rx.id);
        navigate();
        openRxModal(rx);
      };

      const prev = $('#previewRx');
      if (prev) prev.onclick = () => {
        const f = form;
        const patientName = f.patient.value || 'Patient';
        const diagnosis = f.diagnosis.value || '—';
        let medsHTML = '';
        for (let i = 0; i < medCount; i++) {
          const name = f['med_name_'+i];
          if (name && name.value.trim()) {
            medsHTML += `<div class="rx-row"><div><b>${esc(name.value)}</b><p class="small text-muted">${esc(f['med_dose_'+i]?.value||'As directed')} · ${esc(f['med_freq_'+i]?.value||'—')}</p></div><span class="badge badge-neutral">${esc(f['med_dur_'+i]?.value||'—')}</span></div>`;
          }
        }
        openModal({
          title: 'Prescription Preview',
          wide: true,
          body: `<div class="rx-paper">
            <div class="rx-preview-header">
              <div><b style="font-family:var(--head);font-size:1.1rem;color:var(--heading)">MEDICARE PLUS</b><p class="small text-muted">128 Wellness Boulevard, Springfield</p></div>
              <div style="text-align:right"><b>${esc(getDocProfile().name)}</b><p class="small text-muted">${esc(getDocProfile().specialty)}<br>${esc(getDocProfile().qual)}</p></div>
            </div>
            <hr style="border-color:var(--line);margin:14px 0">
            <div class="flex between"><span><b>Patient:</b> ${esc(patientName)}</span><span><b>Date:</b> ${fmtDate(todayISO())}</span></div>
            <p class="mt-2"><b>Diagnosis:</b> ${esc(diagnosis)}</p>
            <div class="mt-3"><b>℞ Medications:</b></div>
            ${medsHTML || '<p class="text-muted small">No medications added yet.</p>'}
            ${f.advice?.value ? `<p class="mt-3"><b>Advice:</b> ${esc(f.advice.value)}</p>` : ''}
            <div class="mt-3" style="text-align:right"><p class="small text-muted">Digital prescription · Medicare Plus</p></div>
          </div>`,
          footer: '<button class="btn btn-outline" data-c>Close</button><button class="btn btn-primary" id="rxPrintDraft"><i class="fa-solid fa-print"></i> Print / Save as PDF</button>',
          onMount(root, close) {
            root.querySelector('[data-c]').onclick = close;
            root.querySelector('#rxPrintDraft').onclick = () => {
              const meds = [];
              for (let i = 0; i < medCount; i++) {
                const n = f['med_name_' + i];
                if (n && n.value.trim()) meds.push({ name: n.value.trim(), dose: f['med_dose_' + i]?.value || 'As directed', freq: f['med_freq_' + i]?.value || '', dur: f['med_dur_' + i]?.value || '' });
              }
              printRx({
                id: 'DRAFT', patient: patientName, doctorId: getDocProfile().id,
                date: todayISO(), diagnosis: diagnosis, meds: meds,
                advice: f.advice?.value || ''
              });
            };
          }
        });
      };
    }
  };
}

/* ============================================================
   PRESCRIPTION HELPERS — openRxModal + printRx
   (referenced above but not in the truncated paste)
   ============================================================ */
function openRxModal(rx) {
  const doc = DATA.doctors.find(d => d.id === rx.doctorId) || getDocProfile();
  openModal({
    title: 'Prescription — ' + rx.id,
    wide: true,
    body: `<div class="rx-paper" id="rxPaperBody">
      <div class="rx-preview-header">
        <div><b style="font-family:var(--head);font-size:1.1rem;color:var(--heading)">MEDICARE PLUS</b><p class="small text-muted">128 Wellness Boulevard, Springfield</p></div>
        <div style="text-align:right"><b>${esc(doc.name)}</b><p class="small text-muted">${esc(doc.specialty || '')}<br>${esc(doc.qual || '')}</p></div>
      </div>
      <hr style="border-color:var(--line);margin:14px 0">
      <div class="flex between" style="flex-wrap:wrap;gap:6px"><span><b>Patient:</b> ${esc(rx.patient)}</span><span><b>Date:</b> ${fmtDate(rx.date)}</span></div>
      <p class="mt-2"><b>Diagnosis:</b> ${esc(rx.diagnosis)}</p>
      <div class="mt-3"><b>℞ Medications:</b></div>
      ${rx.meds.map(m => `<div class="rx-row"><div><b style="font-family:var(--head)">${esc(m.name)}</b><p class="small text-muted">${esc(m.dose)} · ${esc(m.freq)}</p></div><span class="badge badge-neutral">${esc(m.dur)}</span></div>`).join('')}
      ${rx.advice ? `<p class="mt-3"><b>Advice:</b> ${esc(rx.advice)}</p>` : ''}
      <div class="mt-3" style="text-align:right"><p class="small text-muted">Digital prescription · Medicare Plus</p></div>
    </div>`,
    footer: `<button class="btn btn-outline" data-c>Close</button><button class="btn btn-primary" id="rxPrintNow"><i class="fa-solid fa-print"></i> Print / Save as PDF</button>`,
    onMount(root, close) {
      root.querySelector('[data-c]').onclick = close;
      root.querySelector('#rxPrintNow').onclick = () => printRx(rx);
    }
  });
}

function printRx(rx) {
  const doc = DATA.doctors.find(d => d.id === rx.doctorId) || getDocProfile();
  const win = window.open('', '_blank', 'width=820,height=920');
  if (!win) { toast('Please allow popups to print.', 'warn'); return; }
  win.document.write(`<!DOCTYPE html><html><head><title>Prescription ${rx.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #111; max-width: 720px; margin: auto; }
    h1 { font-size: 20px; margin: 0; }
    .hdr { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
    .hdr p { margin: 2px 0; font-size: 12px; color: #555; }
    .rx-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ccc; }
    .rx-row b { font-size: 14px; }
    .rx-row small { color: #666; }
    .meta p { margin: 4px 0; font-size: 13px; }
    .foot { margin-top: 40px; text-align: right; font-size: 12px; color: #777; }
    .badge { background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
    @media print { body { padding: 10px; } }
  </style></head><body>
    <div class="hdr">
      <div><h1>MEDICARE PLUS</h1><p>128 Wellness Boulevard, Springfield</p></div>
      <div style="text-align:right"><b>${esc(doc.name)}</b><p>${esc(doc.specialty || '')}<br>${esc(doc.qual || '')}</p></div>
    </div>
    <div class="meta">
      <p><b>Patient:</b> ${esc(rx.patient)} &nbsp; | &nbsp; <b>Date:</b> ${fmtDate(rx.date)} &nbsp; | &nbsp; <b>Rx ID:</b> ${esc(rx.id)}</p>
      <p><b>Diagnosis:</b> ${esc(rx.diagnosis)}</p>
    </div>
    <h3 style="margin-top:22px">℞ Medications</h3>
    ${rx.meds.map(m => `<div class="rx-row"><div><b>${esc(m.name)}</b><br><small>${esc(m.dose)} · ${esc(m.freq)}</small></div><span class="badge">${esc(m.dur)}</span></div>`).join('')}
    ${rx.advice ? `<p style="margin-top:18px"><b>Advice:</b> ${esc(rx.advice)}</p>` : ''}
    <div class="foot"><p>Digital prescription · Medicare Plus (demo)</p></div>
    <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
  </body></html>`);
  win.document.close();
}

/* ============================================================
   Route registrations — Doctor portal
   ============================================================ */
route('/doctor', () => { location.hash = '#/doctor/dashboard'; });
route('/doctor/dashboard', DoctorDashboard);
route('/doctor/appointments', DoctorAppointments);
route('/doctor/patients', DoctorPatients);
route('/doctor/schedule', DoctorSchedule);
route('/doctor/prescription', DoctorPrescription);

/* ============================================================
   ⚠️  APPEND YOUR EXISTING CODE BELOW THIS LINE:
   - DoctorProfile()
   - all Admin pages (AdminDashboard, AdminAppointments, ...)
   - route('/doctor/profile', DoctorProfile)
   - route('/admin/...', ...)
   (Those were truncated from your paste and I did NOT touch them)
   ============================================================ */