/* ============================================================
   MEDICARE PLUS — pages.js
   All public page renderers + route registration.
   ============================================================ */

/* ---------- Shared partials ---------- */
const PAGE_HEAD = (title, subtitle, crumbs = []) => `
  <section class="page-head">
    <div class="container">
      <div class="breadcrumb">
        <a href="#/">Home</a>
        ${crumbs.map(c => `<i class="fa-solid fa-chevron-right"></i><a href="${c.href}">${esc(c.label)}</a>`).join('')}
        <i class="fa-solid fa-chevron-right"></i><span>${esc(title)}</span>
      </div>
      <h1>${esc(title)}</h1>
      ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
    </div>
  </section>`;

const CTA_BANNER = () => `
  <section class="section section--tight">
    <div class="container">
      <div class="cta-banner reveal">
        <div>
          <h2>Ready to see a specialist?</h2>
          <p>Book a consultation in under two minutes. Same-week appointments available across all ten departments.</p>
        </div>
        <div class="cta-actions">
          <a href="#/appointment" class="btn btn-teal btn-lg"><i class="fa-regular fa-calendar-check"></i> Book Appointment</a>
          <a href="#/doctors" class="btn btn-outline btn-lg">Find a Doctor</a>
        </div>
      </div>
    </div>
  </section>`;

const NEWSLETTER = () => `
  <section class="section section--tight">
    <div class="container">
      <div class="newsletter reveal">
        <div>
          <h3>Health insights, straight to your inbox</h3>
          <p>Monthly articles from our consultants. No spam, unsubscribe anytime.</p>
        </div>
        <form class="nl-form" id="nlForm" novalidate>
          <input type="email" placeholder="you@example.com" aria-label="Email address" required>
          <button class="btn btn-teal" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </section>`;

function bindNewsletter() {
  const f = $('#nlForm');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const input = f.querySelector('input');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { toast('Please enter a valid email address.', 'error'); return; }
    toast('Subscribed! Check your inbox for a welcome email.', 'success', 'Thank you');
    f.reset();
  });
}

function deptCard(d) {
  const count = DATA.doctors.filter(x => x.dept === d.id).length;
  return `<a href="#/department/${d.id}" class="dept-card reveal">
    <!-- ⬇️⬇️ এখানে ডিপার্টমেন্টের কার্ডের ছবি বা আইকন পরিবর্তন করুন ⬇️⬇️ -->
    <!-- <div class="dept-icon">
    <img src="images/departments/${d.id}.jpg" alt="${esc(d.name)}"></div> -->
    <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
    <h3>${esc(d.name)}</h3>
    <p>${esc(d.desc.slice(0, 104))}…</p>
    <div class="dept-foot"><span>${count} specialist${count === 1 ? '' : 's'}</span><i class="fa-solid fa-arrow-right"></i></div>
  </a>`;
}

function docCard(d) {
  const dept = DATA.departments.find(x => x.id === d.dept);
  return `<article class="doc-card reveal">
    <div class="doc-top">
      <!-- 📷 DEMO IMAGE: ডাক্তারের কার্ডের ছবি (পরে পরিবর্তন করুন) -->
      ${d.img ? `<img src="${d.img}" alt="${esc(d.name)}" class="doc-avatar img-animated" style="width:58px;height:58px">` : avatar(d.name, 58)}
      <span class="badge badge-ok"><i class="fa-solid fa-circle" style="font-size:.45rem"></i> Available</span>
    </div>
    <div>
      <h3>${esc(d.name)}</h3>
      <p class="doc-spec">${esc(d.specialty)}</p>
    </div>
    <div class="doc-meta">
      <span><i class="fa-solid fa-briefcase-medical"></i> ${d.exp} yrs</span>
      <span><i class="fa-solid fa-star"></i> ${d.rating} (${d.reviews})</span>
      <span><i class="fa-solid fa-building-columns"></i> ${esc(dept ? dept.name : '')}</span>
    </div>
    <div class="doc-foot">
      <div class="doc-fee">${money(d.fee)} <small>/ visit</small></div>
      <div class="doc-actions">
        <a href="#/doctor/${d.id}" class="btn btn-outline btn-sm">Details</a>
        <a href="#/appointment?doctor=${d.id}" class="btn btn-primary btn-sm">Book</a>
      </div>
    </div>
  </article>`;
}

function postCard(p) {
  const authorDoc = DATA.doctors.find(x => x.name === p.author);
  return `<article class="post-card reveal">
    <!-- 📷 DEMO IMAGE: ব্লগ পোস্টের থাম্বনেইল ছবি (পরে পরিবর্তন করুন) -->
    <a href="#/blog/${p.id}" class="post-thumb has-photo">
      <img src="${p.img}" alt="${esc(p.title)}" class="img-animated">
    </a>
    <div class="post-body">
      <div class="post-meta">
        <span class="badge badge-info">${esc(p.cat)}</span>
        <span><i class="fa-regular fa-calendar"></i> ${fmtDate(p.date)}</span>
        <span><i class="fa-regular fa-clock"></i> ${p.read} min read</span>
      </div>
      <h3><a href="#/blog/${p.id}">${esc(p.title)}</a></h3>
      <p>${esc(p.excerpt)}</p>
      <div class="post-foot">
        <!-- 📷 DEMO IMAGE: ব্লগ পোস্টের লেখকের ছবি (পরে পরিবর্তন করুন) -->
        <span class="author">${authorDoc && authorDoc.img ? `<img src="${authorDoc.img}" alt="${esc(p.author)}" class="doc-avatar" style="width:26px;height:26px">` : avatar(p.author, 26)} ${esc(p.author)}</span>
        <a href="#/blog/${p.id}" class="btn-link">Read <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  </article>`;
}

/* ============================================================
   HOME
   ============================================================ */
function HomePage() {
  const depts = DATA.departments.slice(0, 8);
  const docs = DATA.doctors.slice(0, 4);
  const posts = DATA.posts.slice(0, 3);
  const faqs = DATA.faqs.slice(0, 5);
  const deptOptions = DATA.departments.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('');

  return {
    html: `
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div>
            <span class="eyebrow"><i class="fa-solid fa-shield-heart"></i> Trusted by 25,000+ patients</span>
            <h1>Your Health Deserves<br>The <em>Best Care</em></h1>
            <p class="lead">Ten specialist departments, senior consultants and same-week appointments — all under one roof. Modern medicine delivered with genuine human attention.</p>
            <div class="hero-cta">
              <a href="#/appointment" class="btn btn-primary btn-lg"><i class="fa-regular fa-calendar-check"></i> Book an Appointment</a>
              <a href="#/doctors" class="btn btn-outline btn-lg"><i class="fa-solid fa-user-doctor"></i> Find a Doctor</a>
            </div>
            <div class="hero-trust">
              <!-- 📷 DEMO IMAGE: বিশ্বস্ত ৪ জন ডাক্তারের ছোট অ্যাভাটার (পরে পরিবর্তন করুন) -->
              <div class="avatars">
                ${DATA.doctors.slice(0, 4).map(d => `<img src="${d.img}" alt="${esc(d.name)}" class="avatar-img img-animated" style="width:40px;height:40px">`).join('')}
              </div>
              <div>
                <strong>4.9 / 5 average rating</strong>
                <small>from 2,400+ verified patient reviews</small>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <!-- 📷 DEMO IMAGE: হোমপেজের মূল হিরো ডাক্তারের বড় ছবি (পরে পরিবর্তন করুন) -->
            <div class="hero-photo has-photo">
              <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80" alt="Doctor Consultation" class="img-animated">
            </div>

            

            <div class="float-card fc-2">
              <span class="fc-icon" style="background:rgba(32,184,166,.14);color:#20B8A6"><i class="fa-solid fa-clock"></i></span>
              <div><b>24/7 Emergency</b><span>Always here for you</span></div>
            </div>

            <div class="float-card fc-3">
              <span class="fc-icon" style="background:rgba(22,119,200,.12);color:#1677C8"><i class="fa-solid fa-flask-vial"></i></span>
              <div><b>Same-day Lab</b><span>Results on your phone</span></div>
            </div>
          </div>
        </div>

        <form class="quick-search reveal" id="quickSearch">
          <div class="qs-field">
            <label for="qsDoc">Doctor or keyword</label>
            <input id="qsDoc" type="text" placeholder="e.g. cardiologist, skin, child care">
          </div>
          <div class="qs-field">
            <label for="qsDept">Department</label>
            <select id="qsDept"><option value="">All departments</option>${deptOptions}</select>
          </div>
          <div class="qs-field">
            <label for="qsDate">Preferred date</label>
            <input id="qsDate" type="date" min="${todayISO()}">
          </div>
          <button class="btn btn-primary" type="submit"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
        </form>
      </div>
    </section>

    <section class="stats-band">
      <div class="container">
        <div class="stats-grid">
          <div class="stat"><b data-count="25" data-suffix="K+">0</b><span>Happy Patients</span></div>
          <div class="stat"><b data-count="48" data-suffix="+">0</b><span>Expert Doctors</span></div>
          <div class="stat"><b data-count="10" data-suffix="">0</b><span>Specialties</span></div>
          <div class="stat"><b data-count="15" data-suffix="+">0</b><span>Years of Care</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <!-- 📷 DEMO IMAGE: হোমপেজের About সেকশনের ৪টি গ্রিড ছবি (পরে পরিবর্তন করুন) -->
          <div class="split-visual reveal">
            <div class="tile"><img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80" alt="Hospital Reception" class="img-animated"></div> <!-- 📷 ছবি ১ -->
            <div class="tile"><img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" alt="Medical Diagnostics" class="img-animated"></div> <!-- 📷 ছবি ২ -->
            <div class="tile"><img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80" alt="Doctor Consultation" class="img-animated"></div> <!-- 📷 ছবি ৩ -->
            <div class="tile"><img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80" alt="Laboratory Care" class="img-animated"></div> <!-- 📷 ছবি ৪ -->
          </div>
          <div>
            <span class="eyebrow">About the clinic</span>
            <h2 class="mt-2">Healthcare built around the person, not the paperwork</h2>
            <p class="lead mt-2">MEDICARE PLUS opened in 2010 with a simple belief: excellent medicine should also feel calm, clear and respectful. Fifteen years later, that belief still shapes every consultation.</p>
            <ul class="check-list">
              <li><i class="fa-solid fa-check"></i><span><strong>Senior consultants only</strong> — every specialist has a minimum of 9 years of clinical practice.</span></li>
              <li><i class="fa-solid fa-check"></i><span><strong>Same-week appointments</strong> across all ten departments, with online booking available 24/7.</span></li>
              <li><i class="fa-solid fa-check"></i><span><strong>On-site diagnostics</strong> — laboratory, imaging and pharmacy in a single visit.</span></li>
              <li><i class="fa-solid fa-check"></i><span><strong>Transparent pricing</strong> — you always know the cost before you commit.</span></li>
            </ul>
            <a href="#/about" class="btn btn-navy mt-3">More about us <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Medical departments</span>
          <h2 class="mt-2">Ten specialties, one standard of care</h2>
          <p>Each department is led by a senior consultant and supported by a dedicated nursing and diagnostics team.</p>
        </div>
        <div class="grid g-4">${depts.map(deptCard).join('')}</div>
        <div class="center mt-4"><a href="#/departments" class="btn btn-outline">View all departments <i class="fa-solid fa-arrow-right"></i></a></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Our specialists</span>
          <h2 class="mt-2">Meet the doctors you'll be seeing</h2>
          <p>Board-certified consultants with international training and a genuine commitment to patient education.</p>
        </div>
        <div class="grid g-4">${docs.map(docCard).join('')}</div>
        <div class="center mt-4"><a href="#/doctors" class="btn btn-outline">View all doctors <i class="fa-solid fa-arrow-right"></i></a></div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">What we offer</span>
          <h2 class="mt-2">Complete care under one roof</h2>
          <p>From routine screening to complex procedures, everything you need is available on-site.</p>
        </div>
        <div class="grid g-3">
          ${DATA.services.slice(0, 6).map(s => `
            <div class="svc-card reveal">
              <!-- ⬇️⬇️ এখানে সার্ভিসের আইকন বা ছবি পরিবর্তন করুন ⬇️⬇️ -->
              <div class="svc-icon"><i class="fa-solid ${s.icon}"></i></div>
              <!-- <div class="svc-icon"><img src="images/services/${s.icon}.png" alt="${esc(s.title)}"></div> -->
              <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
              <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
            </div>`).join('')}
        </div>
        <div class="center mt-4"><a href="#/services" class="btn btn-outline">All services <i class="fa-solid fa-arrow-right"></i></a></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Why choose us</span>
          <h2 class="mt-2">The difference is in the details</h2>
        </div>
        <div class="grid g-4">
          ${[
            ['fa-user-doctor','Senior consultants','Every specialist has at least nine years of hands-on clinical experience.'],
            ['fa-clock','No long waits','Appointments run on schedule. Average waiting time is under 12 minutes.'],
            ['fa-file-medical','Digital records','Access your prescriptions, lab results and history from the patient portal.'],
            ['fa-hand-holding-heart','Genuine compassion','We schedule enough time to actually listen. No rushed consultations.']
          ].map(([i, t, d]) => `
            <div class="feature reveal">
              <div class="f-icon"><i class="fa-solid ${i}"></i></div>
              <h3>${t}</h3><p>${d}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    ${CTA_BANNER()}

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Patient stories</span>
          <h2 class="mt-2">What our patients say</h2>
        </div>
        <div class="grid g-3">
          ${DATA.testimonials.slice(0, 3).map(t => `
            <div class="testi reveal">
              <div class="stars">${stars(t.rating)}</div>
              <blockquote>“${esc(t.text)}”</blockquote>
              <!-- 📷 DEMO IMAGE: রিভিউ দেয়া রোগীর ছবি (পরে পরিবর্তন করুন) -->
              <div class="testi-author">
                ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}" class="avatar-img img-animated" style="width:44px;height:44px">` : avatar(t.name, 42)}
                <div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Health library</span>
          <h2 class="mt-2">Latest health articles</h2>
          <p>Evidence-based guidance written by our own consultants.</p>
        </div>
        <div class="grid g-3">${posts.map(postCard).join('')}</div>
        <div class="center mt-4"><a href="#/blog" class="btn btn-outline">All articles <i class="fa-solid fa-arrow-right"></i></a></div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="split" style="align-items:start">
          <div>
            <span class="eyebrow">FAQ</span>
            <h2 class="mt-2">Questions, answered</h2>
            <p class="lead mt-2">Can't find what you're looking for? Our reception team is available Mon–Sat, 8 AM – 8 PM.</p>
            <a href="#/faq" class="btn btn-outline mt-3">All questions <i class="fa-solid fa-arrow-right"></i></a>
          </div>
          <div class="accordion" data-multi="0">
            ${faqs.map((f, i) => `
              <div class="acc-item ${i === 0 ? 'open' : ''}">
                <button class="acc-btn" data-acc>${esc(f.q)}<i class="fa-solid fa-chevron-down"></i></button>
                <div class="acc-panel" ${i === 0 ? 'style="max-height:400px"' : ''}><div>${esc(f.a)}</div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    ${NEWSLETTER()}

    <section class="section section--tight">
      <div class="container">
        <div class="grid g-4">
          ${[
            ['fa-location-dot','Visit us','128 Wellness Boulevard, Springfield Medical District'],
            ['fa-phone','Call us','+1 (555) 010-2400 · Mon–Sat 8 AM – 8 PM'],
            ['fa-envelope','Email us','care@medicareplus.demo'],
            ['fa-truck-medical','Emergency','+1 (555) 010-2911 · Available 24/7']
          ].map(([i, t, d]) => `
            <div class="info-card reveal">
              <div class="i"><i class="fa-solid ${i}"></i></div>
              <div><b>${t}</b><p>${esc(d)}</p></div>
            </div>`).join('')}
        </div>
      </div>
    </section>`,
    init() {
      bindNewsletter();
      const f = $('#quickSearch');
      f.addEventListener('submit', e => {
        e.preventDefault();
        const kw = $('#qsDoc').value.trim();
        const dept = $('#qsDept').value;
        const params = new URLSearchParams();
        if (kw) params.set('q', kw);
        if (dept) params.set('dept', dept);
        location.hash = '#/doctors' + (params.toString() ? '?' + params.toString() : '');
      });
    }
  };
}

/* ============================================================
   ABOUT
   ============================================================ */
function AboutPage() {
  return {
    html: `
      ${PAGE_HEAD('About MEDICARE PLUS', 'Fifteen years of patient-first medicine in the heart of Springfield.', [{label:'About', href:'#/about'}])}
      <section class="section">
        <div class="container">
          <div class="split">
            <!-- 📷 DEMO IMAGE: About পেজের ৪টি গ্রিড ছবি (পরে পরিবর্তন করুন) -->
            <div class="split-visual reveal">
              <div class="tile"><img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80" alt="Hospital Building" class="img-animated"></div> <!-- 📷 ছবি ১ -->
              <div class="tile"><img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80" alt="Nurse Care" class="img-animated"></div> <!-- 📷 ছবি ২ -->
              <div class="tile"><img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80" alt="Diagnostics" class="img-animated"></div> <!-- 📷 ছবি ৩ -->
              <div class="tile"><img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" alt="Compassion" class="img-animated"></div> <!-- 📷 ছবি ৪ -->
            </div>
            <div>
              <span class="eyebrow">Our story</span>
              <h2 class="mt-2">Founded on a simple promise</h2>
              <p class="lead mt-2">In 2010, three consultants opened a small practice with one rule: never let a patient leave without understanding their own health. That rule has never changed.</p>
              <p class="mt-2 text-muted">Today MEDICARE PLUS spans ten departments, a full diagnostic laboratory and a team of 48 clinicians. What has not changed is the amount of time we give each person — consultations here are measured in listening, not throughput.</p>
              <ul class="check-list">
                <li><i class="fa-solid fa-check"></i><span>Accredited by the National Healthcare Quality Board</span></li>
                <li><i class="fa-solid fa-check"></i><span>98.4% patient satisfaction across 2,400+ reviews</span></li>
                <li><i class="fa-solid fa-check"></i><span>ISO 9001 certified laboratory and imaging unit</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-band">
        <div class="container">
          <div class="stats-grid">
            <div class="stat"><b>2010</b><span>Year Founded</span></div>
            <div class="stat"><b>48</b><span>Expert Clinicians</span></div>
            <div class="stat"><b>25K+</b><span>Patients Served</span></div>
            <div class="stat"><b>10</b><span>Specialties</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Our values</span>
            <h2 class="mt-2">What guides every decision</h2>
          </div>
          <div class="grid g-4">
            ${[
              ['fa-hand-holding-heart','Compassion first','We treat anxiety as a symptom worth addressing, not an inconvenience.'],
              ['fa-scale-balanced','Evidence over opinion','Every protocol is grounded in current peer-reviewed research.'],
              ['fa-comments','Radical clarity','No jargon, no ambiguity. You leave knowing exactly what happens next.'],
              ['fa-shield-halved','Absolute discretion','Your records are encrypted and never shared without explicit consent.']
            ].map(([i, t, d]) => `
              <div class="feature reveal">
                <div class="f-icon"><i class="fa-solid ${i}"></i></div>
                <h3>${t}</h3><p>${d}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="section-head"><span class="eyebrow">Leadership</span><h2 class="mt-2">Meet the team behind the clinic</h2></div>
          <div class="grid g-3">
            ${DATA.doctors.slice(0, 3).map(d => `
              <div class="card card-pad card-hover reveal">
                <!-- ⬇️⬇️ এখানে লিডারশিপ দলের ডাক্তারের ছবি পরিবর্তন করুন ⬇️⬇️ -->
                <div class="flex" style="gap:16px">${avatar(d.name, 64)}
                <!-- <div class="flex" style="gap:16px"><img src="images/doctors/${d.id}.jpg" alt="${esc(d.name)}" class="doc-avatar" style="width:64px;height:64px"> -->
                <!-- ⬆️⬆️ উপরের avatar(...) লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
                  <div><h3>${esc(d.name)}</h3><p class="doc-spec">${esc(d.specialty)}</p></div>
                </div>
                <p class="text-muted mt-2" style="font-size:.87rem">${esc(d.bio.slice(0, 130))}…</p>
                <a href="#/doctor/${d.id}" class="btn btn-outline btn-sm mt-3">View profile</a>
              </div>`).join('')}
          </div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

/* ============================================================
   DOCTORS LIST
   ============================================================ */
let docState = { q:'', dept:'', sort:'rating', page:1, per:6 };

function DoctorsPage() {
  const q = currentQuery();
  docState = { q: q.q || '', dept: q.dept || '', sort:'rating', page:1, per:6 };

  const deptOpts = DATA.departments.map(d => `<option value="${d.id}" ${docState.dept === d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('');

  return {
    html: `
      ${PAGE_HEAD('Our Doctors', 'Twelve senior consultants across ten specialties — all accepting new patients.', [{label:'Doctors', href:'#/doctors'}])}
      <section class="section">
        <div class="container">
          <div class="toolbar">
            <div class="search-box">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input id="docSearch" type="text" placeholder="Search by name or specialty…" value="${esc(docState.q)}">
            </div>
            <select id="docDept"><option value="">All departments</option>${deptOpts}</select>
            <select id="docSort">
              <option value="rating">Sort: Highest rated</option>
              <option value="exp">Sort: Most experienced</option>
              <option value="feeLow">Sort: Fee (low → high)</option>
              <option value="feeHigh">Sort: Fee (high → low)</option>
            </select>
          </div>
          <div id="docResults"></div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init() {
      renderDocResults();
      $('#docSearch').addEventListener('input', e => { docState.q = e.target.value; docState.page = 1; renderDocResults(); });
      $('#docDept').addEventListener('change', e => { docState.dept = e.target.value; docState.page = 1; renderDocResults(); });
      $('#docSort').addEventListener('change', e => { docState.sort = e.target.value; docState.page = 1; renderDocResults(); });
      bindNewsletter();
    }
  };
}

function renderDocResults() {
  const wrap = $('#docResults');
  if (!wrap) return;
  let list = DATA.doctors.filter(d => {
    const q = docState.q.toLowerCase();
    const matchesQ = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.dept.includes(q);
    const matchesD = !docState.dept || d.dept === docState.dept;
    return matchesQ && matchesD;
  });

  const sorters = {
    rating: (a, b) => b.rating - a.rating,
    exp: (a, b) => b.exp - a.exp,
    feeLow: (a, b) => a.fee - b.fee,
    feeHigh: (a, b) => b.fee - a.fee
  };
  list.sort(sorters[docState.sort]);

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / docState.per));
  if (docState.page > pages) docState.page = pages;
  const start = (docState.page - 1) * docState.per;
  const slice = list.slice(start, start + docState.per);

  if (!total) {
    wrap.innerHTML = `<div class="empty"><i class="fa-solid fa-user-doctor"></i><b>No doctors found</b><p>Try a different search term or department filter.</p></div>`;
    return;
  }

  wrap.innerHTML = `
    <p class="text-muted small" style="margin-bottom:20px">Showing ${start + 1}–${Math.min(start + docState.per, total)} of ${total} doctors</p>
    <div class="grid g-3">${slice.map(docCard).join('')}</div>
    <div class="pagination">
      <button ${docState.page === 1 ? 'disabled' : ''} data-page="${docState.page - 1}"><i class="fa-solid fa-chevron-left"></i></button>
      ${Array.from({ length: pages }, (_, i) => `<button class="${docState.page === i + 1 ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('')}
      <button ${docState.page === pages ? 'disabled' : ''} data-page="${docState.page + 1}"><i class="fa-solid fa-chevron-right"></i></button>
    </div>`;

  $$('[data-page]', wrap).forEach(b => b.onclick = () => { docState.page = Number(b.dataset.page); renderDocResults(); window.scrollTo({ top: 200, behavior: 'smooth' }); });
}

/* ============================================================
   DOCTOR DETAILS
   ============================================================ */
function DoctorDetailsPage({ id }) {
  const d = DATA.doctors.find(x => x.id === id);
  if (!d) return { html: PAGE_NOT_FOUND() };
  const dept = DATA.departments.find(x => x.id === d.dept);
  const docReviews = DATA.reviews.filter(r => r.doctor === d.id);
  const related = DATA.doctors.filter(x => x.dept === d.dept && x.id !== d.id).slice(0, 3);

  return {
    html: `
      ${PAGE_HEAD(d.name, d.specialty, [{ label:'Doctors', href:'#/doctors' }, { label:d.name, href:'#/doctor/' + d.id }])}
      <section class="section">
        <div class="container">
          <div class="split" style="grid-template-columns:1fr 1.5fr;align-items:start">
            <div class="card card-pad reveal">
              <div class="center">
                <!-- ⬇️⬇️ এখানে ডাক্তারের বড় প্রোফাইল ছবি পরিবর্তন করুন ⬇️⬇️ -->
                ${avatar(d.name, 132)}
                <!-- <img src="images/doctors/${d.id}.jpg" alt="${esc(d.name)}" class="doctor-hero-img"> -->
                <!-- ⬆️⬆️ উপরের avatar(...) লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
                <h2 class="mt-3" style="font-size:1.4rem">${esc(d.name)}</h2>
                <p class="doc-spec">${esc(d.specialty)}</p>
                <div class="flex" style="justify-content:center;margin-top:10px;gap:8px">
                  <span class="badge badge-teal"><i class="fa-solid fa-star"></i> ${d.rating} (${d.reviews})</span>
                  <span class="badge badge-ok">Available</span>
                </div>
              </div>
              <div class="summary-rows mt-3" style="padding:0">
                <div class="summary-row"><span>Department</span><b>${esc(dept ? dept.name : '—')}</b></div>
                <div class="summary-row"><span>Qualification</span><b style="font-size:.8rem">${esc(d.qual)}</b></div>
                <div class="summary-row"><span>Experience</span><b>${d.exp} years</b></div>
                <div class="summary-row"><span>Consultation Fee</span><b>${money(d.fee)}</b></div>
                <div class="summary-row"><span>Languages</span><b style="font-size:.8rem">${d.lang.join(', ')}</b></div>
              </div>
              <a href="#/appointment?doctor=${d.id}" class="btn btn-primary btn-block mt-3"><i class="fa-regular fa-calendar-check"></i> Book Appointment</a>
            </div>

            <div>
              <div class="card card-pad reveal">
                <h3 style="font-size:1.1rem">Biography</h3>
                <p class="text-muted mt-2" style="line-height:1.85">${esc(d.bio)}</p>
              </div>

              <div class="card card-pad mt-3 reveal">
                <h3 style="font-size:1.1rem">Availability</h3>
                <div class="chip-row mt-2">
                  ${['Mon','Tue','Wed','Thu','Fri','Sat'].map(day => `<span class="chip ${d.days.includes(day) ? 'active' : ''}" style="cursor:default">${day}</span>`).join('')}
                </div>
                <p class="small text-muted mt-3" style="margin-bottom:8px"><strong>Time slots</strong></p>
                <div class="slot-grid">
                  ${DATA.timeSlots.slice(0, 10).map((t, i) => `<button class="slot" ${i % 4 === 2 ? 'disabled' : ''}>${t}</button>`).join('')}
                </div>
                <a href="#/appointment?doctor=${d.id}" class="btn btn-teal btn-block mt-3">Select a slot & book</a>
              </div>

              <div class="card card-pad mt-3 reveal">
                <h3 style="font-size:1.1rem">Patient reviews (${docReviews.length || 0})</h3>
                ${docReviews.length ? docReviews.map(r => `
                  <div style="padding:16px 0;border-bottom:1px solid var(--line-2)">
                    <div class="flex between">
                      <!-- 📷 DEMO IMAGE: রিভিউ রোগীর ছবি (পরে পরিবর্তন করুন) -->
                      <div class="flex" style="gap:10px"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="${esc(r.name)}" class="avatar-img img-animated" style="width:36px;height:36px"><div><b style="font-family:var(--head);font-size:.86rem">${esc(r.name)}</b><div class="small text-muted">${fmtDate(r.date)}</div></div></div>
                      <span style="color:#F59E0B;font-size:.8rem">${stars(r.rating)}</span>
                    </div>
                    <p class="text-muted mt-2" style="font-size:.87rem">${esc(r.text)}</p>
                  </div>`).join('') : `<div class="empty" style="padding:26px"><i class="fa-regular fa-comment"></i><b>No reviews yet</b><p>Be the first to share your experience.</p></div>`}
                <button class="btn btn-outline btn-sm mt-3" id="writeReview"><i class="fa-regular fa-pen-to-square"></i> Write a review</button>
              </div>
            </div>
          </div>

          ${related.length ? `
          <div class="mt-4">
            <h2 style="font-size:1.3rem;margin-bottom:22px">Related doctors</h2>
            <div class="grid g-3">${related.map(docCard).join('')}</div>
          </div>` : ''}
        </div>
      </section>
      ${CTA_BANNER()}`,
    init() {
      $$('.slot').forEach(s => s.onclick = () => {
        if (s.disabled) return;
        location.hash = '#/appointment?doctor=' + d.id;
      });
      const wr = $('#writeReview');
      if (wr) wr.onclick = () => openModal({
        title: 'Write a review for ' + d.name,
        body: `
          <div class="field"><label>Your rating</label>
            <select id="rvRating">${[5,4,3,2,1].map(n => `<option value="${n}">${n} star${n>1?'s':''}</option>`).join('')}</select>
          </div>
          <div class="field"><label>Your name</label><input id="rvName" placeholder="e.g. Alex Morgan"></div>
          <div class="field"><label>Your review</label><textarea id="rvText" placeholder="Tell others about your experience…"></textarea></div>`,
        footer: `<button class="btn btn-outline" data-close2>Cancel</button><button class="btn btn-primary" id="rvSubmit">Submit review</button>`,
        onMount(root, close) {
          root.querySelector('[data-close2]').onclick = close;
          root.querySelector('#rvSubmit').onclick = () => {
            const name = root.querySelector('#rvName').value.trim();
            const text = root.querySelector('#rvText').value.trim();
            if (!name || !text) { toast('Please fill in your name and review.', 'error'); return; }
            DB.push('reviews', { id: uid('rv'), doctor: d.id, name, rating: Number(root.querySelector('#rvRating').value), date: todayISO(), text });
            close();
            toast('Thank you — your review has been added (demo).', 'success', 'Review submitted');
          };
        }
      });
      bindNewsletter();
    }
  };
}

/* ============================================================
   DEPARTMENTS
   ============================================================ */
function DepartmentsPage() {
  return {
    html: `
      ${PAGE_HEAD('Medical Departments', 'Ten specialist departments, each led by a senior consultant.', [{ label:'Departments', href:'#/departments' }])}
      <section class="section">
        <div class="container">
          <div class="grid g-3">${DATA.departments.map(deptCard).join('')}</div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

function DepartmentDetailsPage({ id }) {
  const d = DATA.departments.find(x => x.id === id);
  if (!d) return { html: PAGE_NOT_FOUND() };
  const docs = DATA.doctors.filter(x => x.dept === d.id);
  return {
    html: `
      ${PAGE_HEAD(d.name, d.tagline, [{ label:'Departments', href:'#/departments' }, { label:d.name, href:'#/department/' + d.id }])}
      <section class="section">
        <div class="container">
          <div class="split" style="align-items:start">
            <div>
              <div class="card card-pad reveal">
                <!-- ⬇️⬇️ এখানে ডিপার্টমেন্টের প্রধান আইকন বা ছবি পরিবর্তন করুন ⬇️⬇️ -->
                <div class="dept-icon" style="width:64px;height:64px;font-size:1.6rem"><i class="fa-solid ${d.icon}"></i></div>
                <!-- <div class="dept-icon" style="width:64px;height:64px"><img src="images/departments/${d.id}.jpg" alt="${esc(d.name)}"></div> -->
                <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
                <h2 class="mt-3" style="font-size:1.35rem">About ${esc(d.name)}</h2>
                <p class="text-muted mt-2" style="line-height:1.85">${esc(d.desc)}</p>
              </div>
              <div class="card card-pad mt-3 reveal">
                <h3 style="font-size:1.05rem">Treatments & procedures</h3>
                <ul class="check-list" style="margin-top:16px">
                  ${d.treatments.map(t => `<li><i class="fa-solid fa-check"></i><span>${esc(t)}</span></li>`).join('')}
                </ul>
              </div>
            </div>
            <div>
              <div class="card card-pad reveal">
                <h3 style="font-size:1.05rem">Department snapshot</h3>
                <div class="summary-rows" style="padding:0">
                  <div class="summary-row"><span>Specialists</span><b>${docs.length}</b></div>
                  <div class="summary-row"><span>Avg. experience</span><b>${docs.length ? Math.round(docs.reduce((a, b) => a + b.exp, 0) / docs.length) : 0} yrs</b></div>
                  <div class="summary-row"><span>Consultation from</span><b>${docs.length ? money(Math.min(...docs.map(x => x.fee))) : '—'}</b></div>
                  <div class="summary-row"><span>Appointments</span><b>Same week</b></div>
                </div>
                <a href="#/appointment" class="btn btn-primary btn-block mt-3">Book in ${esc(d.name)}</a>
              </div>
              <div class="card card-pad mt-3 reveal">
                <h3 style="font-size:1.05rem;margin-bottom:16px">Our specialists</h3>
                <div class="stack" style="gap:12px">
                  ${docs.map(x => `
                    <a href="#/doctor/${x.id}" class="flex" style="gap:12px;padding:10px;border-radius:12px;transition:.2s" onmouseover="this.style.background='var(--line-2)'" onmouseout="this.style.background='transparent'">
                      <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
                      ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}" class="doc-avatar img-animated" style="width:44px;height:44px">` : avatar(x.name, 44)}
                      <div style="flex:1"><b style="font-family:var(--head);font-size:.88rem;display:block;color:var(--heading)">${esc(x.name)}</b><span class="small text-muted">${esc(x.specialty)}</span></div>
                      <i class="fa-solid fa-chevron-right" style="color:var(--muted);font-size:.7rem"></i>
                    </a>`).join('') || '<p class="text-muted small">No specialists listed yet.</p>'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

/* ============================================================
   SERVICES
   ============================================================ */
function ServicesPage() {
  return {
    html: `
      ${PAGE_HEAD('Our Services', 'Comprehensive diagnostics, treatment and rehabilitation — all on-site.', [{ label:'Services', href:'#/services' }])}
      <section class="section">
        <div class="container">
          <div class="grid g-3">
            ${DATA.services.map(s => `
              <div class="svc-card reveal">
                <!-- ⬇️⬇️ এখানে সার্ভিসের আইকন বা ছবি পরিবর্তন করুন ⬇️⬇️ -->
                <div class="svc-icon"><i class="fa-solid ${s.icon}"></i></div>
                <!-- <div class="svc-icon"><img src="images/services/${s.icon}.png" alt="${esc(s.title)}"></div> -->
                <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
                <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
              </div>`).join('')}
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <div class="section-head"><span class="eyebrow">How it works</span><h2 class="mt-2">Four steps from booking to recovery</h2></div>
          <div class="grid g-4">
            ${[['01','Book online','Choose your department, doctor, date and time in under two minutes.'],
               ['02','Consultation','Meet your consultant. Expect to be listened to, not rushed.'],
               ['03','Diagnostics','Same-day lab and imaging with digital results in your portal.'],
               ['04','Follow-up','Ongoing care plans, prescriptions and reminders — all digital.']]
              .map(([n, t, d]) => `
                <div class="feature reveal">
                  <div class="f-icon" style="font-family:var(--head);font-weight:800">${n}</div>
                  <h3>${t}</h3><p>${d}</p>
                </div>`).join('')}
          </div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

/* ============================================================
   PRICING
   ============================================================ */
function PricingPage() {
  return {
    html: `
      ${PAGE_HEAD('Pricing & Membership', 'Transparent plans with no hidden fees. Cancel anytime.', [{ label:'Pricing', href:'#/pricing' }])}
      <section class="section">
        <div class="container">
          <div class="grid g-3" style="align-items:stretch">
            ${DATA.plans.map(p => `
              <div class="price-card ${p.featured ? 'featured' : ''} reveal">
                <div>
                  <h3>${esc(p.name)}</h3>
                  <div class="amt mt-2">${money(p.price)}<small>${p.period}</small></div>
                  <p class="text-muted small mt-2">${esc(p.desc)}</p>
                </div>
                <ul>
                  ${p.features.map(f => `<li><i class="fa-solid fa-check"></i><span>${esc(f)}</span></li>`).join('')}
                  ${(p.excluded || []).map(f => `<li class="no"><i class="fa-solid fa-xmark"></i><span>${esc(f)}</span></li>`).join('')}
                </ul>
                <a href="#/appointment" class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-block">Choose ${esc(p.name)}</a>
              </div>`).join('')}
          </div>
          <p class="center text-muted small mt-4">All prices are demonstration values in USD. No payment is processed — this is a frontend prototype.</p>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="section-head"><span class="eyebrow">Consultation fees</span><h2 class="mt-2">Pay per visit, no membership required</h2></div>
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th>Doctor</th><th>Department</th><th>Experience</th><th>Consultation Fee</th><th></th></tr></thead>
              <tbody>
                ${DATA.doctors.map(d => {
                  const dept = DATA.departments.find(x => x.id === d.dept);
                  return `<tr>
                    <td><div class="cell-user">
                      <!-- 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) -->
                      ${d.img ? `<img src="${d.img}" alt="${esc(d.name)}" class="doc-avatar img-animated" style="width:38px;height:38px">` : avatar(d.name, 38)}
                      <div><b>${esc(d.name)}</b><span>${esc(d.specialty)}</span></div>
                    </div></td>
                    <td>${esc(dept ? dept.name : '')}</td>
                    <td>${d.exp} years</td>
                    <td><b style="font-family:var(--head)">${money(d.fee)}</b></td>
                    <td><a href="#/appointment?doctor=${d.id}" class="btn btn-outline btn-sm">Book</a></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

/* ============================================================
   BLOG
   ============================================================ */
let blogState = { q:'', cat:'', page:1, per:6 };

function BlogPage() {
  const cats = [...new Set(DATA.posts.map(p => p.cat))];
  blogState = { q:'', cat:'', page:1, per:6 };
  return {
    html: `
      ${PAGE_HEAD('Health Blog', 'Evidence-based articles written by our own consultants.', [{ label:'Blog', href:'#/blog' }])}
      <section class="section">
        <div class="container">
          <div class="toolbar">
            <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i>
              <input id="blogSearch" type="text" placeholder="Search articles…">
            </div>
            <div class="chip-row" id="blogCats">
              <button class="chip active" data-cat="">All</button>
              ${cats.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
            </div>
          </div>
          <div id="blogResults"></div>
        </div>
      </section>
      ${NEWSLETTER()}`,
    init() {
      renderBlogResults();
      $('#blogSearch').addEventListener('input', e => { blogState.q = e.target.value; blogState.page = 1; renderBlogResults(); });
      $$('#blogCats .chip').forEach(c => c.onclick = () => {
        $$('#blogCats .chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active'); blogState.cat = c.dataset.cat; blogState.page = 1; renderBlogResults();
      });
      bindNewsletter();
    }
  };
}

function renderBlogResults() {
  const wrap = $('#blogResults');
  let list = DATA.posts.filter(p => {
    const q = blogState.q.toLowerCase();
    return (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
        && (!blogState.cat || p.cat === blogState.cat);
  });
  if (!list.length) { wrap.innerHTML = `<div class="empty"><i class="fa-regular fa-newspaper"></i><b>No articles found</b><p>Try a different keyword or category.</p></div>`; return; }
  const pages = Math.ceil(list.length / blogState.per);
  const start = (blogState.page - 1) * blogState.per;
  const slice = list.slice(start, start + blogState.per);
  wrap.innerHTML = `<div class="grid g-3">${slice.map(postCard).join('')}</div>
    ${pages > 1 ? `<div class="pagination">
      ${Array.from({ length: pages }, (_, i) => `<button class="${blogState.page === i + 1 ? 'active' : ''}" data-bpage="${i + 1}">${i + 1}</button>`).join('')}
    </div>` : ''}`;
  $$('[data-bpage]', wrap).forEach(b => b.onclick = () => { blogState.page = Number(b.dataset.bpage); renderBlogResults(); });
}

function BlogDetailsPage({ id }) {
  const p = DATA.posts.find(x => x.id === id);
  if (!p) return { html: PAGE_NOT_FOUND() };
  const authorDoc = DATA.doctors.find(x => x.name === p.author);
  const related = DATA.posts.filter(x => x.id !== p.id && x.cat === p.cat).concat(DATA.posts.filter(x => x.id !== p.id)).slice(0, 3);
  return {
    html: `
      ${PAGE_HEAD(p.title, '', [{ label:'Blog', href:'#/blog' }, { label:p.cat, href:'#/blog' }])}
      <section class="section">
        <div class="container">
          <div class="split" style="grid-template-columns:1fr 340px;align-items:start">
            <article>
              <!-- 📷 DEMO IMAGE: ব্লগ পোস্টের মূল ব্যানার ছবি (পরে পরিবর্তন করুন) -->
              <div class="post-thumb has-photo" style="border-radius:var(--r);aspect-ratio:16/7;position:relative;overflow:hidden">
                <img src="${p.img}" alt="${esc(p.title)}" class="img-animated">
              </div>
              <div class="post-meta mt-3">
                <span class="badge badge-info">${esc(p.cat)}</span>
                <span><i class="fa-regular fa-calendar"></i> ${fmtDate(p.date)}</span>
                <span><i class="fa-regular fa-clock"></i> ${p.read} min read</span>
              </div>
              <div class="prose mt-3" style="max-width:none">
                <p style="font-size:1.02rem;color:var(--text)">${esc(p.excerpt)}</p>
                <h2>Why this matters</h2>
                <p>Healthcare advice is most useful when it is specific, actionable and grounded in evidence rather than habit. This article distils the current clinical consensus into practical steps you can apply immediately.</p>
                <h2>What the evidence shows</h2>
                <p>Large cohort studies consistently demonstrate that modest, sustained changes outperform dramatic short-term interventions. The key variable is consistency — not intensity. A routine you can maintain for a year will always beat a perfect plan you abandon in three weeks.</p>
                <ul>
                  <li>Start with a single change rather than a complete overhaul.</li>
                  <li>Track the change for four weeks before adding another.</li>
                  <li>Discuss any new regimen with your consultant, particularly if you take prescription medication.</li>
                  <li>Reassess objectively at your next appointment rather than relying on how you feel.</li>
                </ul>
                <h2>When to see a specialist</h2>
                <p>Symptoms that persist beyond two weeks, worsen rapidly, or interfere with daily function deserve clinical assessment. Do not wait for a scheduled check-up if something has changed significantly.</p>
                <p><em>This article is general health information and is not a substitute for individual medical advice. Always consult a qualified clinician about your specific circumstances.</em></p>
              </div>
              <div class="card card-pad mt-3" style="display:flex;gap:16px;align-items:center">
                <!-- 📷 DEMO IMAGE: ব্লগ লেখকের ছবি (পরে পরিবর্তন করুন) -->
                ${authorDoc && authorDoc.img ? `<img src="${authorDoc.img}" alt="${esc(p.author)}" class="doc-avatar img-animated" style="width:56px;height:56px">` : avatar(p.author, 56)}
                <div><b style="font-family:var(--head);color:var(--heading)">${esc(p.author)}</b>
                  <p class="small text-muted">Consultant at MEDICARE PLUS · Author of this article</p></div>
              </div>
            </article>
            <aside>
              <div class="card card-pad">
                <h3 style="font-size:1rem;margin-bottom:16px">Related articles</h3>
                <div class="stack" style="gap:16px">
                  ${related.map(r => `
                    <a href="#/blog/${r.id}" style="display:flex;gap:12px">
                      <!-- 📷 DEMO IMAGE: সম্পর্কিত ব্লগের থাম্বনেইল ছবি (পরে পরিবর্তন করুন) -->
                      <div style="width:56px;height:56px;border-radius:12px;overflow:hidden;flex:0 0 auto">
                        <img src="${r.img}" alt="${esc(r.title)}" style="width:100%;height:100%;object-fit:cover" class="img-animated">
                      </div>
                      <div><b style="font-family:var(--head);font-size:.84rem;color:var(--heading);line-height:1.35;display:block">${esc(r.title)}</b><span class="small text-muted">${r.read} min read</span></div>
                    </a>`).join('')}
                </div>
              </div>
              <div class="card card-pad mt-3" style="background:linear-gradient(140deg,var(--navy),#124A7E);border:0">
                <h3 style="color:#fff;font-size:1rem">Need to see a doctor?</h3>
                <p class="small mt-2" style="color:#B9CEE4">Book a consultation with one of our specialists this week.</p>
                <a href="#/appointment" class="btn btn-teal btn-block mt-3">Book Appointment</a>
              </div>
            </aside>
          </div>
        </div>
      </section>`,
    init: bindNewsletter
  };
}

/* ============================================================
   CONTACT
   ============================================================ */
function ContactPage() {
  return {
    html: `
      ${PAGE_HEAD('Contact Us', 'We usually respond to messages within one business day.', [{ label:'Contact', href:'#/contact' }])}
      <section class="section">
        <div class="container">
          <div class="contact-grid">
            <div class="stack" style="gap:14px">
              ${[
                ['fa-location-dot','Clinic Address','128 Wellness Boulevard, Springfield Medical District, SP 45201'],
                ['fa-phone','Phone','+1 (555) 010-2400'],
                ['fa-envelope','Email','care@medicareplus.demo'],
                ['fa-truck-medical','Emergency Line','+1 (555) 010-2911 · 24/7'],
                ['fa-clock','Opening Hours','Mon–Sat: 8:00 AM – 8:00 PM · Sunday: Emergency only']
              ].map(([i, t, d]) => `
                <div class="info-card reveal">
                  <div class="i"><i class="fa-solid ${i}"></i></div>
                  <div><b>${t}</b><p>${esc(d)}</p></div>
                </div>`).join('')}
              <!-- 📷 DEMO IMAGE: ক্লিনিকের লোকেশন ম্যাপ/ছবি (পরে পরিবর্তন করুন) -->
              <div class="card card-pad reveal" style="padding:0;overflow:hidden;border-radius:var(--r)">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80" alt="Clinic Location Map" class="img-animated" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block">
              </div>
            </div>

            <form class="card card-pad reveal" id="contactForm" novalidate>
              <h2 style="font-size:1.3rem">Send us a message</h2>
              <p class="text-muted small mt-1" style="margin-bottom:22px">This demo form shows a success message only — nothing is transmitted.</p>
              <div class="form-row">
                <div class="field"><label>Full name <span class="req">*</span></label><input name="name" placeholder="Your name"><span class="err-msg">Please enter your name.</span></div>
                <div class="field"><label>Email <span class="req">*</span></label><input name="email" type="email" placeholder="you@example.com"><span class="err-msg">Enter a valid email address.</span></div>
              </div>
              <div class="form-row">
                <div class="field"><label>Phone</label><input name="phone" placeholder="+1 555 000 0000"></div>
                <div class="field"><label>Subject</label>
                  <select name="subject">
                    <option>General enquiry</option><option>Appointment help</option>
                    <option>Billing &amp; insurance</option><option>Feedback</option>
                  </select>
                </div>
              </div>
              <div class="field"><label>Message <span class="req">*</span></label><textarea name="message" placeholder="How can we help?"></textarea><span class="err-msg">Please enter a message.</span></div>
              <button class="btn btn-primary btn-block" type="submit"><i class="fa-regular fa-paper-plane"></i> Send message</button>
            </form>
          </div>
        </div>
      </section>
      ${NEWSLETTER()}`,
    init() {
      bindNewsletter();
      const f = $('#contactForm');
      f.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        const setErr = (name, bad) => {
          const el = f.querySelector(`[name="${name}"]`).closest('.field');
          el.classList.toggle('error', bad);
          if (bad) ok = false;
        };
        setErr('name', !f.name.value.trim());
        setErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value));
        setErr('message', !f.message.value.trim());
        if (!ok) { toast('Please correct the highlighted fields.', 'error'); return; }
        const msg = {
          id: uid('msg'), name: f.name.value.trim(), email: f.email.value.trim(),
          subject: f.subject.value, message: f.message.value.trim(), date: todayISO(), status: 'New'
        };
        DB.push('messages', msg);
        f.reset();
        openModal({
          title: 'Message sent',
          body: `<div style="text-align:center;padding:12px 0">
            <div class="success-icon" style="width:70px;height:70px;font-size:1.7rem;margin-bottom:18px"><i class="fa-solid fa-check"></i></div>
            <h3 style="margin-bottom:10px">Thank you, ${esc(msg.name)}</h3>
            <p class="text-muted small">Your message has been recorded in this demo. In a real clinic it would reach our reception team within one business day.</p>
          </div>`,
          footer: `<button class="btn btn-primary" data-close3>Done</button>`,
          onMount(root, close) { root.querySelector('[data-close3]').onclick = close; }
        });
        toast('Message recorded (demo only).', 'success');
      });
    }
  };
}

/* ============================================================
   FAQ
   ============================================================ */
function FaqPage() {
  return {
    html: `
      ${PAGE_HEAD('Frequently Asked Questions', 'Everything you need to know before your visit.', [{ label:'FAQ', href:'#/faq' }])}
      <section class="section">
        <div class="container" style="max-width:820px">
          <div class="accordion" data-multi="0">
            ${DATA.faqs.map((f, i) => `
              <div class="acc-item ${i === 0 ? 'open' : ''}">
                <button class="acc-btn" data-acc>${esc(f.q)}<i class="fa-solid fa-chevron-down"></i></button>
                <div class="acc-panel" ${i === 0 ? 'style="max-height:400px"' : ''}><div>${esc(f.a)}</div></div>
              </div>`).join('')}
          </div>
          <div class="card card-pad mt-4 center">
            <h3>Still have a question?</h3>
            <p class="text-muted small mt-2">Our reception team is available Mon–Sat, 8 AM – 8 PM.</p>
            <div class="flex mt-3" style="justify-content:center;flex-wrap:wrap">
              <a href="#/contact" class="btn btn-primary">Contact us</a>
              <a href="tel:+15550102400" class="btn btn-outline">Call +1 (555) 010-2400</a>
            </div>
          </div>
        </div>
      </section>
      ${CTA_BANNER()}`,
    init: bindNewsletter
  };
}

/* ============================================================
   AUTH
   ============================================================ */
function LoginPage() {
  return {
    html: `
      <div class="auth-wrap">
        <div class="auth-card">
          <!-- ⬇️⬇️ এখানে লগইন পেইজের লোগো পরিবর্তন করুন ⬇️⬇️ -->
          <div class="brand"><span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span>
            <!-- <span class="brand-mark"><img src="images/logo.png" alt="MEDICARE PLUS"></span> -->
            <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
            <span class="brand-text"><b>MEDICARE PLUS</b><small>Patient Portal</small></span></div>
          <h1>Welcome back</h1>
          <p>Sign in to view appointments, prescriptions and lab reports.</p>
          <div class="role-tabs" id="roleTabs">
            <button class="active" data-role="patient">Patient</button>
            <button data-role="doctor">Doctor</button>
            <button data-role="admin">Admin</button>
          </div>
          <form id="loginForm" novalidate>
            <div class="field"><label>Email address</label><input name="email" type="email" value="patient@demo.com"><span class="err-msg">Enter a valid email.</span></div>
            <div class="field"><label>Password</label><input name="password" type="password" value="demo1234"><span class="err-msg">Enter your password.</span></div>
            <div class="flex between" style="margin-bottom:18px">
              <label class="checkbox-row" style="margin:0"><input type="checkbox" checked> Remember me</label>
              <a href="#/forgot-password" class="btn-link small">Forgot password?</a>
            </div>
            <button class="btn btn-primary btn-block" type="submit">Sign in <i class="fa-solid fa-arrow-right"></i></button>
          </form>
          <div class="demo-note"><b>Demo credentials</b><br>patient@demo.com / demo1234 — any email and password combination works in this frontend prototype.</div>
          <p class="auth-alt">New patient? <a href="#/register">Create an account</a></p>
        </div>
      </div>`,
    init() {
      let role = 'patient';
      $$('#roleTabs button').forEach(b => b.onclick = () => {
        $$('#roleTabs button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); role = b.dataset.role;
        $('#loginForm').email.value = role === 'doctor' ? 'doctor@demo.com' : role === 'admin' ? 'admin@demo.com' : 'patient@demo.com';
      });
      $('#loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const f = e.target;
        let ok = true;
        const setErr = (n, bad) => { f[n].closest('.field').classList.toggle('error', bad); if (bad) ok = false; };
        setErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value));
        setErr('password', f.password.value.length < 4);
        if (!ok) { toast('Please check your credentials.', 'error'); return; }
        DB.set('session', { email: f.email.value, role, at: Date.now() });
        toast('Signed in successfully (demo).', 'success', 'Welcome back');
        setTimeout(() => { location.hash = role === 'doctor' ? '#/doctor/dashboard' : role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard'; }, 600);
      });
    }
  };
}

function RegisterPage() {
  return {
    html: `
      <div class="auth-wrap">
        <div class="auth-card" style="width:min(540px,100%)">
          <!-- ⬇️⬇️ এখানে রেজিস্ট্রেশন পেইজের লোগো পরিবর্তন করুন ⬇️⬇️ -->
          <div class="brand"><span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span>
            <!-- <span class="brand-mark"><img src="images/logo.png" alt="MEDICARE PLUS"></span> -->
            <!-- ⬆️⬆️ উপরের <i> লাইনটি মুছে ফেলুন, নিচের <img> লাইনটি ব্যবহার করুন ⬆️⬆️ -->
            <span class="brand-text"><b>MEDICARE PLUS</b><small>New Patient</small></span></div>
          <h1>Create your account</h1>
          <p>Register to book appointments and access your medical records.</p>
          <form id="regForm" novalidate>
            <div class="form-row">
              <div class="field"><label>First name</label><input name="first" placeholder="Sarah"><span class="err-msg">Required.</span></div>
              <div class="field"><label>Last name</label><input name="last" placeholder="Mitchell"><span class="err-msg">Required.</span></div>
            </div>
            <div class="field"><label>Email address</label><input name="email" type="email" placeholder="you@example.com"><span class="err-msg">Enter a valid email.</span></div>
            <div class="form-row">
              <div class="field"><label>Phone</label><input name="phone" placeholder="+1 555 000 0000"><span class="err-msg">Required.</span></div>
              <div class="field"><label>Date of birth</label><input name="dob" type="date"><span class="err-msg">Required.</span></div>
            </div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="At least 8 characters"><span class="err-msg">Minimum 8 characters.</span></div>
            <label class="checkbox-row"><input type="checkbox" name="terms"> I agree to the <a href="#/terms" style="color:var(--blue)">Terms &amp; Conditions</a> and <a href="#/privacy" style="color:var(--blue)">Privacy Policy</a>.</label>
            <button class="btn btn-primary btn-block" type="submit">Create account</button>
          </form>
          <div class="demo-note"><b>Demo only</b> — no account is created on a server. Your details are stored in this browser’s LocalStorage.</div>
          <p class="auth-alt">Already registered? <a href="#/login">Sign in</a></p>
        </div>
      </div>`,
    init() {
      const f = $('#regForm');
      f.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        const setErr = (n, bad) => { f[n].closest('.field').classList.toggle('error', bad); if (bad) ok = false; };
        setErr('first', !f.first.value.trim());
        setErr('last', !f.last.value.trim());
        setErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value));
        setErr('phone', !f.phone.value.trim());
        setErr('dob', !f.dob.value);
        setErr('password', f.password.value.length < 8);
        if (!f.terms.checked) { ok = false; toast('Please accept the Terms & Conditions.', 'error'); }
        if (!ok) return;
        DB.set('profile', {
          name: f.first.value.trim() + ' ' + f.last.value.trim(),
          email: f.email.value.trim(), phone: f.phone.value.trim(),
          dob: f.dob.value, age: new Date().getFullYear() - new Date(f.dob.value).getFullYear(),
          gender: 'Not specified', blood: '—', address: '—', since: String(new Date().getFullYear())
        });
        toast('Account created (demo). Please sign in.', 'success', 'Registration complete');
        setTimeout(() => location.hash = '#/login', 900);
      });
    }
  };
}

function ForgotPage() {
  return {
    html: `
      <div class="auth-wrap">
        <div class="auth-card">
          <div class="brand"><span class="brand-mark"><i class="fa-solid fa-heart-pulse"></i></span></div>
          <h1>Reset your password</h1>
          <p>Enter your email and we’ll send a reset link.</p>
          <form id="fpForm" novalidate>
            <div class="field"><label>Email address</label><input name="email" type="email" placeholder="you@example.com"><span class="err-msg">Enter a valid email.</span></div>
            <button class="btn btn-primary btn-block" type="submit">Send reset link</button>
          </form>
          <div class="demo-note"><b>Demo only</b> — no email is sent. A confirmation message is shown for demonstration purposes.</div>
          <p class="auth-alt"><a href="#/login">← Back to sign in</a></p>
        </div>
      </div>`,
    init() {
      const f = $('#fpForm');
      f.addEventListener('submit', e => {
        e.preventDefault();
        const bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value);
        f.email.closest('.field').classList.toggle('error', bad);
        if (bad) return;
        openModal({
          title: 'Check your inbox',
          body: `<div style="text-align:center;padding:10px 0">
            <div class="success-icon" style="width:70px;height:70px;font-size:1.6rem;margin-bottom:16px"><i class="fa-regular fa-envelope"></i></div>
            <p class="text-muted">If an account exists for <b>${esc(f.email.value)}</b>, a reset link would be sent shortly.</p>
            <p class="small text-muted mt-2">This is a frontend demo — no email is actually dispatched.</p></div>`,
          footer: `<button class="btn btn-primary" data-close4>Got it</button>`,
          onMount(root, close) { root.querySelector('[data-close4]').onclick = close; }
        });
        f.reset();
      });
    }
  };
}

/* ============================================================
   LEGAL
   ============================================================ */
function legalPage(title, sections) {
  return {
    html: `
      ${PAGE_HEAD(title, '', [{ label: title, href: '#' }])}
      <section class="section">
        <div class="container">
          <div class="prose">
            <div class="updated"><strong>Last updated:</strong> ${fmtDate(todayISO())} · This is a demonstration document for a frontend-only prototype.</div>
            ${sections.map(s => `<h2>${esc(s.h)}</h2>${s.p.map(t => `<p>${esc(t)}</p>`).join('')}${s.list ? `<ul>${s.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`).join('')}
          </div>
        </div>
      </section>`,
    init: bindNewsletter
  };
}

const PrivacyPage = () => legalPage('Privacy Policy', [
  { h:'1. Information we collect', p:['In a production deployment, MEDICARE PLUS would collect personal details necessary to deliver healthcare services, including your name, contact information, date of birth, medical history and insurance details.'], list:['Contact details you provide when booking an appointment.','Clinical information recorded by your treating consultant.','Technical data such as browser type and pages visited.'] },
  { h:'2. How we use your information', p:['Your information would be used strictly to deliver care, process appointments, manage billing and meet legal obligations. We would never sell personal or clinical data to third parties.'], list:['Scheduling and confirming appointments.','Maintaining accurate medical records.','Communicating results, reminders and follow-up plans.'] },
  { h:'3. This prototype', p:['This website is a frontend demonstration. No data is transmitted to any server. Any information you enter is stored only in your own browser’s LocalStorage and can be cleared at any time from your browser settings.'] },
  { h:'4. Data security', p:['A production system would encrypt data in transit and at rest, enforce role-based access controls, and maintain an auditable access log in line with healthcare data protection standards.'] },
  { h:'5. Your rights', p:['You would have the right to access, correct, export or request deletion of your personal data, and to withdraw consent for non-essential processing at any time.'], list:['Request a copy of your records.','Request corrections to inaccurate data.','Request deletion where legally permissible.'] },
  { h:'6. Contact', p:['Questions about privacy can be directed to privacy@medicareplus.demo or by calling +1 (555) 010-2400.'] }
]);

const TermsPage = () => legalPage('Terms & Conditions', [
  { h:'1. Acceptance of terms', p:['By accessing this website you agree to these terms. If you do not agree, please discontinue use of the site.'] },
  { h:'2. Demonstration notice', p:['MEDICARE PLUS as presented here is a frontend portfolio project. It is not a real medical provider. No appointment, prescription, diagnosis or payment generated by this site is genuine or binding.'] },
  { h:'3. No medical advice', p:['Content on this site is general health information and must not be relied upon as a substitute for professional medical advice. Always consult a qualified clinician regarding your own circumstances.'] },
  { h:'4. Appointments and bookings', p:['Bookings created here are stored only in your browser and are not sent to any clinic. They exist purely to demonstrate the booking interface.'] },
  { h:'5. Acceptable use', p:['You agree not to misuse this site, attempt unauthorised access, or use automated tools to scrape content without permission.'], list:['Do not submit unlawful or harmful content.','Do not attempt to disrupt the service.','Do not impersonate another person.'] },
  { h:'6. Limitation of liability', p:['To the maximum extent permitted by law, the authors of this demonstration accept no liability for any loss arising from use of this website or reliance on its content.'] },
  { h:'7. Changes', p:['These terms may be updated periodically. Continued use of the site after changes constitutes acceptance of the revised terms.'] }
]);

/* ============================================================
   404
   ============================================================ */
function PAGE_NOT_FOUND() {
  return `
    <div class="err-page">
      <div>
        <div class="err-code">404</div>
        <h1 style="margin-top:16px">Page not found</h1>
        <p class="lead mt-2" style="max-width:460px;margin-inline:auto">The page you're looking for doesn't exist or may have been moved.</p>
        <div class="flex mt-3" style="justify-content:center;flex-wrap:wrap">
          <a href="#/" class="btn btn-primary"><i class="fa-solid fa-house"></i> Back to home</a>
          <a href="#/doctors" class="btn btn-outline">Find a doctor</a>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   ROUTE REGISTRATION
   ============================================================ */
route('/', HomePage);
route('/about', AboutPage);
route('/doctors', DoctorsPage);
route('/doctor/:id', DoctorDetailsPage);
route('/departments', DepartmentsPage);
route('/department/:id', DepartmentDetailsPage);
route('/services', ServicesPage);
route('/pricing', PricingPage);
route('/blog', BlogPage);
route('/blog/:id', BlogDetailsPage);
route('/contact', ContactPage);
route('/faq', FaqPage);
route('/login', LoginPage);
route('/register', RegisterPage);
route('/forgot-password', ForgotPage);
route('/privacy', PrivacyPage);
route('/terms', TermsPage);
