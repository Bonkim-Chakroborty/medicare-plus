/* ============================================================
   MEDICARE PLUS — appointment.js
   7-step booking wizard. Demo only — saved to LocalStorage.
   ============================================================ */

const WIZ = {
  step: 1,
  dept: '', doctorId: '', date: '', time: '',
  name: '', phone: '', email: '', age: '', gender: '', problem: '',
  calMonth: new Date(),
  bookingId: null
};

const STEPS = [
  { n:1, label:'Department' },
  { n:2, label:'Doctor' },
  { n:3, label:'Date' },
  { n:4, label:'Time' },
  { n:5, label:'Details' },
  { n:6, label:'Review' },
  { n:7, label:'Confirmed' }
];

function AppointmentPage(params, query) {
  WIZ.step = 1; WIZ.dept = ''; WIZ.doctorId = query.doctor || '';
  WIZ.date = ''; WIZ.time = ''; WIZ.name = ''; WIZ.phone = '';
  WIZ.email = ''; WIZ.age = ''; WIZ.gender = ''; WIZ.problem = '';
  WIZ.calMonth = new Date();
  WIZ.bookingId = null;

  if (WIZ.doctorId) {
    const d = DATA.doctors.find(x => x.id === WIZ.doctorId);
    if (d) { WIZ.dept = d.dept; WIZ.step = 3; }
  }

  return {
    html: `
      ${PAGE_HEAD('Book an Appointment', 'Seven quick steps. No account required.', [{ label:'Appointment', href:'#/appointment' }])}
      <section class="section">
        <div class="container" style="max-width:980px">
          <div class="wizard-steps" id="wizSteps"></div>
          <div id="wizBody"></div>
        </div>
      </section>`,
    init() { renderWizard(); }
  };
}

function renderWizard() {
  const stepsEl = $('#wizSteps');
  if (!stepsEl) return;
  stepsEl.innerHTML = STEPS.map(s => {
    const cls = WIZ.step === s.n ? 'active' : WIZ.step > s.n ? 'done' : '';
    return `<div class="wstep ${cls}"><span class="n">${WIZ.step > s.n ? '<i class="fa-solid fa-check"></i>' : s.n}</span><span>${s.label}</span></div>`;
  }).join('');

  const body = $('#wizBody');
  switch (WIZ.step) {
    case 1: body.innerHTML = stepDept(); break;
    case 2: body.innerHTML = stepDoctor(); break;
    case 3: body.innerHTML = stepDate(); break;
    case 4: body.innerHTML = stepTime(); break;
    case 5: body.innerHTML = stepDetails(); break;
    case 6: body.innerHTML = stepReview(); break;
    case 7: body.innerHTML = stepDone(); break;
  }
  bindWizard();
}

/* ---------- STEP 1 ---------- */
function stepDept() {
  return `<div class="card card-pad">
    <h2 style="font-size:1.25rem">Select a department</h2>
    <p class="text-muted small mt-1" style="margin-bottom:22px">Choose the specialty most relevant to your concern.</p>
    <div class="option-grid">
      ${DATA.departments.map(d => `
        <button class="option ${WIZ.dept === d.id ? 'selected' : ''}" data-dept="${d.id}">
          <span class="o-icon">
            <!-- ⬇️⬇️ এখানে ডিপার্টমেন্টের ছবি যোগ করুন ⬇️⬇️ -->
            <i class="fa-solid ${d.icon}"></i>
            <!-- <img src="images/departments/${d.id}.jpg" alt="${esc(d.name)}"> -->
            <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
          </span>
          <b>${esc(d.name)}</b>
          <small>${esc(d.tagline)}</small>
        </button>`).join('')}
    </div>
    <div class="wizard-actions">
      <span></span>
      <button class="btn btn-primary" id="wizNext" ${!WIZ.dept ? 'disabled' : ''}>Continue <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>`;
}

/* ---------- STEP 2 ---------- */
function stepDoctor() {
  const docs = DATA.doctors.filter(d => d.dept === WIZ.dept);
  return `<div class="card card-pad">
    <h2 style="font-size:1.25rem">Choose your doctor</h2>
    <p class="text-muted small mt-1" style="margin-bottom:22px">${docs.length} specialist${docs.length === 1 ? '' : 's'} available in ${esc((DATA.departments.find(x => x.id === WIZ.dept) || {}).name || '')}.</p>
    <div class="stack" style="gap:12px">
      ${docs.map(d => `
        <button class="option ${WIZ.doctorId === d.id ? 'selected' : ''}" data-doc="${d.id}" style="flex-direction:row;align-items:center;gap:16px">
          <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
          ${d.img ? `<img src="${d.img}" alt="${esc(d.name)}" class="doc-avatar img-animated" style="width:52px;height:52px">` : avatar(d.name, 52)}
          <div style="flex:1;text-align:left">
            <b>${esc(d.name)}</b>
            <small style="display:block">${esc(d.specialty)} · ${d.exp} yrs · ${d.rating}★ (${d.reviews})</small>
            <small style="display:block;color:var(--blue);font-weight:700;margin-top:4px">${money(d.fee)} per visit</small>
          </div>
          <span class="badge badge-ok">Available</span>
        </button>`).join('')}
    </div>
    <div class="wizard-actions">
      <button class="btn btn-outline" data-back>Back</button>
      <button class="btn btn-primary" id="wizNext" ${!WIZ.doctorId ? 'disabled' : ''}>Continue <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>`;
}

/* ---------- STEP 3 ---------- */
function stepDate() {
  const base = WIZ.calMonth;
  const y = base.getFullYear(), m = base.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthLabel = base.toLocaleDateString('en-GB', { month:'long', year:'numeric' });
  const prevDisabled = new Date(y, m, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);

  let cells = '';
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d);
    const iso = `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const disabled = dt < today || dt.getDay() === 0;
    const cls = [WIZ.date === iso ? 'selected' : '', iso === todayISO() ? 'today' : ''].join(' ');
    cells += `<button class="cal-cell ${cls}" data-date="${iso}" ${disabled ? 'disabled' : ''}>${d}</button>`;
  }

  return `<div class="card card-pad">
    <h2 style="font-size:1.25rem">Pick a date</h2>
    <p class="text-muted small mt-1" style="margin-bottom:22px">Sundays are reserved for emergencies only.</p>
    <div class="calendar">
      <div class="cal-head">
        <b>${monthLabel}</b>
        <div class="cal-nav">
          <button id="calPrev" ${prevDisabled ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
          <button id="calNext"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="cal-days">${['S','M','T','W','T','F','S'].map(d => `<span>${d}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
    </div>
    ${WIZ.date ? `<p class="small mt-3" style="color:var(--blue);font-weight:700"><i class="fa-regular fa-calendar-check"></i> Selected: ${fmtDate(WIZ.date)}</p>` : ''}
    <div class="wizard-actions">
      <button class="btn btn-outline" data-back>Back</button>
      <button class="btn btn-primary" id="wizNext" ${!WIZ.date ? 'disabled' : ''}>Continue <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>`;
}

/* ---------- STEP 4 ---------- */
function stepTime() {
  const doc = DATA.doctors.find(d => d.id === WIZ.doctorId);
  const unavailable = [2, 7, 11];
  return `<div class="card card-pad">
    <h2 style="font-size:1.25rem">Choose a time slot</h2>
    <p class="text-muted small mt-1" style="margin-bottom:22px">Available slots for ${esc(fmtDate(WIZ.date))} with ${esc(doc ? doc.name : '')}.</p>
    <div class="slot-grid">
      ${DATA.timeSlots.map((t, i) => `
        <button class="slot ${WIZ.time === t ? 'selected' : ''}" data-slot="${t}" ${unavailable.includes(i) ? 'disabled' : ''}>${t}</button>`).join('')}
    </div>
    <div class="wizard-actions">
      <button class="btn btn-outline" data-back>Back</button>
      <button class="btn btn-primary" id="wizNext" ${!WIZ.time ? 'disabled' : ''}>Continue <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>`;
}

/* ---------- STEP 5 ---------- */
function stepDetails() {
  return `<div class="card card-pad">
    <h2 style="font-size:1.25rem">Your details</h2>
    <p class="text-muted small mt-1" style="margin-bottom:22px">All fields marked with * are required.</p>
    <form id="wizForm" novalidate>
      <div class="field"><label>Full name <span class="req">*</span></label><input name="name" value="${esc(WIZ.name)}" placeholder="Sarah Mitchell"><span class="err-msg">Please enter your full name.</span></div>
      <div class="form-row">
        <div class="field"><label>Phone number <span class="req">*</span></label><input name="phone" value="${esc(WIZ.phone)}" placeholder="+1 555 000 0000"><span class="err-msg">Enter a valid phone number.</span></div>
        <div class="field"><label>Email address <span class="req">*</span></label><input name="email" type="email" value="${esc(WIZ.email)}" placeholder="you@example.com"><span class="err-msg">Enter a valid email address.</span></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Age <span class="req">*</span></label><input name="age" type="number" min="0" max="120" value="${esc(WIZ.age)}" placeholder="34"><span class="err-msg">Enter an age between 0 and 120.</span></div>
        <div class="field"><label>Gender <span class="req">*</span></label>
          <select name="gender">
            <option value="">Select…</option>
            ${['Female','Male','Non-binary','Prefer not to say'].map(g => `<option ${WIZ.gender === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select><span class="err-msg">Please select an option.</span>
        </div>
      </div>
      <div class="field"><label>Problem description <span class="req">*</span></label>
        <textarea name="problem" placeholder="Briefly describe your symptoms or reason for the visit…">${esc(WIZ.problem)}</textarea>
        <span class="err-msg">Please describe your concern in at least 10 characters.</span>
      </div>
    </form>
    <div class="wizard-actions">
      <button class="btn btn-outline" data-back>Back</button>
      <button class="btn btn-primary" id="wizNext">Review booking <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>`;
}

/* ---------- STEP 6 ---------- */
function stepReview() {
  const doc = DATA.doctors.find(d => d.id === WIZ.doctorId);
  const dept = DATA.departments.find(d => d.id === WIZ.dept);
  return `<div class="summary">
    <div class="summary-head">
      <h3>Review your booking</h3>
      <p>Please confirm the details below before submitting.</p>
    </div>
    <div class="summary-rows">
      <div class="summary-row"><span>Department</span><b>${esc(dept ? dept.name : '')}</b></div>
      <div class="summary-row"><span>Doctor</span><b>${esc(doc ? doc.name : '')}</b></div>
      <div class="summary-row"><span>Specialty</span><b>${esc(doc ? doc.specialty : '')}</b></div>
      <div class="summary-row"><span>Date</span><b>${esc(fmtDate(WIZ.date))}</b></div>
      <div class="summary-row"><span>Time</span><b>${esc(WIZ.time)}</b></div>
      <div class="summary-row"><span>Patient</span><b>${esc(WIZ.name)}</b></div>
      <div class="summary-row"><span>Phone</span><b>${esc(WIZ.phone)}</b></div>
      <div class="summary-row"><span>Email</span><b>${esc(WIZ.email)}</b></div>
      <div class="summary-row"><span>Age / Gender</span><b>${esc(WIZ.age)} · ${esc(WIZ.gender)}</b></div>
      <div class="summary-row"><span>Consultation fee</span><b>${money(doc ? doc.fee : 0)}</b></div>
      <div class="summary-row"><span>Reason</span><b style="max-width:60%;font-weight:500">${esc(WIZ.problem)}</b></div>
    </div>
  </div>
  <p class="small text-muted mt-3"><i class="fa-solid fa-circle-info"></i> This is a demo booking. No real appointment is created and no payment is taken.</p>
  <div class="wizard-actions">
    <button class="btn btn-outline" data-back>Back</button>
    <button class="btn btn-primary" id="wizConfirm"><i class="fa-solid fa-check"></i> Confirm booking</button>
  </div>`;
}

/* ---------- STEP 7 ---------- */
function stepDone() {
  const doc = DATA.doctors.find(d => d.id === WIZ.doctorId);
  const dept = DATA.departments.find(d => d.id === WIZ.dept);
  return `<div class="success-panel">
    <div class="success-icon"><i class="fa-solid fa-check"></i></div>
    <h2 style="font-size:1.5rem">Booking confirmed</h2>
    <p class="text-muted mt-2" style="max-width:520px;margin-inline:auto">Your demo appointment has been saved to this browser. A confirmation would normally be sent to ${esc(WIZ.email)}.</p>
    <div class="booking-id"><i class="fa-solid fa-ticket"></i> ${esc(WIZ.bookingId)}</div>
    <div class="summary mt-4" style="text-align:left;max-width:520px;margin-inline:auto">
      <div class="summary-rows">
        <div class="summary-row"><span>Doctor</span><b>${esc(doc ? doc.name : '')}</b></div>
        <div class="summary-row"><span>Department</span><b>${esc(dept ? dept.name : '')}</b></div>
        <div class="summary-row"><span>Date &amp; time</span><b>${esc(fmtDate(WIZ.date))} · ${esc(WIZ.time)}</b></div>
        <div class="summary-row"><span>Status</span><b><span class="badge badge-warn">Pending confirmation</span></b></div>
      </div>
    </div>
    <div class="flex mt-4" style="justify-content:center;flex-wrap:wrap">
      <a href="#/patient/appointments" class="btn btn-primary"><i class="fa-regular fa-calendar-check"></i> View my appointments</a>
      <a href="#/" class="btn btn-outline">Back to home</a>
    </div>
    <p class="small text-muted mt-3">Demo booking ID: ${esc(WIZ.bookingId)} — stored locally only.</p>
  </div>`;
}

/* ---------- Bindings ---------- */
function bindWizard() {
  $$('[data-dept]').forEach(b => b.onclick = () => {
    WIZ.dept = b.dataset.dept; WIZ.doctorId = ''; renderWizard();
  });
  $$('[data-doc]').forEach(b => b.onclick = () => {
    WIZ.doctorId = b.dataset.doc; renderWizard();
  });
  $$('[data-date]').forEach(b => b.onclick = () => {
    if (b.disabled) return;
    WIZ.date = b.dataset.date; WIZ.time = ''; renderWizard();
  });
  const prev = $('#calPrev'), next = $('#calNext');
  if (prev) prev.onclick = () => { WIZ.calMonth = new Date(WIZ.calMonth.getFullYear(), WIZ.calMonth.getMonth() - 1, 1); renderWizard(); };
  if (next) next.onclick = () => { WIZ.calMonth = new Date(WIZ.calMonth.getFullYear(), WIZ.calMonth.getMonth() + 1, 1); renderWizard(); };

  $$('[data-slot]').forEach(b => b.onclick = () => {
    if (b.disabled) return;
    WIZ.time = b.dataset.slot; renderWizard();
  });

  $$('[data-back]').forEach(b => b.onclick = () => {
    if (WIZ.step === 3 && WIZ.doctorId && WIZ.dept && !WIZ.date) { WIZ.step = 2; }
    else WIZ.step = Math.max(1, WIZ.step - 1);
    if (WIZ.step === 1 && WIZ.doctorId) WIZ.doctorId = '';
    renderWizard();
  });

  const nx = $('#wizNext');
  if (nx) nx.onclick = () => {
    if (WIZ.step === 5) {
      const f = $('#wizForm');
      let ok = true;
      const setErr = (n, bad) => { f[n].closest('.field').classList.toggle('error', bad); if (bad) ok = false; };
      setErr('name', f.name.value.trim().length < 2);
      setErr('phone', f.phone.value.trim().length < 6);
      setErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value));
      setErr('age', !f.age.value || Number(f.age.value) < 0 || Number(f.age.value) > 120);
      setErr('gender', !f.gender.value);
      setErr('problem', f.problem.value.trim().length < 10);
      if (!ok) { toast('Please correct the highlighted fields.', 'error'); return; }
      WIZ.name = f.name.value.trim(); WIZ.phone = f.phone.value.trim();
      WIZ.email = f.email.value.trim(); WIZ.age = f.age.value;
      WIZ.gender = f.gender.value; WIZ.problem = f.problem.value.trim();
    }
    WIZ.step = Math.min(7, WIZ.step + 1);
    renderWizard();
  };

  const cf = $('#wizConfirm');
  if (cf) cf.onclick = () => {
    const doc = DATA.doctors.find(d => d.id === WIZ.doctorId);
    const id = 'MP-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    DB.push('appointments', {
      id, doctorId: WIZ.doctorId, dept: WIZ.dept, date: WIZ.date, time: WIZ.time,
      patient: WIZ.name, email: WIZ.email, phone: WIZ.phone, age: WIZ.age,
      gender: WIZ.gender, reason: WIZ.problem, status: 'Pending',
      fee: doc ? doc.fee : 0, created: new Date().toISOString()
    });
    DB.push('notifications', {
      id: uid('n'), title: 'Appointment requested',
      text: `Your booking with ${doc ? doc.name : 'a specialist'} on ${fmtDate(WIZ.date)} at ${WIZ.time} is pending confirmation.`,
      time: 'Just now', read: false, type: 'info'
    });
    WIZ.bookingId = id;
    WIZ.step = 7;
    renderWizard();
    toast('Appointment booked (demo).', 'success', 'Booking confirmed');
  };
}

/* route registered here */
route('/appointment', AppointmentPage);
