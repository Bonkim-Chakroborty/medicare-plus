/* ============================================================
   MEDICARE PLUS — demo-data.js
   All data is 100% local demo data. No backend is involved.
   ============================================================ */

const DATA = {

  timeSlots: ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
              '12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM',
              '04:30 PM','05:00 PM','05:30 PM'],

  departments: [
    { id:'cardiology',   name:'Cardiology',       icon:'fa-heart-pulse',        tagline:'Heart & vascular care',
      desc:'Comprehensive cardiac evaluation, interventional procedures and long-term heart-health management led by board-certified cardiologists.',
      treatments:['Coronary Angiography','Echocardiography','Stress Testing','Pacemaker Implantation','Hypertension Management','Cardiac Rehabilitation'] },
    { id:'neurology',    name:'Neurology',        icon:'fa-brain',              tagline:'Brain, spine & nerves',
      desc:'Advanced neurological diagnostics and treatment for disorders of the brain, spinal cord and peripheral nervous system.',
      treatments:['EEG & EMG','Stroke Care','Migraine Clinic','Epilepsy Management','Parkinson’s Care','Memory Assessment'] },
    { id:'orthopedics',  name:'Orthopedics',      icon:'fa-bone',               tagline:'Bones, joints & mobility',
      desc:'Surgical and non-surgical orthopaedic care focused on restoring movement, relieving pain and rebuilding strength.',
      treatments:['Joint Replacement','Sports Injury Care','Arthroscopy','Fracture Management','Spine Surgery','Physiotherapy'] },
    { id:'dermatology',  name:'Dermatology',      icon:'fa-hand-dots',          tagline:'Skin, hair & nails',
      desc:'Medical and aesthetic dermatology for skin health, chronic conditions and evidence-based cosmetic procedures.',
      treatments:['Acne Treatment','Laser Therapy','Eczema Care','Hair Loss Clinic','Skin Allergy Testing','Mole Screening'] },
    { id:'pediatrics',   name:'Pediatrics',       icon:'fa-baby',               tagline:'Care for growing children',
      desc:'Child-friendly care from newborn screening to adolescent health, with dedicated vaccination and growth monitoring.',
      treatments:['Newborn Screening','Vaccination','Growth Monitoring','Pediatric Asthma','Nutrition Counselling','Developmental Assessment'] },
    { id:'gynecology',   name:'Gynecology',       icon:'fa-person-pregnant',    tagline:'Women’s health',
      desc:'Complete women’s health services covering reproductive care, pregnancy, fertility and menopause management.',
      treatments:['Antenatal Care','Fertility Assessment','Laparoscopic Surgery','PCOS Management','Menopause Care','Cervical Screening'] },
    { id:'dentistry',    name:'Dentistry',        icon:'fa-tooth',              tagline:'Complete dental care',
      desc:'Preventive, restorative and cosmetic dentistry in a calm, modern environment with digital imaging.',
      treatments:['Root Canal','Teeth Whitening','Orthodontics','Dental Implants','Scaling & Polishing','Pediatric Dentistry'] },
    { id:'general',      name:'General Medicine', icon:'fa-stethoscope',        tagline:'Primary & preventive care',
      desc:'Your first point of contact for everyday illness, chronic disease management and annual health screening.',
      treatments:['Health Screening','Diabetes Management','Fever & Infection','Vaccination','Lifestyle Counselling','Referral Coordination'] },
    { id:'ent',          name:'ENT',              icon:'fa-ear-listen',         tagline:'Ear, nose & throat',
      desc:'Diagnosis and treatment for hearing, sinus, voice and balance disorders across all age groups.',
      treatments:['Hearing Tests','Sinus Surgery','Tonsillectomy','Voice Clinic','Vertigo Treatment','Allergy Management'] },
    { id:'ophthalmology',name:'Ophthalmology',    icon:'fa-eye',                tagline:'Vision & eye health',
      desc:'Complete eye care from routine vision testing to advanced cataract and retinal procedures.',
      treatments:['Vision Testing','Cataract Surgery','Glaucoma Care','Retina Screening','Contact Lens Fitting','Dry Eye Clinic'] }
  ],

  doctors: [
    { id:'d1', name:'Dr. Ayesha Rahman',   dept:'cardiology',    specialty:'Interventional Cardiologist', qual:'MBBS, MD, DM (Cardiology)', exp:14, fee:120, rating:4.9, reviews:218, days:['Mon','Tue','Thu','Sat'], lang:['English','Bengali'], gender:'female',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Ayesha Rahman is an interventional cardiologist with 14 years of experience treating complex coronary artery disease. She has performed over 2,000 angioplasty procedures and leads the clinic’s preventive cardiology programme, focusing on early detection and lifestyle-based risk reduction.' },
    { id:'d2', name:'Dr. Marcus Chen',     dept:'neurology',     specialty:'Consultant Neurologist',      qual:'MBBS, MD, MRCP (Neurology)', exp:18, fee:150, rating:4.8, reviews:176, days:['Mon','Wed','Fri'], lang:['English','Mandarin'], gender:'male',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Marcus Chen specialises in stroke prevention, epilepsy and movement disorders. He combines advanced neuro-imaging with personalised rehabilitation plans, and has published research on early stroke intervention.' },
    { id:'d3', name:'Dr. Sofia Alvarez',   dept:'orthopedics',   specialty:'Orthopaedic Surgeon',         qual:'MBBS, MS (Ortho), FRCS', exp:16, fee:140, rating:4.9, reviews:204, days:['Tue','Thu','Sat'], lang:['English','Spanish'], gender:'female',
      img: 'https://images.unsplash.com/photo-1594824813501-48c520857313?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Sofia Alvarez is a joint-replacement and sports-injury specialist. She uses minimally invasive arthroscopic techniques to shorten recovery times and has worked with professional athletes across three continents.' },
    { id:'d4', name:'Dr. Imran Hossain',   dept:'dermatology',   specialty:'Dermatologist & Cosmetologist', qual:'MBBS, MD (Dermatology)', exp:11, fee:95, rating:4.7, reviews:143, days:['Mon','Wed','Sat'], lang:['English','Bengali','Hindi'], gender:'male',
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Imran Hossain treats chronic skin conditions such as psoriasis and eczema alongside evidence-based aesthetic procedures. He is known for a patient-first approach and clear, jargon-free explanations.' },
    { id:'d5', name:'Dr. Priya Nair',      dept:'pediatrics',    specialty:'Consultant Pediatrician',     qual:'MBBS, MD (Pediatrics)', exp:13, fee:85, rating:5.0, reviews:312, days:['Mon','Tue','Wed','Thu','Fri'], lang:['English','Hindi','Malayalam'], gender:'female',
      img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Priya Nair has cared for more than 12,000 children over her career. Her clinic focuses on developmental milestones, nutrition and childhood asthma, and she is a strong advocate of parent education.' },
    { id:'d6', name:'Dr. Layla Hassan',    dept:'gynecology',    specialty:'Obstetrician & Gynecologist', qual:'MBBS, MS (OBGYN)', exp:15, fee:110, rating:4.9, reviews:267, days:['Tue','Thu','Fri'], lang:['English','Arabic'], gender:'female',
      img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Layla Hassan provides compassionate care across pregnancy, fertility and menopause. She has a special interest in laparoscopic surgery and high-risk pregnancy management.' },
    { id:'d7', name:'Dr. Daniel Okafor',   dept:'dentistry',     specialty:'Dental Surgeon',              qual:'BDS, MDS (Prosthodontics)', exp:9,  fee:70, rating:4.8, reviews:189, days:['Mon','Tue','Thu','Sat'], lang:['English'], gender:'male',
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Daniel Okafor focuses on restorative and cosmetic dentistry, including implants and full-mouth rehabilitation. He is certified in digital smile design and gentle sedation dentistry.' },
    { id:'d8', name:'Dr. Emily Watson',    dept:'general',       specialty:'General Physician',           qual:'MBBS, MRCP (Internal Medicine)', exp:12, fee:60, rating:4.8, reviews:401, days:['Mon','Tue','Wed','Thu','Fri','Sat'], lang:['English'], gender:'female',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Emily Watson manages chronic conditions such as diabetes and hypertension, and coordinates annual health screening programmes. She believes preventive care is the highest-value medicine.' },
    { id:'d9', name:'Dr. Rajesh Kumar',    dept:'ent',           specialty:'ENT Specialist',              qual:'MBBS, MS (ENT)', exp:17, fee:90, rating:4.7, reviews:158, days:['Wed','Thu','Fri'], lang:['English','Hindi'], gender:'male',
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Rajesh Kumar treats hearing loss, chronic sinusitis and voice disorders. He performs endoscopic sinus surgery and runs a dedicated vertigo clinic.' },
    { id:'d10',name:'Dr. Nadia Petrova',   dept:'ophthalmology', specialty:'Ophthalmic Surgeon',          qual:'MBBS, MS (Ophthalmology)', exp:20, fee:130, rating:4.9, reviews:231, days:['Mon','Wed','Fri'], lang:['English','Russian'], gender:'female',
      img: 'https://images.unsplash.com/photo-1594824813501-48c520857313?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Nadia Petrova has performed over 5,000 cataract surgeries using premium intraocular lenses. She also leads the clinic’s diabetic retinopathy screening service.' },
    { id:'d11',name:'Dr. Samuel Adeyemi',  dept:'cardiology',    specialty:'Consultant Cardiologist',     qual:'MBBS, MD (Cardiology)', exp:10, fee:105, rating:4.6, reviews:124, days:['Mon','Tue','Fri'], lang:['English'], gender:'male',
      img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Samuel Adeyemi specialises in heart-failure management and non-invasive cardiac imaging. He runs the clinic’s cardiac rehabilitation and lifestyle programme.' },
    { id:'d12',name:'Dr. Hana Suzuki',     dept:'neurology',     specialty:'Neurologist & Sleep Specialist', qual:'MBBS, MD, PhD (Neurology)', exp:13, fee:135, rating:4.9, reviews:167, days:['Tue','Wed','Sat'], lang:['English','Japanese'], gender:'female',
      img: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=400&q=80', /* 📷 DEMO IMAGE: ডাক্তারের ছবি (পরে পরিবর্তন করুন) */
      bio:'Dr. Hana Suzuki treats sleep disorders, chronic migraine and neuropathy. She established the clinic’s sleep laboratory and advocates for non-pharmacological first-line treatment.' }
  ],

  services: [
    { icon:'fa-user-doctor',      title:'Specialist Consultation',  text:'One-to-one consultations with senior consultants across ten medical specialties.' },
    { icon:'fa-flask-vial',       title:'Diagnostic Laboratory',    text:'Same-day pathology with an accredited on-site lab and digital result delivery.' },
    { icon:'fa-x-ray',            title:'Advanced Imaging',         text:'Digital X-ray, ultrasound, CT and MRI performed by experienced radiographers.' },
    { icon:'fa-truck-medical',    title:'Emergency Care',           text:'24/7 urgent care with rapid triage and a fully equipped resuscitation bay.' },
    { icon:'fa-syringe',          title:'Vaccination Programme',    text:'Childhood, travel and seasonal immunisation delivered by trained nurses.' },
    { icon:'fa-heart-circle-check',title:'Health Screening',        text:'Structured annual packages tailored by age, gender and family history.' },
    { icon:'fa-laptop-medical',   title:'Teleconsultation',         text:'Secure video appointments with your consultant when visiting isn’t possible.' },
    { icon:'fa-pills',            title:'Pharmacy',                 text:'On-site pharmacy with prescription dispensing and medication counselling.' },
    { icon:'fa-person-walking',   title:'Rehabilitation & Physio',  text:'Guided recovery programmes for orthopaedic, cardiac and neurological patients.' }
  ],

  posts: [
    { id:'b1', title:'7 Everyday Habits That Protect Your Heart', cat:'Cardiology', author:'Dr. Ayesha Rahman', date:'2025-01-14', read:6, icon:'fa-heart-pulse',
      img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Small, consistent choices matter far more than dramatic lifestyle overhauls. Here are seven habits cardiologists actually practise themselves.' },
    { id:'b2', title:'Understanding Your Annual Blood Test Results', cat:'Preventive Care', author:'Dr. Emily Watson', date:'2025-01-08', read:8, icon:'fa-flask-vial',
      img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Haemoglobin, HbA1c, cholesterol, TSH — what these numbers really mean and when a value genuinely deserves attention.' },
    { id:'b3', title:'When Should a Headache Worry You?', cat:'Neurology', author:'Dr. Marcus Chen', date:'2024-12-27', read:5, icon:'fa-brain',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Most headaches are benign. A neurologist explains the specific red-flag patterns that justify urgent assessment.' },
    { id:'b4', title:'Childhood Vaccination: A Parent’s Complete Guide', cat:'Pediatrics', author:'Dr. Priya Nair', date:'2024-12-19', read:9, icon:'fa-syringe',
      img: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'A clear, schedule-by-schedule walkthrough of the standard childhood immunisation timeline and what to expect afterwards.' },
    { id:'b5', title:'Managing Joint Pain Without Surgery', cat:'Orthopedics', author:'Dr. Sofia Alvarez', date:'2024-12-11', read:7, icon:'fa-bone',
      img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Physiotherapy, targeted strengthening and weight management can delay or remove the need for joint replacement in many cases.' },
    { id:'b6', title:'Skin Care Myths Dermatologists Want to Retire', cat:'Dermatology', author:'Dr. Imran Hossain', date:'2024-12-03', read:6, icon:'fa-hand-dots',
      img: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'From “pores open and close” to “natural means safe” — six persistent myths and what the evidence actually shows.' },
    { id:'b7', title:'Sleep and Your Immune System', cat:'Wellness', author:'Dr. Hana Suzuki', date:'2024-11-24', read:5, icon:'fa-moon',
      img: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Consistent sleep timing may be as important as duration. A sleep specialist explains the immune cost of irregular rest.' },
    { id:'b8', title:'Pregnancy Nutrition: What Actually Matters', cat:'Gynecology', author:'Dr. Layla Hassan', date:'2024-11-15', read:8, icon:'fa-person-pregnant',
      img: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80', /* 📷 DEMO IMAGE: ব্লগের ছবি (পরে পরিবর্তন করুন) */
      excerpt:'Beyond the generic advice — the nutrients with real evidence behind them, and the supplements you can safely skip.' }
  ],

  testimonials: [
    { name:'Sarah Mitchell',  role:'Cardiology patient',    rating:5, img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'From the first consultation to my follow-up, everything was calm and clearly explained. Dr. Rahman took the time to answer every question without rushing.' },
    { name:'Ahmed Karim',     role:'Orthopedics patient',   rating:5, img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'I was told elsewhere I needed a full knee replacement. Dr. Alvarez recommended targeted physiotherapy first — eight months later I am walking pain-free.' },
    { name:'Linda Osei',      role:'Pediatrics parent',     rating:5, img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'My daughter used to be terrified of clinics. The team here made her laugh through her vaccination. That alone earns five stars.' },
    { name:'David Ferreira',  role:'General medicine',      rating:4, img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'Booking took under two minutes and I was seen exactly on time. The lab results arrived on my phone the same evening.' },
    { name:'Meera Pillai',    role:'Gynecology patient',    rating:5, img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'Dr. Hassan was extraordinarily kind during a difficult pregnancy. I never once felt like a number on a list.' },
    { name:'James Turner',    role:'Dermatology patient',   rating:5, img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', /* 📷 DEMO IMAGE: রোগীর ছবি */ text:'Years of eczema cleared up in three months with a plan I could actually follow. Clear instructions, realistic expectations.' }
  ],

  faqs: [
    { q:'How do I book an appointment?', a:'Use the Book Appointment button anywhere on the site, or call our reception on +1 (555) 010-2400. The online booking wizard walks you through department, doctor, date, time and your details in under two minutes.' },
    { q:'Do I need a referral to see a specialist?', a:'No referral is required for most of our specialists. However, if your insurance provider requires one, please bring it to your appointment to avoid billing complications.' },
    { q:'What should I bring to my first visit?', a:'Please bring a photo ID, your insurance card, a list of current medications and any previous test results or imaging relevant to your concern.' },
    { q:'How long does a consultation take?', a:'A standard first consultation is scheduled for 30 minutes. Follow-up appointments are typically 15 to 20 minutes. Complex cases may be allotted additional time.' },
    { q:'Do you offer teleconsultation?', a:'Yes. Video consultations are available with most consultants. You will receive a secure link by email and SMS approximately 15 minutes before your scheduled time.' },
    { q:'Can I reschedule or cancel my appointment?', a:'Yes. You can reschedule or cancel free of charge up to 12 hours before your appointment through the patient portal or by calling reception.' },
    { q:'Is parking available at the clinic?', a:'Yes, we have a covered multi-level car park with dedicated accessible bays directly beneath the main building. The first two hours are complimentary for patients.' },
    { q:'Which insurance providers do you accept?', a:'We work with most major national and international insurers. Please contact our billing team with your policy details and we will confirm coverage before your visit.' }
  ],

  plans: [
    { name:'Essential', price:39, period:'/month', featured:false,
      desc:'Everyday cover for individuals who want quick access to primary care.',
      features:['2 general consultations / month','Basic blood panel annually','Nurse helpline access','Digital prescription delivery','10% off diagnostics'],
      excluded:['Specialist consultations','Imaging (CT / MRI)','Teleconsultation'] },
    { name:'Premium', price:89, period:'/month', featured:true,
      desc:'Our most popular plan — full specialist access with priority booking.',
      features:['Unlimited general consultations','4 specialist consultations / month','Annual full health screening','Priority appointment booking','Unlimited teleconsultation','20% off diagnostics & imaging','Dedicated care coordinator'],
      excluded:['Surgical procedures'] },
    { name:'Family Plus', price:149, period:'/month', featured:false,
      desc:'Comprehensive cover for two adults and up to three children.',
      features:['Everything in Premium, ×4 members','Pediatric consultations included','Childhood vaccination programme','Family health screening annually','24/7 emergency assistance','25% off diagnostics & imaging','Two dental cleanings per member'],
      excluded:[] }
  ],

  reviews: [
    { id:'r1', doctor:'d1', name:'Sarah Mitchell', rating:5, date:'2025-01-12', text:'Extremely thorough and patient. Explained every test result in plain language.' },
    { id:'r2', doctor:'d1', name:'Omar Faruk',     rating:5, date:'2025-01-04', text:'Best cardiology consultation I have had. Never felt rushed.' },
    { id:'r3', doctor:'d3', name:'Ahmed Karim',    rating:5, date:'2024-12-28', text:'Honest advice — recommended physiotherapy over surgery and it worked.' },
    { id:'r4', doctor:'d5', name:'Linda Osei',     rating:5, date:'2024-12-20', text:'Wonderful with children. My daughter actually looks forward to visits now.' },
    { id:'r5', doctor:'d2', name:'James Turner',   rating:4, date:'2024-12-14', text:'Very knowledgeable. Appointment started exactly on time.' },
    { id:'r6', doctor:'d6', name:'Meera Pillai',   rating:5, date:'2024-12-06', text:'Compassionate and reassuring throughout a difficult pregnancy.' }
  ],

  patientSeed: { name:'Sarah Mitchell', email:'patient@demo.com', phone:'+1 555 010 7788', age:34, gender:'Female', blood:'O+', address:'42 Lakeview Avenue, Springfield', since:'2022' },

  appointmentSeed: [
    { id:'MP-8K2P4Q', doctorId:'d1', dept:'cardiology', date:'2025-02-18', time:'10:30 AM', patient:'Sarah Mitchell', email:'patient@demo.com', phone:'+1 555 010 7788', status:'Confirmed', fee:120, reason:'Routine cardiac follow-up and blood pressure review.' },
    { id:'MP-3M7R9T', doctorId:'d5', dept:'pediatrics', date:'2025-02-24', time:'02:00 PM', patient:'Sarah Mitchell', email:'patient@demo.com', phone:'+1 555 010 7788', status:'Pending', fee:85, reason:'Child’s annual growth and development check.' },
    { id:'MP-1A5C8E', doctorId:'d8', dept:'general', date:'2024-11-09', time:'09:30 AM', patient:'Sarah Mitchell', email:'patient@demo.com', phone:'+1 555 010 7788', status:'Completed', fee:60, reason:'Seasonal flu symptoms and persistent cough.' }
  ],

  prescriptionSeed: [
    { id:'RX-2201', patient:'Sarah Mitchell', email:'patient@demo.com', doctorId:'d1', date:'2024-11-10', diagnosis:'Stage 1 hypertension',
      meds:[ {name:'Amlodipine 5 mg', dose:'1 tablet', freq:'Once daily (morning)', dur:'90 days'},
             {name:'Aspirin 75 mg',   dose:'1 tablet', freq:'Once daily (after food)', dur:'90 days'} ],
      advice:'Reduce dietary sodium below 2 g per day. 30 minutes of brisk walking, 5 days a week. Home BP log twice weekly.', status:'Active' },
    { id:'RX-2198', patient:'Sarah Mitchell', email:'patient@demo.com', doctorId:'d8', date:'2024-11-09', diagnosis:'Acute viral upper respiratory infection',
      meds:[ {name:'Paracetamol 500 mg', dose:'1 tablet', freq:'Every 6 hours as needed', dur:'5 days'},
             {name:'Saline nasal spray', dose:'2 sprays', freq:'Three times daily', dur:'7 days'} ],
      advice:'Rest, increase fluid intake, steam inhalation twice daily. Return if fever persists beyond 72 hours.', status:'Completed' }
  ],

  labSeed: [
    { id:'LR-4412', patient:'Sarah Mitchell', email:'patient@demo.com', test:'Lipid Profile', date:'2025-01-09', status:'Ready',
      results:[ {name:'Total Cholesterol', value:'214 mg/dL', range:'< 200', flag:'high'},
                {name:'LDL Cholesterol',   value:'138 mg/dL', range:'< 100', flag:'high'},
                {name:'HDL Cholesterol',   value:'52 mg/dL',  range:'> 40',  flag:'ok'},
                {name:'Triglycerides',     value:'120 mg/dL', range:'< 150', flag:'ok'} ] },
    { id:'LR-4388', patient:'Sarah Mitchell', email:'patient@demo.com', test:'Complete Blood Count', date:'2024-11-10', status:'Ready',
      results:[ {name:'Haemoglobin',  value:'13.4 g/dL', range:'12.0 – 15.5', flag:'ok'},
                {name:'WBC',          value:'7.2 K/µL', range:'4.0 – 11.0', flag:'ok'},
                {name:'Platelets',    value:'248 K/µL', range:'150 – 400', flag:'ok'} ] },
    { id:'LR-4460', patient:'Sarah Mitchell', email:'patient@demo.com', test:'HbA1c', date:'2025-02-02', status:'Processing', results:[] }
  ],

  notificationSeed: [
    { id:'n1', title:'Appointment confirmed', text:'Your cardiology appointment with Dr. Ayesha Rahman is confirmed for 18 Feb at 10:30 AM.', time:'2 hours ago', read:false, type:'ok' },
    { id:'n2', title:'Lab report ready', text:'Your Lipid Profile report (LR-4412) is now available to download.', time:'Yesterday', read:false, type:'info' },
    { id:'n3', title:'Prescription refill due', text:'Amlodipine 5 mg refill is due in 7 days. Request a refill from your portal.', time:'3 days ago', read:true, type:'warn' },
    { id:'n4', title:'Appointment reminder', text:'Reminder: pediatrics appointment on 24 Feb at 2:00 PM.', time:'4 days ago', read:true, type:'info' }
  ],

  messageSeed: [
    { id:'m1', name:'Robert Lang',  email:'r.lang@example.com', subject:'Insurance coverage question', message:'Could you confirm whether the Premium plan covers MRI imaging?', date:'2025-02-06', status:'New' },
    { id:'m2', name:'Nina Patel',   email:'n.patel@example.com', subject:'Rescheduling appointment', message:'I need to move my Thursday appointment to the following week.', date:'2025-02-05', status:'Read' },
    { id:'m3', name:'Carlos Mendez',email:'c.mendez@example.com', subject:'Feedback on visit', message:'Excellent care from the nursing team last week — thank you.', date:'2025-02-02', status:'Read' }
  ]
};

/* ---------- Seed LocalStorage once ---------- */
function seedDemoData(){
  if (localStorage.getItem('mp_seeded')) return;
  const s = (k,v) => localStorage.setItem('mp_'+k, JSON.stringify(v));
  s('appointments', DATA.appointmentSeed);
  s('prescriptions', DATA.prescriptionSeed);
  s('labs', DATA.labSeed);
  s('notifications', DATA.notificationSeed);
  s('messages', DATA.messageSeed);
  s('reviews', DATA.reviews);
  s('profile', DATA.patientSeed);
  s('doctorsExtra', []);
  s('seeded', true);
}