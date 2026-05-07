import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  PenTool, 
  Users, 
  Video, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Quote
} from 'lucide-react';

const subjects = ['Mathematics','English Language','Biology','Chemistry','Physics'];
const stats = [{ v:'12,400+', l:'Active Students' },{ v:'94%', l:'Pass Rate' },{ v:'50,000+', l:'Past Questions' },{ v:'5', l:'Core Subjects' }];
const pillars = [
  { icon: BookOpen, color:'#EBF5F0', title:'Structured Lesson Engine', desc:'Video lessons mapped directly to JAMB syllabus and WAEC scheme of work. Auto-generated day-by-day study plans based on your exam date.' },
  { icon: PenTool, color:'#FEF7E6', title:'Live CBT Practice', desc:'Full archive of JAMB past questions (2000–present). Timed mock exams that simulate the exact JAMB CBT interface — zero shock on exam day.' },
  { icon: Users, color:'#DBEAFE', title:'Parent Dashboard', desc:'Parents get a separate login showing daily study time, mock scores, and attendance streaks. Weekly WhatsApp digest included.' },
  { icon: Video, color:'#DCFCE7', title:'Live Tutoring Layer', desc:'Scheduled group live classes with qualified tutors 2–3× per week. Session recordings saved to your profile.' },
  { icon: Trophy, color:'#FEE2E2', title:'Gamification & Accountability', desc:'Daily streaks, weekly leaderboards per state, exam countdown on every login, and JAMB/WAEC score predictions.' },
];
const plans = [
  { name:'Free', price:'₦0', color:'#F4F7F5', border:'#D4E3DB', features:['10 past questions/day','1 subject preview','Basic progress tracking'], cta:'Get Started', highlight:false },
  { name:'Basic', price:'₦2,500', period:'/month', color:'var(--clr-primary-50)', border:'var(--clr-primary-100)', features:['All past questions','5 subjects','Basic analytics'], cta:'Start Basic', highlight:false },
  { name:'Standard', price:'₦5,000', period:'/month', color:'var(--clr-bg-sidebar)', border:'var(--clr-bg-sidebar)', features:['Full video lessons','Past questions','Parent dashboard','Weak area analytics'], cta:'Most Popular', highlight:true },
  { name:'Premium', price:'₦8,000', period:'/month', color:'#FEF7E6', border:'#FBC84F', features:['Everything in Standard','Live tutoring sessions','Priority support','Score predictions'], cta:'Go Premium', highlight:false },
];
const testimonials = [
  { name:'Chiamaka Eze', role:'SS3 Student, Lagos', quote:'I used to fail Biology consistently. PassPort showed me exactly where I was weak. I scored 78 in my mock last week.', avatar:'CE', score:'78%' },
  { name:'Mrs. Folake Adeyemi', role:'Parent, Ibadan', quote:'I get a WhatsApp report every week showing how long my daughter studied. For the first time, I feel in control.', avatar:'FA', score:'😊' },
  { name:'Tunde Okafor', role:'SS3 Student, Abuja', quote:'The CBT interface is exactly like the real JAMB. No surprises on exam day. I scored 287 in my first attempt.', avatar:'TO', score:'287' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid var(--clr-border-light)' : 'none', transition:'all 0.3s ease', height:72, display:'flex', alignItems:'center' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={20} /></div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.25rem', color: scrolled ? 'var(--clr-text-primary)' : 'white' }}>PassPort</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Link to="/login"><button className="btn btn-ghost" style={{ color: scrolled ? 'var(--clr-text-secondary)' : 'rgba(255,255,255,0.85)' }}>Log in</button></Link>
          <Link to="/register"><button className="btn btn-accent btn-sm" style={{ borderRadius:999, padding:'10px 22px', gap:8 }}>Start Free <ArrowRight size={16} /></button></Link>
        </div>
      </div>
    </nav>
  );
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div style={{ overflowX:'hidden' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ 
        minHeight:'100vh', 
        background:`linear-gradient(135deg, rgba(7,24,18,0.92) 0%, rgba(10,61,46,0.85) 100%), url(/passport_hero_bg_1778141453952.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display:'flex', 
        alignItems:'center', 
        position:'relative', 
        overflow:'hidden', 
        paddingTop:72 
      }}>
        {/* BG orbs */}
        <div style={{ position:'absolute', top:'10%', right:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,169,36,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'5%', left:'0%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(10,102,64,0.3) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div className="container" style={{ paddingBlock:'var(--sp-24)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-16)', alignItems:'center' }}>
          <div className="animate-fadeInUp">
            <div className="badge badge-accent animate-fadeInUp" style={{ marginBottom:20, padding:'8px 16px', fontSize:'0.8125rem' }}>🇳🇬 Built for Nigerian Students</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:800, color:'white', lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:24 }}>
              Nigeria's Most<br/><span style={{ color:'var(--clr-accent)' }}>Exam-Ready</span><br/>Students Start Here
            </h1>
            <p style={{ fontSize:'1.125rem', color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:36, maxWidth:480 }}>
              Structured JAMB & WAEC preparation with CBT simulation, parent visibility, and AI-powered weakness tracking — not just videos.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/register"><button className="btn btn-accent btn-lg" style={{ borderRadius:999, gap:10 }}>🚀 Start Free Trial</button></Link>
              <Link to="/dashboard"><button className="btn btn-lg" style={{ borderRadius:999, background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)', gap:10 }}>View Demo <ArrowRight size={20} /></button></Link>
            </div>
            <div style={{ marginTop:40, display:'flex', gap:32, flexWrap:'wrap' }}>
              {stats.map((s,i) => (
                <div key={i} className="animate-fadeInUp" style={{ animationDelay:`${i*0.1+0.3}s` }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, color:'var(--clr-accent)' }}>{s.v}</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card mockup */}
          <div className="animate-fadeInUp delay-300 animate-float" style={{ perspective:1000 }}>
            <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', borderRadius:24, border:'1px solid rgba(255,255,255,0.12)', padding:24, boxShadow:'0 32px 80px rgba(0,0,0,0.4)' }}>
              {/* Mini dashboard */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em' }}>JAMB Countdown</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'white', lineHeight:1 }}>47 <span style={{ fontSize:'0.875rem', color:'rgba(255,255,255,0.5)', fontWeight:500 }}>days</span></div>
                </div>
                <div style={{ background:'rgba(244,169,36,0.2)', borderRadius:12, padding:'10px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--clr-accent)', marginBottom:4 }}>Mock Score</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'var(--clr-accent)' }}>287</div>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:'0.75rem' }}>
                  <span style={{ color:'rgba(255,255,255,0.7)' }}>Biology — Cell Division</span>
                  <span style={{ color:'var(--clr-danger)' }}>32% ⚠️</span>
                </div>
                <div className="progress"><div className="progress-bar danger" style={{ width:'32%' }} /></div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:'0.75rem' }}>
                  <span style={{ color:'rgba(255,255,255,0.7)' }}>Mathematics — Algebra</span>
                  <span style={{ color:'var(--clr-success)' }}>78%</span>
                </div>
                <div className="progress"><div className="progress-bar" style={{ width:'78%' }} /></div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:'0.75rem' }}>
                  <span style={{ color:'rgba(255,255,255,0.7)' }}>Chemistry — Organic</span>
                  <span style={{ color:'var(--clr-warning)' }}>55%</span>
                </div>
                <div className="progress"><div className="progress-bar accent" style={{ width:'55%' }} /></div>
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
                  <div key={d} style={{ flex:1, textAlign:'center' }}>
                    <div style={{ height:28, borderRadius:6, background: i < 5 ? 'var(--clr-primary)' : 'rgba(255,255,255,0.1)', marginBottom:4, opacity: i === 6 ? 0.3 : 1 }} />
                    <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)' }}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(244,169,36,0.1)', borderRadius:10, border:'1px solid rgba(244,169,36,0.2)', fontSize:'0.8rem', color:'rgba(255,255,255,0.7)' }}>
                🔥 <strong style={{ color:'var(--clr-accent)' }}>14-day streak!</strong> Keep it up, Adaeze
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects strip */}
      <div style={{ background:'var(--clr-text-primary)', padding:'14px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', gap:48, animation:'marquee 20s linear infinite', whiteSpace:'nowrap', width:'max-content' }}>
          {[...subjects,...subjects,...subjects].map((s,i) => (
            <span key={i} style={{ fontSize:'0.875rem', fontWeight:600, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-33.33%); } }`}</style>
      </div>

      {/* 5 Pillars */}
      <section style={{ padding:'var(--sp-24) 0', background:'white' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--sp-16)' }}>
            <span className="badge badge-primary" style={{ marginBottom:16, padding:'8px 16px' }}>Why PassPort Works</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:800, letterSpacing:'-0.02em', color:'var(--clr-text-primary)' }}>The 5 Pillars of Exam Readiness</h2>
            <p style={{ marginTop:12, color:'var(--clr-text-secondary)', fontSize:'1.0625rem', maxWidth:520, margin:'12px auto 0' }}>Nigerian parents don't just pay for content. They pay for structure, accountability, and exam-readiness. PassPort delivers all three.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:24 }}>
            {pillars.map((p,i) => (
              <div key={i} className="card card-hover animate-fadeInUp" style={{ animationDelay:`${i*0.1}s` }}>
                <div style={{ width:52, height:52, borderRadius:14, background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--clr-primary)', marginBottom:16 }}><p.icon size={24} /></div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.0625rem', fontWeight:700, marginBottom:10 }}>{p.title}</h3>
                <p style={{ fontSize:'0.875rem', color:'var(--clr-text-secondary)', lineHeight:1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:'var(--sp-24) 0', background:'var(--clr-bg)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--sp-16)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:800, letterSpacing:'-0.02em' }}>How It Works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32, position:'relative' }}>
            {[
              { step:'01', title:'Set your exam date', desc:'Tell us when your WAEC or JAMB exam is. We build a personalised day-by-day study plan automatically.', icon: Calendar },
              { step:'02', title:'Follow your study plan', desc:'Video lessons, past questions, and mock exams — delivered in daily chunks your brain can actually absorb.', icon: BookOpen },
              { step:'03', title:'Track & improve', desc:'AI pinpoints your weak topics. Your parent sees your progress. You walk into the exam confident.', icon: TrendingUp },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light))', color:'white', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'var(--shadow-primary)' }}><s.icon size={28} /></div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'0.75rem', color:'var(--clr-primary)', fontWeight:700, letterSpacing:'0.1em', marginBottom:8 }}>STEP {s.step}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.125rem', fontWeight:700, marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:'0.875rem', color:'var(--clr-text-secondary)', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding:'var(--sp-24) 0', background:'white' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--sp-16)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:800, letterSpacing:'-0.02em' }}>Simple, Nigeria-Friendly Pricing</h2>
            <p style={{ marginTop:12, color:'var(--clr-text-secondary)', fontSize:'1rem' }}>Start free, upgrade when you're ready. Cancel anytime.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20, alignItems:'start' }}>
            {plans.map((p,i) => (
              <div key={i} style={{ background: p.highlight ? 'var(--clr-bg-sidebar)' : p.color, borderRadius:'var(--r-xl)', border:`2px solid ${p.border}`, padding:'28px 24px', position:'relative', boxShadow: p.highlight ? '0 20px 60px rgba(7,24,18,0.3)' : 'var(--shadow-sm)' }}>
                {p.highlight && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--clr-accent)', color:'#0D1F16', padding:'5px 16px', borderRadius:999, fontSize:'0.7rem', fontWeight:700, whiteSpace:'nowrap' }}>MOST POPULAR</div>}
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color: p.highlight ? 'rgba(255,255,255,0.7)' : 'var(--clr-text-secondary)', marginBottom:8 }}>{p.name}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2.25rem', fontWeight:800, color: p.highlight ? 'white' : 'var(--clr-text-primary)', lineHeight:1 }}>
                  {p.price}<span style={{ fontSize:'0.875rem', fontWeight:500, color: p.highlight ? 'rgba(255,255,255,0.5)' : 'var(--clr-text-muted)' }}>{p.period}</span>
                </div>
                <div style={{ margin:'20px 0', height:1, background: p.highlight ? 'rgba(255,255,255,0.08)' : 'var(--clr-border-light)' }} />
                <ul style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                  {p.features.map((f,j) => (
                    <li key={j} style={{ display:'flex', gap:10, fontSize:'0.875rem', color: p.highlight ? 'rgba(255,255,255,0.75)' : 'var(--clr-text-secondary)', alignItems:'center' }}>
                      <CheckCircle2 size={16} color="var(--clr-success)" style={{ flexShrink:0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className={`btn w-full ${p.highlight ? 'btn-accent' : 'btn-outline'}`} style={{ borderRadius:'var(--r-sm)', justifyContent:'center' }}>{p.cta}</button>
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign:'center', marginTop:24, fontSize:'0.875rem', color:'var(--clr-text-muted)' }}>🏫 School licenses available from ₦500,000/year — <a href="#" style={{ color:'var(--clr-primary)', fontWeight:600 }}>Contact us</a></p>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding:'var(--sp-24) 0', background:'var(--clr-bg)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--sp-16)' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:800, letterSpacing:'-0.02em' }}>Real Students. Real Results.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {testimonials.map((t,i) => (
              <div key={i} className="card" style={{ position:'relative' }}>
                <div style={{ color:'var(--clr-primary-100)', marginBottom:12 }}><Quote size={32} /></div>
                <p style={{ fontSize:'0.9375rem', color:'var(--clr-text-secondary)', lineHeight:1.75, marginBottom:20, fontStyle:'italic' }}>{t.quote}</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="avatar avatar-md">{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft:'auto', background:'var(--clr-primary-50)', padding:'6px 12px', borderRadius:999, fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.875rem', color:'var(--clr-primary)' }}>{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'var(--sp-24) 0', background:'linear-gradient(135deg, #071812 0%, #0A6640 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,169,36,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div className="container" style={{ textAlign:'center', position:'relative' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'white', letterSpacing:'-0.03em', marginBottom:16 }}>Your child's exam is in <span style={{ color:'var(--clr-accent)' }}>47 days.</span><br/>Are they ready?</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'1.0625rem', marginBottom:36, maxWidth:500, margin:'16px auto 36px' }}>Join 12,400+ Nigerian students who are studying smarter with PassPort.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register"><button className="btn btn-accent btn-lg" style={{ borderRadius:999, padding:'18px 40px', gap:10 }}>🚀 Get Started Free</button></Link>
            <Link to="/parent"><button className="btn btn-lg" style={{ borderRadius:999, padding:'18px 40px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)', gap:10 }}>Parent Dashboard <ArrowRight size={20} /></button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'#030D07', padding:'40px 0', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={16} /></div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'rgba(255,255,255,0.7)' }}>PassPort</span>
          </div>
          <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.3)' }}>© 2025 PassPort Edtech Ltd. Built for Nigerian excellence.</p>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy','Terms','Contact'].map(l => <a key={l} href="#" style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.4)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
