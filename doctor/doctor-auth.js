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
      setTimeout(() => {
        const acc = doctorAccounts().find(a => a.email === email && a.password === pass);
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
        location.hash = '#/doctor/dashboard';
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
});