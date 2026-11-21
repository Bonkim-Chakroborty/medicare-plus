/* ============================================================
   MEDICARE PLUS — dashboard.js
   Patient / Doctor / Admin portals (frontend demo only).
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
              <!-- 📷 DEMO IMAGE: পোর্টাল ইউজারের ছবি (পরে পরিবর্তন করুন) -->
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
                    <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
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
                <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
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
            <div class="summary-row"><span>Reason</span><b style="max-width:60%;font-weight:500">${esc(a.reason || '—')}</b></div>
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
              <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
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
            <!-- 📷 DEMO IMAGE: রোগীর প্রোফাইল ছবি (পরে পরিবর্তন করুন) -->
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

/* ---------- Auth Guard ---------- */
function doctorAuthGuard() {
  const session = DB.get('session', null);
  if (!session || session.role !== 'doctor') {
    toast('Please sign in as a doctor to access this portal.', 'warn', 'Access Denied');
    setTimeout(() => { location.hash = '#/login'; }, 100);
    return false;
  }
  return true;
}

/* ---------- Doctor Data Helper ---------- */
function getDocProfile() {
  const session = DB.get('session', null);
  const saved = DB.get('doctorProfile', null);
  if (saved) return saved;
  // ডিফল্ট ডাক্তার প্রোফাইল (Dr. Ayesha Rahman — d1)
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

/* ---------- Demo Patient Data ---------- */
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

/* ---------- Demo Consultation Notes ---------- */
function getConsultNotes() {
  return DB.get('consultNotes', [
    { id:'cn1', patientId:'pt1', patient:'Sarah Mitchell', date:'2025-01-18', time:'10:30 AM', type:'Follow-up', notes:'BP 128/84, stable on current medication. Continue Amlodipine 5mg. Recheck in 3 months.', vitals:{ bp:'128/84', hr:'72', temp:'98.4°F', spo2:'98%' }},
    { id:'cn2', patientId:'pt5', patient:'Meera Pillai', date:'2025-01-16', time:'02:30 PM', type:'New Consult', notes:'ECG shows occasional PVCs. Holter monitor ordered. Advised to reduce caffeine intake.', vitals:{ bp:'118/76', hr:'82', temp:'98.6°F', spo2:'99%' }},
    { id:'cn3', patientId:'pt4', patient:'David Ferreira', date:'2025-01-12', time:'11:00 AM', type:'Follow-up', notes:'HbA1c 7.2%, improved from 8.1%. Continue Metformin. Added Atorvastatin for dyslipidemia.', vitals:{ bp:'140/92', hr:'78', temp:'98.2°F', spo2:'97%' }}
  ]);
}

/* ---------- Medication Autocomplete Data ---------- */
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

/* ---------- Per-doctor data helpers ---------- */
const timeVal = t => { const m = String(t || '').match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + +m[2]; };
const patientByEmail = e => DEMO_PATIENTS.find(p => p.email === e);
const addDaysISO = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

/* Demo-r jonno prottek doctor-er nijosso kichu appointment (ekbar-i toiri hoy) */
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

  // Revenue data (ডেমো)
  const monthlyRevenue = [4200, 3800, 5100, 4700, 5600, 4900, 5300];
  const monthLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan'];
  const maxRev = Math.max(...monthlyRevenue);
  const totalRevenue = monthlyRevenue.reduce((a,b)=>a+b,0);

  const content = `
    <!-- ⬇️ ওয়েলকাম ব্যানার -->
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
        <!-- 📷 DEMO IMAGE: ডাক্তারের প্রোফাইল ছবি (পরে পরিবর্তন করুন) -->
        <img src="${doc.img}" alt="${esc(doc.name)}" class="dwb-avatar img-animated">
      </div>
    </div>

    <!-- ⬇️ স্ট্যাট কার্ড -->
    <div class="stat-grid">
      ${statCard('fa-calendar-check','blue', todayAppts.length, "Today's Appointments", { dir:'up', text:'Active' })}
      ${statCard('fa-users','teal', myPatients.filter(p=>p.status==='Active').length, 'Active Patients', { dir:'up', text:myPatients.length + ' total' })}
      ${statCard('fa-star','warn', doc.rating + ' ★', 'Patient Rating', { dir:'up', text:doc.reviews + ' reviews' })}
      ${statCard('fa-sack-dollar','navy', money(totalRevenue), 'Total Revenue', { dir:'up', text:'Last 7 months' })}
    </div>

    <div class="panel-grid">
      <div>
        <!-- ⬇️ আজকের টাইমলাইন -->
        <div class="panel">
          <div class="panel-head">
            <div><h2>Today's Schedule</h2><p>${fmtDate(today)} · ${todayAppts.length} appointment${todayAppts.length!==1?'s':''}</p></div>
            <a href="#/doctor/appointments" class="btn-link">View all →</a>
          </div>
          <div class="panel-body ${todayAppts.length ? '' : ''}">
            ${todayAppts.length ? todayAppts.map((a, i) => {
              const d = DATA.doctors.find(x => x.id === a.doctorId);
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

        <!-- ⬇️ সাম্প্রতিক কনসালটেশন নোটস -->
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
        <!-- ⬇️ লাইভ পেশেন্ট কিউ -->
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

        <!-- ⬇️ রেভিনিউ চার্ট -->
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

        <!-- ⬇️ কুইক অ্যাকশনস -->
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
      // Teleconsultation button
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
      // Call next patient
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
      // Start consult
      $$('[data-start-consult]').forEach(b => b.onclick = () => {
        DB.update('appointments', b.dataset.startConsult, { status: 'Completed' });
        toast('Consultation started & marked complete (demo).', 'success');
        navigate();
      });
      // Confirm appointment
      $$('[data-confirm-apt]').forEach(b => b.onclick = () => {
        DB.update('appointments', b.dataset.confirmApt, { status: 'Confirmed' });
        toast('Appointment confirmed.', 'success');
        navigate();
      });
      // Add notes
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
        <div class="p-search" style="width:240px"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Search patients…" id="patientSearch"></div>
      </div>
      <div class="panel-body pad-0">
        <div class="table-wrap" style="border:0;border-radius:0"><table class="data" id="patientTable">
          <thead><tr><th>Patient</th><th>Age / Gender</th><th>Blood</th><th>Last Diagnosis</th><th>Last Visit</th><th>Status</th><th></th></tr></thead>
          <tbody>${docPatients().map(p => `<tr data-name="${esc(p.name.toLowerCase())}">
            <td><div class="cell-user">
              <!-- 📷 DEMO IMAGE: রোগীর ছবি (পরে পরিবর্তন করুন) -->
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
      // Search filter
      const search = $('#patientSearch');
      if (search) search.oninput = () => {
        const q = search.value.toLowerCase();
        $$('#patientTable tbody tr').forEach(tr => {
          tr.style.display = tr.dataset.name.includes(q) ? '' : 'none';
        });
      };
      // View patient detail modal
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
            <!-- ⬇️ রোগীর তথ্য -->
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

            <!-- ⬇️ ওষুধের তালিকা -->
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

            <!-- ⬇️ পরামর্শ -->
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

    <!-- ⬇️ সাম্প্রতিক প্রেসক্রিপশন -->
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

      // Medication autocomplete
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

      // Add medication row
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

      // Submit prescription
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

      // Preview
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
              if (!f.patient.value || !meds.length) { toast('Select a patient and add a medication first.', 'error'); return; }
              printRx({ id: 'DRAFT', patient: f.patient.value, email: (DEMO_PATIENTS.find(x => x.name === f.patient.value) || {}).email, doctorId: getDocProfile().id,
                date: todayISO(), diagnosis: f.diagnosis.value.trim() || '—', meds, advice: f.advice?.value?.trim() || '', draft: true });
            };
          }
        });
      };
    }
  };
}

/* ============================================================
   DOCTOR PROFILE
   ============================================================ */
function DoctorProfile() {
  if (!doctorAuthGuard()) return { html:'', init(){} };
  const doc = getDocProfile();
  const d1 = DATA.doctors.find(x => x.id === 'd1');

  const content = `
    <div class="panel-grid">
      <div class="panel">
        <div class="panel-head"><div><h2>Professional Information</h2><p>Update your details below</p></div></div>
        <div class="panel-body">
          <form id="docProfileForm" novalidate>
            <div class="form-row">
              <div class="field"><label>Full Name</label><input name="name" value="${esc(doc.name)}"><span class="err-msg">Required.</span></div>
              <div class="field"><label>Specialty</label><input name="specialty" value="${esc(doc.specialty)}"></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Qualifications</label><input name="qual" value="${esc(doc.qual)}"></div>
              <div class="field"><label>Years of Experience</label><input name="exp" type="number" value="${doc.exp}"></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Email</label><input name="email" type="email" value="${esc(doc.email)}"></div>
              <div class="field"><label>Phone</label><input name="phone" value="${esc(doc.phone)}"></div>
            </div>
            <div class="form-row">
              <div class="field"><label>Consultation Fee</label><input name="fee" type="number" value="${doc.fee}"></div>
              <div class="field"><label>Medical ID</label><input name="medicalId" value="${esc(doc.medicalId || '')}"></div>
            </div>
            <div class="field"><label>Bio</label><textarea name="bio" rows="4">${esc(doc.bio)}</textarea></div>
            <div class="field"><label>Languages</label><input name="lang" value="${esc((doc.lang||[]).join(', '))}"></div>
            <button class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
          </form>
        </div>
      </div>

      <div>
        <div class="panel">
          <div class="panel-head"><h2>Profile Card</h2></div>
          <div class="panel-body center">
            <!-- 📷 DEMO IMAGE: ডাক্তারের প্রোফাইল ছবি (পরে পরিবর্তন করুন) -->
            <img src="${doc.img}" alt="" class="avatar-img img-animated" style="width:96px;height:96px">
            <h3 class="mt-2">${esc(doc.name)}</h3>
            <p class="small text-muted">${esc(doc.specialty)}</p>
            <span class="badge badge-teal mt-2">${esc(doc.dept)}</span>
            <div class="summary-rows mt-3" style="text-align:left;padding:0">
              <div class="summary-row"><span>Experience</span><b>${doc.exp} years</b></div>
              <div class="summary-row"><span>Rating</span><b>${doc.rating} ★ (${doc.reviews})</b></div>
              <div class="summary-row"><span>Fee</span><b>${money(doc.fee)}</b></div>
              <div class="summary-row"><span>ID</span><b style="font-size:.78rem">${esc(doc.medicalId || 'MC-DR-2024-001')}</b></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>Performance</h2></div>
          <div class="panel-body">
            <div class="progress-list">
              ${[['Patient Satisfaction', doc.rating * 20 + '%', doc.rating * 20],
                 ['On-Time Rate', '94%', 94],
                 ['Follow-up Compliance', '87%', 87]].map(([l,v,w]) => `
              <div class="progress-item">
                <div class="pi-top"><span>${l}</span><b>${v}</b></div>
                <div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div>
              </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>Account Actions</h2></div>
          <div class="panel-body">
            <button class="btn btn-outline btn-block" id="docChangePw"><i class="fa-solid fa-lock"></i> Change Password</button>
            <button class="btn btn-outline btn-block mt-2" id="exportData"><i class="fa-solid fa-download"></i> Export My Data</button>
          </div>
        </div>
      </div>
    </div>`;

  return {
    html: portalShell('doctor', '#/doctor/profile', 'My Profile', content),
    init() {
      portalInit('doctor');
      const f = $('#docProfileForm');
      if (f) f.onsubmit = e => {
        e.preventDefault();
        let ok = true;
        if (!f.name.value.trim()) { f.name.closest('.field').classList.add('error'); ok = false; }
        if (!ok) { toast('Please fix highlighted fields.', 'error'); return; }
        const updated = {
          ...getDocProfile(),
          name: f.name.value.trim(), specialty: f.specialty.value.trim(),
          qual: f.qual.value.trim(), exp: parseInt(f.exp.value) || 0,
          email: f.email.value.trim(), phone: f.phone.value.trim(),
          fee: parseInt(f.fee.value) || 0, medicalId: f.medicalId.value.trim(),
          bio: f.bio.value.trim(), lang: f.lang.value.split(',').map(s=>s.trim()).filter(Boolean)
        };
        DB.set('doctorProfile', updated);
        toast('Profile updated successfully!', 'success');
        navigate();
      };
      const cp = $('#docChangePw');
      if (cp) cp.onclick = openChangePassword;
      const ex = $('#exportData');
      if (ex) ex.onclick = () => toast('Data export would generate a PDF in production (demo).', 'info');
    }
  };
}

/* ---------- Admin Portal Handler ---------- */
function AdminDashboard() {
  const appts = DB.all('appointments');
  const msgs = DB.all('messages');
  const content = `
    <div class="stat-grid">
      ${statCard('fa-calendar-check','blue', appts.length, 'Total Bookings')}
      ${statCard('fa-user-doctor','teal', DATA.doctors.length, 'Active Doctors')}
      ${statCard('fa-hospital','navy', DATA.departments.length, 'Departments')}
      ${statCard('fa-envelope','warn', msgs.length, 'Inquiries')}
    </div>
    <div class="panel">
      <div class="panel-head">
        <div><h2>Clinic Overview</h2><p>Recent appointments across all departments</p></div>
      </div>
      <div class="panel-body pad-0">
        <div class="table-wrap" style="border:0;border-radius:0">
          <table class="data">
            <thead><tr><th>Booking ID</th><th>Patient</th><th>Doctor</th><th>Date &amp; Time</th><th>Status</th></tr></thead>
            <tbody>${appts.map(a => {
              const d = DATA.doctors.find(x => x.id === a.doctorId);
              return `
              <tr>
                <td><b style="font-family:var(--head);font-size:.8rem">${esc(a.id)}</b></td>
                <td><b>${esc(a.patient)}</b></td>
                <td>${esc(d ? d.name : 'Specialist')}</td>
                <td>${esc(fmtDate(a.date))} · ${esc(a.time)}</td>
                <td>${statusBadge(a.status)}</td>
              </tr>`;
            }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  return { html: portalShell('admin', '#/admin/dashboard', 'Admin Overview', content), init: () => portalInit('admin') };
}

/* routes for doctor & admin portals */
route('/doctor', () => { location.hash = '#/doctor/dashboard'; });
route('/doctor/dashboard', DoctorDashboard);
route('/doctor/appointments', DoctorAppointments);
route('/doctor/patients', DoctorPatients);
route('/doctor/schedule', DoctorSchedule);
route('/doctor/prescription', DoctorPrescription);
route('/doctor/profile', DoctorProfile);

route('/admin', () => { location.hash = '#/admin/dashboard'; });
route('/admin/dashboard', AdminDashboard);
route('/admin/appointments', AdminDashboard);
route('/admin/doctors', AdminDashboard);
route('/admin/patients', AdminDashboard);
route('/admin/departments', AdminDashboard);
route('/admin/services', AdminDashboard);
route('/admin/blog', AdminDashboard);
route('/admin/reviews', AdminDashboard);
route('/admin/messages', AdminDashboard);
route('/admin/settings', AdminDashboard);


/* ===== Doctor login styles (auto-injected, alada CSS file lagbe na) ===== */
(function(){const s=document.createElement('style');s.id='doctor-auth-css';s.textContent=`/* MEDICARE PLUS — Doctor sign-in (doctor-auth.css) */
.da{--da-ink:#0d2b30;--da-ink-2:#143a40;--da-sig:#2fd1b3;--da-paper:#f5f8f7;--da-card:#fff;--da-text:#12262a;--da-mute:#5d7378;--da-line:#d9e3e1;--da-bad:#c8372d;--da-badbg:#fdecea;
  display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);min-height:100vh;background:var(--da-paper);color:var(--da-text);font-family:'Inter',system-ui,sans-serif}
[data-theme="dark"] .da{--da-paper:#0a1517;--da-card:#102225;--da-text:#e6f0ee;--da-mute:#92a9ad;--da-line:#23393d;--da-badbg:#3a1815}
.da *{box-sizing:border-box}
.da-side{position:relative;overflow:hidden;background:radial-gradient(120% 90% at 0% 0%,var(--da-ink-2),var(--da-ink));color:#e9f6f3;padding:48px 56px;display:flex;flex-direction:column;justify-content:space-between}
.da-brand{display:flex;align-items:center;gap:12px;font-family:'Plus Jakarta Sans',sans-serif}
.da-brand i{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--da-sig);color:var(--da-ink);font-size:18px}
.da-brand b{display:block;font-size:1rem;letter-spacing:.02em}.da-brand small{opacity:.7;font-size:.78rem}
.da-ecg{position:absolute;left:0;right:0;top:38%;width:100%;height:180px;opacity:.9;pointer-events:none}
.da-ecg path{fill:none;stroke:var(--da-sig);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1400;stroke-dashoffset:1400;animation:da-trace 3.2s ease-out .3s forwards}
.da-ecg path.ghost{stroke:rgba(47,209,179,.18);stroke-dasharray:none;animation:none}
@keyframes da-trace{to{stroke-dashoffset:0}}
.da-pitch{position:relative;max-width:460px}
.da-pitch h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:2.3rem;line-height:1.15;margin:0 0 14px;font-weight:700}
.da-pitch p{margin:0;opacity:.78;line-height:1.65;max-width:42ch}
.da-facts{display:flex;gap:28px;margin-top:30px;font-size:.88rem}
.da-facts span{display:flex;align-items:center;gap:8px;opacity:.85}.da-facts i{color:var(--da-sig)}
.da-main{display:grid;place-items:center;padding:40px 24px}
.da-card{width:min(440px,100%)}
.da-card h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.9rem;margin:0 0 6px;color:var(--da-text)}
.da-card .lead{margin:0 0 26px;color:var(--da-mute);line-height:1.55}
.da-field{margin-bottom:16px}
.da-field label{display:flex;justify-content:space-between;font-size:.85rem;font-weight:600;margin-bottom:7px}
.da-input{position:relative}
.da-input>i.lead-i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--da-mute);font-size:.9rem}
.da-input input{width:100%;height:50px;padding:0 46px 0 40px;border:1.5px solid var(--da-line);border-radius:12px;background:var(--da-card);color:var(--da-text);font:inherit;transition:border-color .15s,box-shadow .15s}
.da-input input:focus{outline:none;border-color:var(--da-sig);box-shadow:0 0 0 4px rgba(47,209,179,.2)}
.da-field.bad input{border-color:var(--da-bad)}
.da-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:38px;height:38px;border:0;background:none;color:var(--da-mute);cursor:pointer;border-radius:8px}
.da-eye:hover{color:var(--da-text)}
.da-hint{display:none;margin-top:6px;font-size:.8rem;color:var(--da-bad)}
.da-field.bad .da-hint,.da-hint.show{display:block}
.da-hint.warn{color:#9a6b00}
.da-alert{display:none;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:var(--da-badbg);color:var(--da-bad);font-size:.88rem;margin-bottom:16px;line-height:1.45}
.da-alert.show{display:flex}
.da-row{display:flex;justify-content:space-between;align-items:center;margin:2px 0 20px;font-size:.88rem}
.da-row label{display:flex;gap:8px;align-items:center;cursor:pointer}
.da-row a,.da-link{color:#0b8f78;font-weight:600;background:none;border:0;padding:0;cursor:pointer;font:inherit;font-weight:600}
.da-btn{width:100%;height:52px;border:0;border-radius:12px;background:var(--da-ink);color:#fff;font:600 1rem 'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .15s,transform .1s}
[data-theme="dark"] .da-btn{background:var(--da-sig);color:var(--da-ink)}
.da-btn:hover{background:var(--da-ink-2)}.da-btn:active{transform:translateY(1px)}
.da-btn[disabled]{opacity:.65;cursor:not-allowed}
.da-spin{width:16px;height:16px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:da-rot .7s linear infinite}
@keyframes da-rot{to{transform:rotate(360deg)}}
.da-demo{margin-top:26px;padding:14px;border:1.5px dashed var(--da-line);border-radius:14px}
.da-demo p{margin:0 0 10px;font-size:.82rem;color:var(--da-mute)}
.da-chips{display:flex;flex-wrap:wrap;gap:8px}
.da-chip{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border:1px solid var(--da-line);border-radius:99px;background:var(--da-card);color:var(--da-text);font:.82rem 'Inter',sans-serif;cursor:pointer}
.da-chip:hover{border-color:var(--da-sig)}.da-chip img{width:24px;height:24px;border-radius:50%;object-fit:cover}
.da-foot{display:flex;justify-content:space-between;margin-top:22px;font-size:.85rem;color:var(--da-mute)}
.da-foot a{color:inherit}.da-foot a:hover{color:var(--da-text)}
.da-shake{animation:da-shake .4s}
@keyframes da-shake{20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
.da :focus-visible{outline:3px solid var(--da-sig);outline-offset:2px}
@media (max-width:900px){.da{grid-template-columns:1fr}.da-side{padding:28px 24px 34px;min-height:0}.da-ecg{display:none}.da-pitch h2{font-size:1.6rem}.da-facts{display:none}.da-pitch p{display:none}.da-side{gap:0}}
@media (prefers-reduced-motion:reduce){.da-ecg path{animation:none;stroke-dashoffset:0}.da-shake,.da-spin{animation:none}}
`;document.head.appendChild(s);})();

/* ============================================================
   MEDICARE PLUS — doctor-auth.js
   Doctor sign-in page + working session guard (frontend demo).
   Load AFTER dashboard.js.
   ============================================================ */
const DOC_PASSWORD = 'doctor123';
const DOC_SESSION_MS = 8 * 60 * 60 * 1000;   // 8 ghonta por session expire
const DOC_MAX_TRIES = 5, DOC_LOCK_MS = 30 * 1000;

const docSlug = n => String(n).replace(/^Dr\.?\s*/i, '').toLowerCase().trim().split(/\s+/).join('.');

function doctorAccounts() {
  const list = DATA.doctors.map((d, i) => ({
    doctor: d, email: `${docSlug(d.name)}@medicareplus.demo`, password: DOC_PASSWORD, n: i + 1
  }));
  // purono demo account-o kaj korbe (Dr. Ayesha Rahman)
  list.push({ doctor: DATA.doctors[0], email: 'doctor@demo.com', password: 'demo1234', n: 1 });
  return list;
}

function buildDocProfile(acc) {
  const d = acc.doctor;
  return { id: d.id, name: d.name, specialty: d.specialty, dept: d.dept, qual: d.qual, exp: d.exp, fee: d.fee,
    rating: d.rating, reviews: d.reviews, days: d.days, lang: d.lang, gender: d.gender, bio: d.bio, img: d.img,
    email: acc.email, phone: '+1 555 010 2400', medicalId: 'MC-DR-2024-' + String(acc.n).padStart(3, '0'),
    consultHours: '09:00 AM - 05:30 PM' };
}

function doctorSessionValid() {
  const s = DB.get('session', null);
  return !!(s && s.role === 'doctor' && s.at && Date.now() - s.at < DOC_SESSION_MS);
}

/* ---- Guard: dashboard.js-er guard-ke replace kora hoyeche ---- */
doctorAuthGuard = function () {
  if (doctorSessionValid()) return true;
  if (DB.get('session', null)?.role === 'doctor') { localStorage.removeItem('mp_session'); toast('Your session expired. Please sign in again.', 'warn', 'Session expired'); }
  else toast('Please sign in to open the Doctor Portal.', 'warn', 'Sign in required');
  setTimeout(() => { location.hash = '#/doctor-login'; }, 50);
  return false;
};

/* ---- Login page ---- */
function DoctorLoginPage() {
  if (doctorSessionValid()) { setTimeout(() => { location.hash = '#/doctor/dashboard'; }, 0); return { html: '', init() {} }; }
  const remembered = DB.get('doctorRemember', '');
  const demos = DATA.doctors.slice(0, 3);

  const html = `
  <div class="da">
    <aside class="da-side">
      <div class="da-brand"><i class="fa-solid fa-heart-pulse"></i><span><b>MEDICARE PLUS</b><small>Doctor Portal</small></span></div>
      <svg class="da-ecg" viewBox="0 0 800 180" preserveAspectRatio="none" aria-hidden="true">
        <path class="ghost" d="M0 90H220l20-6 18 6h60l16-14 12 14 14 0 14 56 18-124 16 68h42l20-8 20 8h330"/>
        <path d="M0 90H220l20-6 18 6h60l16-14 12 14 14 0 14 56 18-124 16 68h42l20-8 20 8h330"/>
      </svg>
      <div class="da-pitch">
        <h2>Today's patients are already waiting for you.</h2>
        <p>Open your schedule, review notes and write prescriptions from one secure place.</p>
        <div class="da-facts"><span><i class="fa-solid fa-lock"></i> Private sign-in</span><span><i class="fa-solid fa-clock"></i> 8-hour session</span></div>
      </div>
    </aside>
    <section class="da-main">
      <div class="da-card">
        <h1>Doctor sign in</h1>
        <p class="lead">Use your MEDICARE PLUS work email to open your portal.</p>
        <div class="da-alert" id="daAlert" role="alert"><i class="fa-solid fa-circle-exclamation"></i><span id="daAlertTxt"></span></div>
        <form id="daForm" novalidate>
          <div class="da-field" id="fEmail">
            <label for="daEmail">Work email</label>
            <div class="da-input"><i class="fa-regular fa-envelope lead-i"></i>
              <input id="daEmail" name="email" type="email" autocomplete="username" placeholder="name@medicareplus.demo" value="${esc(remembered)}"></div>
            <span class="da-hint">Enter a valid email address.</span>
          </div>
          <div class="da-field" id="fPass">
            <label for="daPass">Password</label>
            <div class="da-input"><i class="fa-solid fa-lock lead-i"></i>
              <input id="daPass" name="password" type="password" autocomplete="current-password" placeholder="Your password">
              <button type="button" class="da-eye" id="daEye" aria-label="Show password"><i class="fa-regular fa-eye"></i></button></div>
            <span class="da-hint">Enter your password.</span>
            <span class="da-hint warn" id="daCaps"><i class="fa-solid fa-triangle-exclamation"></i> Caps Lock is on.</span>
          </div>
          <div class="da-row">
            <label><input type="checkbox" id="daRemember" ${remembered ? 'checked' : ''}> Remember my email</label>
            <button type="button" class="da-link" id="daForgot">Forgot password?</button>
          </div>
          <button class="da-btn" id="daSubmit" type="submit"><span>Sign in</span></button>
        </form>
        <div class="da-demo">
          <p>Demo accounts — tap one to fill the form. Password: <b>${DOC_PASSWORD}</b></p>
          <div class="da-chips">
            ${demos.map(d => `<button type="button" class="da-chip" data-fill="${docSlug(d.name)}@medicareplus.demo"><img src="${d.img}" alt="">${esc(d.name)}</button>`).join('')}
          </div>
        </div>
        <div class="da-foot"><a href="#/">← Back to website</a><a href="#/login">Patient or admin? Sign in here</a></div>
      </div>
    </section>
  </div>`;

  return { html, init() {
    // login form site chrome-er bhitor render hoy; full-screen korte portal mount-e niye jacchi
    const view = $('#view'), portal = $('#portal');
    portal.innerHTML = view.innerHTML; view.innerHTML = '';
    $('#chrome').style.display = 'none';
    const root = $('.da', portal);
    const q = s => $(s, root);
    const f = q('#daForm'), alertBox = q('#daAlert'), alertTxt = q('#daAlertTxt'), btn = q('#daSubmit');
    let lockTimer = null;

    const showAlert = m => { alertTxt.textContent = m; alertBox.classList.add('show'); };
    const hideAlert = () => alertBox.classList.remove('show');
    const setBusy = (b, label) => { btn.disabled = b; btn.innerHTML = b ? `<span class="da-spin"></span><span>${label || 'Signing in…'}</span>` : '<span>Sign in</span>'; };

    const lockLeft = () => Math.max(0, (DB.get('docLock', 0) || 0) - Date.now());
    const tickLock = () => {
      clearInterval(lockTimer);
      if (!lockLeft()) { setBusy(false); hideAlert(); return; }
      const upd = () => { const s = Math.ceil(lockLeft() / 1000); if (!s) { clearInterval(lockTimer); setBusy(false); hideAlert(); return; }
        showAlert(`Too many failed attempts. Try again in ${s}s.`); btn.disabled = true; btn.innerHTML = '<span>Locked</span>'; };
      upd(); lockTimer = setInterval(upd, 500);
    };
    tickLock();

    q('#daEye').onclick = () => {
      const p = q('#daPass'), show = p.type === 'password';
      p.type = show ? 'text' : 'password';
      q('#daEye').innerHTML = `<i class="fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
      q('#daEye').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    };
    q('#daPass').addEventListener('keyup', e => q('#daCaps').classList.toggle('show', e.getModifierState && e.getModifierState('CapsLock')));
    $$('[data-fill]', root).forEach(c => c.onclick = () => {
      q('#daEmail').value = c.dataset.fill; q('#daPass').value = DOC_PASSWORD; hideAlert();
      $$('.da-field', root).forEach(x => x.classList.remove('bad')); q('#daPass').focus();
    });
    q('#daForgot').onclick = () => openModal({
      title: 'Reset your password',
      body: `<p class="text-muted">Enter your work email. In a live system we would send a reset link; this demo only shows a confirmation.</p>
             <div class="field" style="margin-top:14px"><label>Work email</label><input id="rstEmail" type="email" placeholder="name@medicareplus.demo"></div>`,
      footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-primary" id="rstGo">Send reset link</button>`,
      onMount(r, close) {
        r.querySelector('[data-c]').onclick = close;
        r.querySelector('#rstGo').onclick = () => {
          const v = r.querySelector('#rstEmail').value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast('Enter a valid email address.', 'error'); return; }
          close(); toast('If that email has an account, a reset link is on its way (demo).', 'info', 'Check your inbox');
        };
      }
    });

    f.addEventListener('submit', e => {
      e.preventDefault(); hideAlert();
      if (lockLeft()) { tickLock(); return; }
      const email = f.email.value.trim().toLowerCase(), pass = f.password.value;
      const eBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), pBad = !pass;
      q('#fEmail').classList.toggle('bad', eBad); q('#fPass').classList.toggle('bad', pBad);
      if (eBad || pBad) { (eBad ? f.email : f.password).focus(); return; }

      setBusy(true);
      setTimeout(async () => {
        const cand = doctorAccounts().find(a => a.email === email);
        const acc = (cand && await docPasswordOk(cand, pass)) ? cand : null;
        if (!acc) {
          const tries = (DB.get('docTries', 0) || 0) + 1;
          DB.set('docTries', tries);
          if (tries >= DOC_MAX_TRIES) { DB.set('docLock', Date.now() + DOC_LOCK_MS); DB.set('docTries', 0); tickLock(); }
          else { setBusy(false); showAlert(`Email or password is incorrect. ${DOC_MAX_TRIES - tries} attempt${DOC_MAX_TRIES - tries === 1 ? '' : 's'} left.`); }
          const card = q('.da-card'); card.classList.remove('da-shake'); void card.offsetWidth; card.classList.add('da-shake');
          f.password.value = ''; f.password.focus();
          return;
        }
        DB.set('docTries', 0);
        const saved = DB.get('doctorProfile', null);
        if (!saved || saved.id !== acc.doctor.id) DB.set('doctorProfile', buildDocProfile(acc));
        DB.set('session', { email: acc.email, role: 'doctor', doctorId: acc.doctor.id, at: Date.now() });
        if (q('#daRemember').checked) DB.set('doctorRemember', acc.email); else localStorage.removeItem('mp_doctorRemember');
        toast(`Welcome back, ${acc.doctor.name}.`, 'success', 'Signed in');
        btn.innerHTML = '<i class="fa-solid fa-check"></i><span>Signed in</span>';
        root.classList.add('da-leave');
        setTimeout(() => { location.hash = '#/doctor/dashboard'; }, 320);
      }, 650);
    });
    q('#daEmail').focus();
  } };
}
route('/doctor-login', DoctorLoginPage);

/* Purono /login page-er "Doctor" tab chaple notun doctor login-e niye jabe */
document.addEventListener('click', e => {
  const t = e.target.closest('#roleTabs [data-role="doctor"]');
  if (t) { e.preventDefault(); e.stopImmediatePropagation(); location.hash = '#/doctor-login'; }
}, true);

/* Doctor logout korle doctor login page-e feredibe */
document.addEventListener('click', e => {
  if (e.target.closest('#doLogout') && location.hash.startsWith('#/doctor/')) setTimeout(() => { location.hash = '#/doctor-login'; }, 0);
}, true);


/* ===== Password storage helpers ===== */
const DOC_PW_KEY = 'docPasswords';
async function pwHash(email, pw) {
  const data = email.toLowerCase() + '|' + pw;
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    return 'sha:' + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381; for (const c of data) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return 'djb:' + h.toString(16);
}
async function docPasswordOk(acc, pw) {
  const stored = DB.get(DOC_PW_KEY, {})[acc.email];
  if (!stored) return pw === acc.password;           // ekhono bodlano hoy ni -> default password
  return stored === await pwHash(acc.email, pw);
}
function pwStrength(p) {
  let n = 0;
  if (p.length >= 8) n++;
  if (p.length >= 12) n++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) n++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) n++;
  return p ? Math.max(1, n) : 0;
}

(function(){const s=document.createElement('style');s.id='doctor-pw-css';s.textContent=`
.pw-wrap{position:relative}.pw-wrap input{width:100%;padding-right:44px}
.pw-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;background:none;color:#6b8085;cursor:pointer;border-radius:8px}
.pw-meter{display:flex;gap:4px;margin:8px 0 4px}.pw-meter i{flex:1;height:5px;border-radius:3px;background:#d9e3e1;transition:background .2s}
.pw-meter[data-s="1"] i:nth-child(-n+1){background:#d6453a}.pw-meter[data-s="2"] i:nth-child(-n+2){background:#e59a1f}
.pw-meter[data-s="3"] i:nth-child(-n+3){background:#7bb83d}.pw-meter[data-s="4"] i{background:#1f9d7f}
.pw-meter-txt{font-size:.8rem;color:#6b8085}
.pw-rules{list-style:none;margin:10px 0 4px;padding:0;font-size:.84rem;color:#6b8085}
.pw-rules li{display:flex;gap:8px;align-items:center;padding:2px 0}.pw-rules li i{font-size:.72rem}
.pw-rules li.ok{color:#1f9d7f}
`;document.head.appendChild(s);})();


/* ===== Change password (Doctor Profile) ===== */
function openChangePassword() {
  const sess = DB.get('session', null);
  if (!sess || sess.role !== 'doctor') return;
  const acc = doctorAccounts().find(a => a.email === sess.email);
  if (!acc) return;
  const lockLeft = () => Math.max(0, (DB.get('pwLock', 0) || 0) - Date.now());
  if (lockLeft()) { toast(`Too many wrong attempts. Try again in ${Math.ceil(lockLeft() / 1000)}s.`, 'error', 'Locked'); return; }

  const pwField = (name, label, auto) => `
    <div class="field"><label>${label}</label>
      <div class="pw-wrap"><input name="${name}" type="password" autocomplete="${auto}">
        <button type="button" class="pw-eye" data-eye aria-label="Show password"><i class="fa-regular fa-eye"></i></button></div>
      <span class="err-msg"></span></div>`;

  let wrong = 0;
  openModal({
    title: 'Change password',
    body: `<form id="pwForm" novalidate>
      ${pwField('cur', 'Current password', 'current-password')}
      ${pwField('nw', 'New password', 'new-password')}
      <div class="pw-meter" id="pwMeter" data-s="0"><i></i><i></i><i></i><i></i></div>
      <span class="pw-meter-txt" id="pwMeterTxt">Enter a new password.</span>
      <ul class="pw-rules" id="pwRules">
        <li data-r="len"><i class="fa-regular fa-circle"></i> At least 8 characters</li>
        <li data-r="mix"><i class="fa-regular fa-circle"></i> Contains a letter and a number</li>
        <li data-r="diff"><i class="fa-regular fa-circle"></i> Different from your current password</li>
      </ul>
      ${pwField('cf', 'Confirm new password', 'new-password')}
    </form>`,
    footer: `<button class="btn btn-outline" data-c>Cancel</button><button class="btn btn-primary" id="pwSave"><i class="fa-solid fa-lock"></i> Update password</button>`,
    onMount(root, close) {
      const f = root.querySelector('#pwForm');
      const setErr = (n, msg) => { const fl = f[n].closest('.field'); fl.classList.toggle('error', !!msg); fl.querySelector('.err-msg').textContent = msg || ''; return !msg; };
      root.querySelector('[data-c]').onclick = close;
      root.querySelectorAll('[data-eye]').forEach(b => b.onclick = () => {
        const inp = b.parentElement.querySelector('input'), show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        b.innerHTML = `<i class="fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
        b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
      const rules = p => ({ len: p.length >= 8, mix: /[A-Za-z]/.test(p) && /\d/.test(p), diff: !!p && p !== f.cur.value });
      const refresh = () => {
        const p = f.nw.value, r = rules(p), sc = pwStrength(p);
        root.querySelectorAll('#pwRules li').forEach(li => {
          const ok = r[li.dataset.r]; li.classList.toggle('ok', ok);
          li.querySelector('i').className = ok ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
        });
        root.querySelector('#pwMeter').dataset.s = sc;
        root.querySelector('#pwMeterTxt').textContent = ['Enter a new password.', 'Weak', 'Fair', 'Good', 'Strong'][sc];
      };
      f.nw.addEventListener('input', refresh); f.cur.addEventListener('input', refresh);

      const save = async () => {
        const cur = f.cur.value, nw = f.nw.value, cf = f.cf.value, r = rules(nw);
        let ok = true;
        ok = setErr('cur', cur ? '' : 'Enter your current password.') && ok;
        ok = setErr('nw', !nw ? 'Enter a new password.' : !r.len ? 'Use at least 8 characters.' : !r.mix ? 'Include a letter and a number.' : !r.diff ? 'Choose a password you have not used just now.' : '') && ok;
        ok = setErr('cf', cf !== nw ? 'Passwords do not match.' : '') && ok;
        if (!ok) return;
        const btn = root.querySelector('#pwSave'); btn.disabled = true;
        if (!(await docPasswordOk(acc, cur))) {
          btn.disabled = false; wrong++;
          if (wrong >= 5) { DB.set('pwLock', Date.now() + 30000); close(); toast('Too many wrong attempts. Try again in 30s.', 'error', 'Locked'); return; }
          setErr('cur', `Current password is incorrect. ${5 - wrong} attempt${5 - wrong === 1 ? '' : 's'} left.`); f.cur.focus(); return;
        }
        const all = DB.get(DOC_PW_KEY, {}); all[acc.email] = await pwHash(acc.email, nw); DB.set(DOC_PW_KEY, all);
        DB.set('session', { ...sess, at: Date.now() });
        close(); toast('Use your new password next time you sign in.', 'success', 'Password updated');
      };
      root.querySelector('#pwSave').onclick = save;
      f.addEventListener('submit', e => { e.preventDefault(); save(); });
      f.cur.focus();
    }
  });
}


/* ===== Prescription: print / save as PDF ===== */
function rxDoctor(rx) {
  const me = getDocProfile();
  if (rx.doctorId === me.id) return me;
  const d = DATA.doctors.find(x => x.id === rx.doctorId) || {};
  return { name: d.name || 'Doctor', specialty: d.specialty || '', qual: d.qual || '', medicalId: '', phone: '' };
}
function rxPatient(rx) {
  return DEMO_PATIENTS.find(p => p.email && p.email === rx.email) || DEMO_PATIENTS.find(p => p.name === rx.patient) || null;
}

/* Alada, self-contained printable page (site CSS lagbe na) */
function rxDocument(rx) {
  const d = rxDoctor(rx), p = rxPatient(rx);
  const meds = (rx.meds || []).map((m, i) => `
    <tr><td class="n">${i + 1}</td><td><b>${esc(m.name)}</b></td><td>${esc(m.dose)}</td><td>${esc(m.freq)}</td><td>${esc(m.dur)}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Prescription ${esc(rx.id)} — ${esc(rx.patient)}</title>
<style>
@page{size:A4;margin:16mm}
*{box-sizing:border-box}
body{margin:0;font:13px/1.5 'Inter','Segoe UI',Arial,sans-serif;color:#13282c}
.sheet{position:relative;max-width:760px;margin:0 auto}
.head{display:flex;justify-content:space-between;gap:24px;padding-bottom:14px;border-bottom:3px solid #0d2b30}
.brand b{display:block;font-size:20px;letter-spacing:.03em;color:#0d2b30}.brand span{color:#5d7378;font-size:12px}
.doc{text-align:right}.doc b{font-size:15px}.doc span{display:block;color:#5d7378;font-size:12px}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin:16px 0;padding:12px 14px;background:#f2f6f5;border-radius:8px}
.meta div span{color:#5d7378;display:inline-block;min-width:96px}
h2{font-size:12px;margin:20px 0 8px;color:#0d2b30;text-transform:none;letter-spacing:.02em}
.rx{font-size:30px;font-weight:700;color:#0b8f78;line-height:1;margin-right:8px}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:11.5px;color:#5d7378;font-weight:600;padding:7px 8px;border-bottom:1.5px solid #d9e3e1}
td{padding:9px 8px;border-bottom:1px solid #e6eeec;vertical-align:top}td.n{width:28px;color:#5d7378}
.advice{padding:10px 14px;border-left:3px solid #2fd1b3;background:#f7fbfa;white-space:pre-wrap}
.sign{display:flex;justify-content:flex-end;margin-top:54px}
.sign div{width:220px;text-align:center;border-top:1px solid #13282c;padding-top:6px}
.foot{margin-top:34px;padding-top:10px;border-top:1px solid #d9e3e1;color:#5d7378;font-size:11px;display:flex;justify-content:space-between;gap:16px}
.draft{position:absolute;top:240px;left:50%;transform:translateX(-50%) rotate(-24deg);font-size:84px;font-weight:800;color:rgba(200,55,45,.12);pointer-events:none;letter-spacing:.08em}
tr,.advice{break-inside:avoid}
</style></head><body><div class="sheet">
${rx.draft ? '<div class="draft">DRAFT</div>' : ''}
<div class="head">
  <div class="brand"><b>MEDICARE PLUS</b><span>128 Wellness Boulevard, Springfield<br>+1 (555) 010-2400 · care@medicareplus.demo</span></div>
  <div class="doc"><b>${esc(d.name)}</b><span>${esc(d.specialty)}</span><span>${esc(d.qual)}</span>${d.medicalId ? `<span>Reg. ${esc(d.medicalId)}</span>` : ''}</div>
</div>
<div class="meta">
  <div><span>Patient</span><b>${esc(rx.patient)}</b></div>
  <div><span>Prescription</span><b>${esc(rx.id)}</b></div>
  <div><span>Age / Gender</span>${p ? esc(p.age + ' / ' + p.gender) : '—'}</div>
  <div><span>Date</span>${esc(fmtDate(rx.date))}</div>
  <div><span>Blood group</span>${p ? esc(p.blood) : '—'}</div>
  <div><span>Diagnosis</span>${esc(rx.diagnosis)}</div>
</div>
<h2><span class="rx">℞</span>Medications</h2>
<table><thead><tr><th></th><th>Medicine</th><th>Dose</th><th>How often</th><th>For how long</th></tr></thead><tbody>${meds}</tbody></table>
${rx.advice ? `<h2>Advice</h2><div class="advice">${esc(rx.advice)}</div>` : ''}
<div class="sign"><div><b>${esc(d.name)}</b><br><span style="color:#5d7378;font-size:11px">Signature</span></div></div>
<div class="foot"><span>Digital prescription issued through MEDICARE PLUS. Demo document — not for real medical use.</span><span>${esc(rx.id)}</span></div>
</div></body></html>`;
}

/* Browser-er print dialog khole — seikhan theke "Save as PDF" select korle PDF hoy */
function printRx(rx) {
  const old = document.getElementById('rxPrintFrame'); if (old) old.remove();
  const fr = document.createElement('iframe');
  fr.id = 'rxPrintFrame'; fr.setAttribute('aria-hidden', 'true'); fr.title = 'Prescription print';
  fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  fr.onload = () => {
    try { fr.contentWindow.focus(); fr.contentWindow.print(); }
    catch (e) { toast('Printing is not available in this browser.', 'error'); }
  };
  fr.srcdoc = rxDocument(rx);
  document.body.appendChild(fr);
}

function openRxModal(rx) {
  const d = rxDoctor(rx);
  openModal({
    title: 'Prescription ' + rx.id, wide: true,
    body: `<div class="rx-paper">
      <div class="rx-preview-header">
        <div><b style="font-size:1.1rem">MEDICARE PLUS</b><p class="small text-muted">128 Wellness Boulevard, Springfield</p></div>
        <div style="text-align:right"><b>${esc(d.name)}</b><p class="small text-muted">${esc(d.specialty)}<br>${esc(d.qual)}</p></div>
      </div>
      <hr style="margin:14px 0">
      <div class="flex between"><span><b>Patient:</b> ${esc(rx.patient)}</span><span><b>Date:</b> ${esc(fmtDate(rx.date))}</span></div>
      <p class="mt-2"><b>Diagnosis:</b> ${esc(rx.diagnosis)}</p>
      <div class="mt-3"><b>℞ Medications</b></div>
      ${(rx.meds || []).map(m => `<div class="rx-row"><div><b>${esc(m.name)}</b><p class="small text-muted">${esc(m.dose)} · ${esc(m.freq)}</p></div><span class="small text-muted">${esc(m.dur)}</span></div>`).join('')}
      ${rx.advice ? `<p class="mt-3"><b>Advice:</b> ${esc(rx.advice)}</p>` : ''}
    </div>`,
    footer: `<button class="btn btn-outline" data-c>Close</button><button class="btn btn-primary" id="rxPrintNow"><i class="fa-solid fa-print"></i> Print / Save as PDF</button>`,
    onMount(root, close) {
      root.querySelector('[data-c]').onclick = close;
      root.querySelector('#rxPrintNow').onclick = () => printRx(rx);
    }
  });
}


/* ===== Doctor portal motion ===== */
(function(){const st=document.createElement('style');st.id='doctor-motion-css';st.textContent=`
@media (prefers-reduced-motion:no-preference){
  @keyframes mpUp{from{opacity:0;transform:translateY(14px)}}
  @keyframes mpFade{from{opacity:0}}
  @keyframes mpPop{from{opacity:0;transform:translateY(10px) scale(.97)}}
  @keyframes mpWave{0%,60%,100%{transform:rotate(0)}10%{transform:rotate(14deg)}20%{transform:rotate(-8deg)}30%{transform:rotate(14deg)}40%{transform:rotate(-4deg)}50%{transform:rotate(10deg)}}
  @keyframes mpPulse{0%{box-shadow:0 0 0 0 rgba(31,157,127,.5)}100%{box-shadow:0 0 0 9px rgba(31,157,127,0)}}
  .mp-in{animation:mpUp .45s cubic-bezier(.2,.7,.2,1) backwards;animation-delay:calc(var(--mp-i,0) * 55ms)}
  .mp-wave{display:inline-block;transform-origin:70% 70%;animation:mpWave 1.6s .9s 1}
  .live-dot{animation:mpPulse 1.6s ease-out infinite}
  .queue-item.mp-out{opacity:0;transform:translateX(28px);transition:opacity .3s ease,transform .3s ease}
  .modal-backdrop{animation:mpFade .18s ease-out}
  .modal{animation:mpPop .24s cubic-bezier(.2,.8,.2,1)}
  .portal .btn:active{transform:scale(.97)}
  .da-card{animation:mpUp .5s .1s backwards}
  .da{transition:opacity .3s ease,transform .3s ease}
  .da.da-leave{opacity:0;transform:scale(.985)}
}`;document.head.appendChild(st);})();

function doctorMotion() {
  const content = $('.p-content');
  if (!content || content.dataset.mp) return;          // ekbar-i cholbe (theme toggle e abar cholbe na)
  content.dataset.mp = '1';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1) ek-ek kore sajano entry (shudhu content, sidebar/topbar na)
  $$('.doc-welcome-banner, .stat-card, .panel', content).slice(0, 12).forEach((el, i) => {
    el.style.setProperty('--mp-i', i); el.classList.add('mp-in');
  });

  // 2) stat-er songkhya 0 theke barbe
  $$('.sc-val', content).forEach((el, i) => {
    const m = el.textContent.trim().match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].includes(',');
    const fmt = n => comma ? n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n.toFixed(dec);
    el.textContent = m[1] + fmt(0) + m[3];
    const t0 = performance.now() + 150 + i * 55, dur = 900;
    const tick = now => {
      const p = Math.min(Math.max((now - t0) / dur, 0), 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = m[1] + fmt(end * e) + m[3];
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // 3) revenue bar / progress bar nicher theke bere ashbe
  const grow = (el, prop, i) => {
    const target = el.style[prop]; if (!target) return;
    el.style[prop] = '0%';
    el.style.transition = `${prop} .7s cubic-bezier(.2,.8,.2,1) ${250 + i * 70}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style[prop] = target; }));
  };
  $$('.rev-bar', content).forEach((el, i) => grow(el, 'height', i));
  $$('.bar-fill', content).forEach((el, i) => grow(el, 'width', i));

  // 4) hat nariye "👋" ekbar
  const h = $('.doc-welcome-banner h2', content);
  if (h && h.innerHTML.includes('👋')) h.innerHTML = h.innerHTML.replace('👋', '<span class="mp-wave">👋</span>');

  // 5) "Call Next Patient": prothom jon dane soriye jabe, tarpor list update hobe
  const call = $('#callNextPatient', content);
  if (call) {
    let busy = false;
    call.addEventListener('click', e => {
      const first = $('.queue-item', content);
      if (busy || !first) return;
      e.stopImmediatePropagation(); busy = true;
      first.classList.add('mp-out');
      setTimeout(() => { busy = false; call.onclick && call.onclick(); }, 320);
    }, true);
  }
}

/* portalInit-er por doctor portal-e motion chalu */
(function () {
  const base = portalInit;
  portalInit = function (kind) { base(kind); if (kind === 'doctor') doctorMotion(); };
})();