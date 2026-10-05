import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Menu, X, LogIn, UserPlus, GraduationCap, BriefcaseBusiness, Users, Target, CalendarDays, MapPin, Mail, Phone, Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from './lib/supabase';
import logo from "./images/DOA-LOGO-transparent.png";

const publicImages = `${import.meta.env.BASE_URL}images/`;

const academy = {
  founder: { name: 'DanielOwoAbasi.', title: 'Founder & Lead Mentor', bio: 'The Academy By DOA exists to help young people turn potential into professional excellence through practical business education, career development, leadership and mentorship.' },

  registration: { start: '2026-10-05', end: '2026-11-15' },

  location: { address: 'K52 Ewet Housing Estate, Uyo, Akwa Ibom State', lat: 5.0389, lng: 7.9090 }
};

const programs = [['Business & Entrepreneurship', 'Business models, strategy, customer discovery, finance basics and execution.', BriefcaseBusiness], ['Career Development', 'CVs, interviews, personal branding, workplace readiness and career planning.', GraduationCap], ['Leadership & Soft Skills', 'Communication, teamwork, confidence, emotional intelligence and leadership.', Users], ['Professional Mentorship', 'Guidance, accountability and exposure through mentors and practical projects.', Target]];

const events = [['2026-10-24', 'Cohort 1 Professional Development Week', 'Workshops, presentations, networking and career preparation.'], ['2026-11-07', 'Founder’s Business Masterclass', 'An interactive session on turning ideas into sustainable businesses.'], ['2026-11-14', 'Career & CV Clinic', 'Guidance for CVs, interviews, personal branding and career direction.']];

const imgs = ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5', 'gallery-6'];

function NavDrop({ label, items, onGo }) {
  return <div className="nav-dropdown"><button className="nav-link">{label}<ChevronDown size={14} /></button><div className="dropdown-menu">{items.map(([id, t]) => <button key={id} onClick={() => onGo(id)}>{t}</button>)}</div></div>
}

function Section({ id, eyebrow, title, text, children }) {
  return <section id={id} className="section"><div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{children}</section>
}

function Modal({ children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal"><button className="close-modal" onClick={onClose}><X /></button>{children}</div></div>
}

function SignupModal({ onClose }) {
  const [mode, setMode] = useState('choice');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', education: '', program: 'Business & Career Foundations' });

  const [busy, setBusy] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const google = async () => {
    if (!supabase) return alert('Connect Supabase in .env first.');

    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); if (error) alert(error.message)
  };

  const submit = async e => {
    e.preventDefault(); if (!supabase) return alert('Connect Supabase in .env first.'); setBusy(true);

    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name, phone: form.phone, education: form.education, program: form.program } } }); setBusy(false); if (error) return alert(error.message); alert('Account created. Check your Gmail if email confirmation is enabled.'); onClose()
  };
  return <Modal onClose={onClose}>
    <div className="modal-head">
      <span className="eyebrow">Student account</span>
      <h2>Create account</h2>
      <p>Choose how you want to sign up.</p>
    </div>{mode === 'choice' ?
      <div className="signup-choices">
        <button className="google-btn" onClick={google}>
          <span className="google-g">G</span> Continue with Gmail <ExternalLink size={15} />
        </button>
        <button className="primary-btn" onClick={() => setMode('form')}>
          <UserPlus size={17} /> Complete sign-up form
        </button>
        <p className="small-note">Gmail sign-up uses Google authentication. The complete form creates student account with your details.</p>
      </div> :
      <form className="form-grid" onSubmit={submit}>
        {[['name', 'Full name', 'text'], ['email', 'Gmail / Email', 'email'], ['phone', 'Phone number', 'text'], ['password', 'Password', 'password'], ['education', 'School / Education', 'text']].map(([n, l, t]) =>
          <label key={n} className={n === 'education' ? 'full' : ''}>{l}
            <input required name={n} type={t} value={form[n]} onChange={change} minLength={n === 'password' ? 6 : undefined} />
          </label>)}
        <label className="full">Preferred program
          <select name="program" value={form.program} onChange={change}>
            <option>Business & Career Foundations</option>
            <option>Entrepreneurship</option>
            <option>Leadership & Professional Skills</option>
            <option>Career Development</option>
          </select>
        </label>
        <div className="full modal-actions">
          <button type="button" className="ghost-btn" onClick={() => setMode('choice')}>
            Back
          </button>
          <button className="primary-btn">{busy ? 'Creating…' : 'Create student account'}     <ArrowRight size={17} />
          </button>
        </div>
      </form>}
  </Modal>
}

function Enrollment({ onClose }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', program: 'Business & Career Foundations' });

  const [busy, setBusy] = useState(false);
  const change = e => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); if (!supabase) return alert('Connect Supabase in .env first.'); setBusy(true);

    const { error } = await supabase.from('students').insert([{ full_name: f.name, email: f.email, phone: f.phone, program: f.program }]); setBusy(false); if (error) return alert(error.message); alert('Enrollment submitted successfully.'); onClose()
  }; return <Modal onClose={onClose}>
    <div className="modal-head">
      <span className="eyebrow">Enrollment</span>
      <h2>Start your journey</h2>
      <p>Registration: <b>Oct 5, 2026</b> — <b>Nov 15, 2026</b>.</p>
    </div>

    <form className="form-grid" onSubmit={submit}>
      <label>Full name
        <input required name="name" value={f.name} onChange={change} />
      </label>
      <label>Email
        <input required type="email" name="email" value={f.email} onChange={change} />
      </label>
      <label>Phone
        <input required name="phone" value={f.phone} onChange={change} />
      </label>
      <label>Program
        <select name="program" value={f.program} onChange={change}>
          <option>Business & Career Foundations</option>
          <option>Entrepreneurship</option>
          <option>Leadership & Professional Skills</option>
          <option>Career Development</option>
        </select>
      </label>
      <div className="full modal-actions">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-btn">
          {busy ? 'Submitting…' : 'Submit enrollment'} <ArrowRight size={17} />
        </button>
      </div>
    </form>
  </Modal>
}

function App() {

  useEffect(() => {
    const saveGoogleStudent = async () => {
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        '';

      const email = user.email || '';

      // Check whether this student already exists
      const { data: existingStudent, error: checkError } = await supabase
        .from('students')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.error('Could not check student:', checkError);
        return;
      }

      // Don't create duplicates
      if (existingStudent) return;

      // Create student record
      const { error: insertError } = await supabase
        .from('students')
        .insert([
          {
            full_name: fullName,
            email: email,
            phone: '',
            education: '',
            program: 'Business & Career Foundations'
          }
        ]);

      if (insertError) {
        console.error('Could not create student:', insertError);
      }
    };

    saveGoogleStudent();
  }, []);

  const [mobile, setMobile] = useState(false);
  const [signup, setSignup] = useState(false);
  const [enroll, setEnroll] = useState(false);
  const go = id => { setMobile(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) };

  const classroom = () => window.open('https://classroom.google.com/', '_blank', 'noopener,noreferrer'); return <>
    <header className="navbar">
      <div className="nav-inner">
        <button className="brand" onClick={() => go('home')}>
          <img src={logo} alt="The Academy By DOA" className="DOAlogo" />
          <span> <b>THE ACADEMY</b> <small>BY</small> <b>DOA</b></span>
        </button>
        <button className="mobile-menu" onClick={() => setMobile(!mobile)}>
          {mobile ? <X /> : <Menu />}
        </button>

        <nav className={mobile ? 'nav-links open' : 'nav-links'}>
          <NavDrop label="Home" items={[["home", "Overview"], ["cohort", "Cohorts"], ["updates", "Updates"]]} onGo={go} />

          <NavDrop label="About" items={[["about", "Our Story"], ["founder", "Founder"], ["gallery", "Gallery"]]} onGo={go} />

          <NavDrop label="Services" items={[["programs", "Programs"], ["events", "Events"], ["mentorship", "Mentorship"]]} onGo={go} />

          <button className="nav-link" onClick={() => go('contact')}>
            Contact
          </button>
          <button className="nav-enroll" onClick={() => setEnroll(true)}>
            <UserPlus size={16} />
            Enroll
          </button>
          <button className="nav-auth" onClick={classroom}><LogIn size={16} />
            Sign in
          </button>
          <button className="signup-btn" onClick={() => setSignup(true)}>
            Sign up
          </button>
        </nav>
      </div>
    </header>

    <main>
      <section id="home" className="hero">
        <div className="hero-copy">
          <div className="pill">✦ Building tomorrow's professionals</div>
          <h1>Grow the mind.<br /><span>Build the future.</span></h1>
          <p>Breeding young minds for professional excellence in business and career. Learn practical skills, build confidence and prepare for the real world.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setEnroll(true)}>
              Start Enrollment <ArrowRight size={18} />
            </button>
            <button className="ghost-btn" onClick={() => go('about')}>
              Discover The Academy
            </button>
          </div>
          <div className="hero-stats">
            <div><b>01</b>
              <span>Active Cohort</span>
            </div>
            <div><b>04+</b>
              <span>Core pathways</span>
            </div>
            <div><b>100%</b>
              <span>Practical focus</span>
            </div>
          </div>
        </div>
        <div className="hero-founder-card">
          <div className="founder-hero">
            <img src={`${publicImages}founder.svg`} alt="Founder" />
          </div>
          <div className="founder-caption">
            <span>Meet the Founder</span>
            <h3>{academy.founder.name}</h3>
            <p>{academy.founder.title}</p>
            <button onClick={() => go('founder')}>
              Founder’s story <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <Section id="about" eyebrow="About The Academy By DOA" title="A practical academy for ambitious young minds" text="We create an environment where students learn how business works, discover their strengths and develop professional habits that matter beyond the classroom.">
        <div className="about-layout">
          <div className="about-image-grid">
            <div className="about-main-image">
              <img src={`${publicImages}about-1.svg`} alt="Learning session" />
            </div>
            <div className="about-small">
              <img src={`${publicImages}about-2.svg`} alt="Students" />
            </div>
            <div className="quote-card">
              “Education becomes powerful when young people can apply it.”
            </div>
          </div>
          <div className="feature-list">
            <Feature title="Purpose-led learning" text="Learning pathways connected to real-world outcomes." /><Feature title="Career readiness" text="Professional communication, CVs, interviews and workplace skills." /><Feature title="Business mindset" text="Entrepreneurship, strategy, financial thinking and problem solving." /></div></div></Section>

      <section id="cohort" className="section cohort-section"><div className="section-heading center"><span className="eyebrow">Cohorts</span><h2>Learn together. Grow together.</h2><p>Follow the current learning journey and see what is coming next.</p></div><div className="cohort-grid"><article className="cohort-card"><div className="cohort-photo"><img src={`${publicImages}cohort-1.svg`} alt="Cohort 1" /><span>ONGOING</span></div><div className="cohort-content"><small>COHORT 01</small><h3>Professional Foundations</h3><p>Business, career readiness, leadership, communication and practical project work.</p><div className="progress"><i /></div><b>Currently in session</b></div></article><article className="cohort-card"><div className="cohort-photo"><img src={`${publicImages}cohort-2.svg`} alt="Cohort 2" /><div className="coming-overlay">COMING SOON</div></div><div className="cohort-content"><small>COHORT 02</small><h3>Next Generation Professionals</h3><p>Registration details and program dates will be announced soon.</p><button className="outline-btn" onClick={() => setSignup(true)}>Join interest list <ArrowRight size={16} /></button></div></article></div></section>

      <Section id="programs" eyebrow="What we offer" title="Skills that travel with you" text="Learning experiences designed around the professional realities young people face."><div className="program-grid">{programs.map(([title, text, Icon]) => <article className="program-card" key={title}><div className="program-icon"><Icon /></div><h3>{title}</h3><p>{text}</p><button>Learn more <ArrowRight size={15} /></button></article>)}</div></Section>

      <Section id="founder" eyebrow="Founder’s message" title="A mission built around young people's potential" text={academy.founder.bio}><div className="founder-section"><div className="founder-large-image"><img src={`${publicImages}founder.svg`} alt="Founder portrait" /></div><div className="founder-story"><h3>Young people do not need only information. They need direction, practice and people who believe in their potential.</h3><div className="signature"><b>{academy.founder.name}</b><span>{academy.founder.title}</span></div></div></div></Section>

      <Section id="gallery" eyebrow="Life at DOA" title="Moments from the academy" text="A flexible image gallery for academy activities, classes and events."><div className="masonry">{imgs.map((x, i) => <div className={'gallery-item g' + i % 4} key={x}><img src={`${publicImages}${x}.svg`} alt="DOA Academy activity" /><div><span>DOA ACADEMY</span><h4>{['Leadership Lab', 'Business Strategy', 'Career Mentorship', 'Team Collaboration', 'Presentation Day', 'Young Professionals'][i]}</h4></div></div>)}</div></Section>

      <Section id="updates" eyebrow="Academy updates" title="What's happening at The Academy" text="Announcements and notices from the academy.">
        <div className="update-grid">
          <article>
            <span>OCT 01, 2026</span>
            <h3>Cohort 1 is currently in session</h3>
            <p>Our first cohort is developing practical business, leadership and career skills.</p>
          </article>
          <article>
            <span>OCT 02, 2026</span>
            <h3>Cohort 2 registration will open soon</h3>
            <p>Join the interest list to receive early updates when the next cohort opens.</p>
          </article>
          <article>
            <span>NEW</span>
            <h3>Student portal access</h3>
            <p>Students can use the Sign in button to access Google Classroom.</p>
          </article>
        </div>
      </Section>

      <section id="events" className="section events-section">
        <div className="section-heading">
          <span className="eyebrow">Events</span>
          <h2>Mark your calendar</h2>
          <p>Keep students, parents and the wider Academy community informed.</p>
        </div>
        <div className="events-grid">
          {events.map(([date, title, text]) =>
            <article className="event-card" key={title}>
              <div className="event-date">
                <b>{new Date(date).getDate()}</b>
                <span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(date))}</span>
              </div>
              <div>
                <span>THE ACADEMY EVENTS</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <small><CalendarDays size={14} />{date}</small>
              </div>
            </article>)}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <span className="eyebrow">Visit The Academy By DOA</span>
          <h2>Come learn with us.</h2>
          <div className="contact-lines">
            <div>
              <MapPin />
              <span><b>Campus</b>{academy.location.address}</span>
            </div>
            <div>
              <Mail />
              <span><b>Email</b>theacademybydoaproductions@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="map-wrap">
          <MapContainer center={[academy.location.lat, academy.location.lng]} zoom={13} scrollWheelZoom={false}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[academy.location.lat, academy.location.lng]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
              <Popup>The Academy By DOA</Popup></Marker>
          </MapContainer>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="brand footer-brand">
            <span><b>THE ACADEMY</b><small>BY</small><b>DOA</b></span>
          </div>
          <p>Breeding young minds for professional excellence in business and career.</p>
          <div className="socials"><Instagram />
          </div>
        </div>
        <div>
          <h4>Academy</h4>
          <button onClick={() => go('about')}>About us</button>
          <button onClick={() => go('programs')}>Programs</button>
          <button onClick={() => go('events')}>Events</button></div>
        <div>
          <h4>Students</h4>
          <button onClick={() => setEnroll(true)}>Enroll now</button>
          <button onClick={classroom}>Google Classroom</button>
          <button onClick={() => setSignup(true)}>Create account</button>
        </div>
      </div>
      <div className="footer-bottom">© 2026 The Academy By DOA Productions. All rights reserved.</div>
    </footer>
    {signup && <SignupModal onClose={() => setSignup(false)} />}
    {enroll && <Enrollment onClose={() => setEnroll(false)} />}
  </>
}

function Feature({ title, text }) {
  return <div className="feature"><span>✓</span><div><h4>{title}</h4><p>{text}</p></div></div>
}
export default App;
