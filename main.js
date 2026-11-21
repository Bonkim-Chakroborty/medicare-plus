/* ============================================================
   MEDICARE PLUS — main.js
   Core helpers, storage, chrome (topbar/nav/footer), router.
   ============================================================ */

/* ---------- Tiny DOM helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + Number(n).toLocaleString();
const uid = p => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const initials = n => String(n).replace(/^Dr\.?\s*/i, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const hashCode = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const avatar = (name, size = 48) => {
  const h = hashCode(name);
  return `<span class="avatar" style="--size:${size}px;background:linear-gradient(135deg,hsl(${h} 60% 46%),hsl(${(h + 40) % 360} 62% 38%))">${esc(initials(name))}</span>`;
};
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const fmtDate = iso => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
};
const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

/* ---------- LocalStorage layer ---------- */
const DB = {
  k: key => 'mp_' + key,
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(this.k(key))); return (v === null || v === undefined) ? fallback : v; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(this.k(key), JSON.stringify(val)); },
  push(key, item) { const a = this.get(key, []); a.unshift(item); this.set(key, a); return item; },
  update(key, id, patch) {
    const a = this.get(key, []); const i = a.findIndex(x => x.id === id);
    if (i > -1) { a[i] = { ...a[i], ...patch }; this.set(key, a); return a[i]; }
    return null;
  },
  remove(key, id) { this.set(key, this.get(key, []).filter(x => x.id !== id)); },
  all(key) { return this.get(key, []); }
};

/* ---------- Toasts ---------- */
function toast(message, type = 'success', title) {
  const stack = $('#toast-stack');
  const icons = { success:'fa-circle-check', error:'fa-circle-exclamation', info:'fa-circle-info', warn:'fa-triangle-exclamation' };
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>
    <div class="t-body">${title ? `<b>${esc(title)}</b>` : ''}${esc(message)}</div>
    <button class="t-close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>`;
  stack.appendChild(el);
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 260); };
  el.querySelector('.t-close').onclick = close;
  setTimeout(close, 4200);
}

/* ---------- Modal ---------- */
function openModal({ title, body, footer = '', wide = false, onMount }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop">
    <div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">
      <div class="modal-head"><h3>${esc(title)}</h3><button class="x-btn" data-close><i class="fa-solid fa-xmark"></i></button></div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
    </div>
  </div>`;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  root.querySelector('[data-close]').onclick = close;
  root.querySelector('.modal-backdrop').addEventListener('click', e => { if (e.target.classList.contains('modal-backdrop')) close(); });
  if (onMount) onMount(root, close);
  return close;
}

/* ---------- Theme ---------- */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('mp_theme', t);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(cur);
  toast(`Switched to ${cur} mode`, 'info');
}

/* ---------- Navigation model ---------- */
const NAV = [
  { label:'Home',        href:'#/' },
  { label:'About',       href:'#/about' },
  { label:'Doctors',     href:'#/doctors' },
  { label:'Departments', href:'#/departments' },
  { label:'Services',    href:'#/services' },
  { label:'Pricing',     href:'#/pricing' },
  { label:'Blog',        href:'#/blog' },
  { label:'Contact',     href:'#/contact' }
];

function renderTopbar() {
  $('#topbar').innerHTML = `
    <div class="topbar">
      <div class="container">
        <ul class="topbar-list">
          <li><a href="tel:+15550102400"><i class="fa-solid fa-phone"></i> +1 (555) 010-2400</a></li>
          <li><a href="mailto:care@medicareplus.demo"><i class="fa-solid fa-envelope"></i> care@medicareplus.demo</a></li>
          <li><span><i class="fa-regular fa-clock"></i> Mon–Sat: 8:00 AM – 8:00 PM</span></li>
        </ul>
        <div class="topbar-right">
          <div class="topbar-portals">
            <a href="#/patient/dashboard">Patient Portal</a><span class="divider"></span>
            <a href="#/doctor/dashboard">Doctor Portal</a><span class="divider"></span>
            <a href="#/admin/dashboard">Admin</a>
          </div>
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
        </div>
      </div>
    </div>`;
  syncThemeIcon();
  $('#themeToggle').onclick = toggleTheme;
}

function syncThemeIcon() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = $('#themeToggle');
  if (btn) btn.innerHTML = `<i class="fa-solid ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
}

function renderHeader() {
  const path = currentPath();
  const links = NAV.map(n => {
    const active = (n.href === '#/' && (path === '/' || path === '')) || (n.href !== '#/' && path.startsWith(n.href.slice(1)));
    return `<li><a href="${n.href}" class="${active ? 'active' : ''}">${n.label}</a></li>`;
  }).join('');

  $('#site-header').innerHTML = `
    <div class="site-header" id="stickyHeader">
      <div class="container">
        <nav class="nav" aria-label="Main navigation">
          <a href="#/" class="brand" aria-label="MEDICARE PLUS home">
            <!-- ⬇️⬇️ এখানে ওয়েবসাইটের লোগো (Header Logo) পরিবর্তন করুন ⬇️⬇️ -->
            <span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span>
            <!-- <span class="brand-mark"><img src="images/logo.png" alt="MEDICARE PLUS"></span> -->
            <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
            <span class="brand-text"><b>MEDICARE PLUS</b><small>Your Health, Our Priority</small></span>
          </a>
          <ul class="nav-links">${links}</ul>
          <div class="nav-actions">
            <a href="#/login" class="btn btn-ghost btn-sm"><i class="fa-regular fa-user"></i> Login</a>
            <a href="#/appointment" class="btn btn-primary btn-sm"><i class="fa-regular fa-calendar-check"></i> Book Appointment</a>
            <button class="hamburger" id="hamburger" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
          </div>
        </nav>
      </div>
    </div>
    <div class="scrim" id="navScrim"></div>
    <aside class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <div class="mobile-menu-head">
        <!-- ⬇️⬇️ এখানে মোবাইল মেনুর লোগো পরিবর্তন করুন ⬇️⬇️ -->
        <span class="brand"><span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span></span>
        <!-- <span class="brand"><span class="brand-mark"><img src="images/logo.png" alt="MEDICARE PLUS"></span></span> -->
        <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
        <button class="x-btn" id="closeMenu"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <nav>
        ${NAV.map(n => `<a href="${n.href}" class="${path === n.href.slice(1) ? 'active' : ''}">${n.label}</a>`).join('')}
        <a href="#/faq">FAQ</a>
        <a href="#/patient/dashboard">Patient Portal</a>
        <a href="#/doctor/dashboard">Doctor Portal</a>
        <a href="#/admin/dashboard">Admin Panel</a>
      </nav>
      <div class="mobile-menu-foot">
        <a href="#/appointment" class="btn btn-primary btn-block"><i class="fa-regular fa-calendar-check"></i> Book Appointment</a>
        <a href="#/login" class="btn btn-outline btn-block">Login</a>
      </div>
    </aside>`;

  const menu = $('#mobileMenu'), scrim = $('#navScrim');
  const open = () => { menu.classList.add('open'); scrim.classList.add('show'); menu.setAttribute('aria-hidden', 'false'); };
  const close = () => { menu.classList.remove('open'); scrim.classList.remove('show'); menu.setAttribute('aria-hidden', 'true'); };
  $('#hamburger').onclick = open;
  $('#closeMenu').onclick = close;
  scrim.onclick = close;
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', close));

  window.addEventListener('scroll', () => {
    const h = $('#stickyHeader');
    if (h) h.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

function renderFooter() {
  $('#site-footer').innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <!-- ⬇️⬇️ এখানে ফুটারের লোগো (Footer Logo) পরিবর্তন করুন ⬇️⬇️ -->
            <div class="footer-brand">
              <span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span>
              <!-- <span class="brand-mark"><img src="images/logo.png" alt="MEDICARE PLUS"></span> -->
              <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
              <b>MEDICARE PLUS</b>
            </div>
            <p>A premium multi-specialty clinic delivering compassionate, evidence-based care to more than 25,000 patients every year.</p>
            <div class="socials">
              <a href="#/contact" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#/contact" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#/contact" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#/contact" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#/about">About Us</a></li>
              <li><a href="#/doctors">Our Doctors</a></li>
              <li><a href="#/departments">Departments</a></li>
              <li><a href="#/services">Services</a></li>
              <li><a href="#/pricing">Pricing Plans</a></li>
              <li><a href="#/blog">Health Blog</a></li>
            </ul>
          </div>
          <div>
            <h4>Patient Care</h4>
            <ul class="footer-links">
              <li><a href="#/appointment">Book Appointment</a></li>
              <li><a href="#/patient/dashboard">Patient Portal</a></li>
              <li><a href="#/faq">FAQ</a></li>
              <li><a href="#/contact">Contact Us</a></li>
              <li><a href="#/privacy">Privacy Policy</a></li>
              <li><a href="#/terms">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4>Get In Touch</h4>
            <div class="footer-contact">
              <div><i class="fa-solid fa-location-dot"></i><span>128 Wellness Boulevard,<br>Springfield Medical District</span></div>
              <div><i class="fa-solid fa-phone"></i><a href="tel:+15550102400">+1 (555) 010-2400</a></div>
              <div><i class="fa-solid fa-envelope"></i><a href="mailto:care@medicareplus.demo">care@medicareplus.demo</a></div>
              <div><i class="fa-regular fa-clock"></i><span>Mon–Sat: 8:00 AM – 8:00 PM<br>Sunday: Emergency only</span></div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} MEDICARE PLUS. Frontend demo project — not a real medical service.</span>
          <div class="footer-legal">
            <a href="#/privacy">Privacy Policy</a>
            <a href="#/terms">Terms &amp; Conditions</a>
            <a href="#/faq">Support</a>
          </div>
        </div>
      </div>
    </footer>`;
}

/* ---------- Router ---------- */
const ROUTES = [];
function route(pattern, handler) { ROUTES.push({ pattern, handler }); }

function currentPath() {
  const raw = location.hash.replace(/^#/, '') || '/';
  return raw.split('?')[0] || '/';
}
function currentQuery() {
  const raw = location.hash.replace(/^#/, '');
  const qs = raw.split('?')[1] || '';
  return Object.fromEntries(new URLSearchParams(qs));
}
function resolve(path) {
  const ap = path.split('/').filter(Boolean);
  const ordered = ROUTES.filter(r => !r.pattern.includes(':')).concat(ROUTES.filter(r => r.pattern.includes(':')));
  for (const r of ordered) {
    const pp = r.pattern.split('/').filter(Boolean);
    if (pp.length !== ap.length) continue;
    const params = {}; let ok = true;
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
      else if (pp[i].toLowerCase() !== ap[i].toLowerCase()) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}

function setLayout(mode) {
  document.body.setAttribute('data-layout', mode);
  const chrome = $('#chrome'), portal = $('#portal');
  if (mode === 'portal') { chrome.style.display = 'none'; }
  else { chrome.style.display = ''; portal.innerHTML = ''; }
}

function navigate() {
  const path = currentPath();
  const match = resolve(path);
  const isPortal = /^\/(patient|admin)(\/|$)/.test(path) || /^\/doctor(\/(dashboard|appointments|patients|schedule|prescription|profile))?$/.test(path);

  if (isPortal) setLayout('portal'); else setLayout('site');

  const target = isPortal ? $('#portal') : $('#view');

  if (!match) {
    renderHeader();
    setLayout('site');
    $('#view').innerHTML = PAGE_NOT_FOUND();
    window.scrollTo({ top: 0 });
    return;
  }

  const out = match.handler(match.params, currentQuery());
  target.innerHTML = typeof out === 'string' ? out : out.html;

  if (!isPortal) { renderHeader(); }
  if (out && typeof out === 'object' && out.init) out.init();

  observeReveals();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/* ---------- Reveal on scroll ---------- */
let revealObserver = null;
function observeReveals() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('in')); return; }
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));
}

/* ---------- Accordion (delegated) ---------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-acc]');
  if (!btn) return;
  const item = btn.closest('.acc-item');
  const panel = item.querySelector('.acc-panel');
  const open = item.classList.contains('open');
  const group = item.parentElement;
  if (!group.dataset.multi) {
    $$('.acc-item', group).forEach(o => { o.classList.remove('open'); o.querySelector('.acc-panel').style.maxHeight = null; });
  }
  if (!open) { item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
});

/* ---------- Tabs (delegated) ---------- */
document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (!tab) return;
  const wrap = tab.closest('[data-tabs-wrap]') || tab.parentElement.parentElement;
  $$('[data-tab]', wrap).forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const id = tab.dataset.tab;
  $$('[data-tab-panel]', wrap).forEach(p => p.classList.toggle('active', p.dataset.tabPanel === id));
});

/* ---------- Counters ---------- */
function animateCounters() {
  $$('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400; const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  applyTheme(localStorage.getItem('mp_theme') || 'light');
  renderTopbar();
  renderHeader();
  renderFooter();
  window.addEventListener('hashchange', navigate);
  navigate();
  // counters on home
  const obs = new IntersectionObserver(en => {
    if (en[0].isIntersecting) { animateCounters(); obs.disconnect(); }
  }, { threshold: 0.25 });
  setTimeout(() => { const s = $('.stats-grid'); if (s) obs.observe(s); }, 300);
});