import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  Play, 
  Zap, 
  MessageSquare,
  Radio,
  Tv
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const upcomingClasses = [
  { id:1, tutor:'Mr. Eze', subject:'Physics', topic:'Wave Optics & Interference', time:'Today, 4:00 PM', students:124, status:'Live in 2h', avatar:'👨‍🏫' },
  { id:2, tutor:'Dr. (Mrs) Adeyemi', subject:'Biology', topic:'Reproduction in Plants', time:'Today, 6:00 PM', students:89, status:'Upcoming', avatar:'👩‍🏫' },
  { id:3, tutor:'Mr. Okon', subject:'Mathematics', topic:'Probability & Statistics', time:'Tomorrow, 10:00 AM', students:210, status:'Upcoming', avatar:'👨‍🏫' },
];

const pastRecordings = [
  { id:101, topic:'Algebraic Identities', subject:'Mathematics', date:'Yesterday', duration:'1h 15m', views:450 },
  { id:102, topic:'Periodic Table Trends', subject:'Chemistry', date:'2 days ago', duration:'55m', views:380 },
  { id:103, topic:'Photosynthesis Deep Dive', subject:'Biology', date:'3 days ago', duration:'1h 05m', views:620 },
];

export default function LiveClasses() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className="app-main">
        <Topbar title="Live Tutoring" subtitle="Learn in real-time with Nigeria's best tutors" />
        <div className="page-content">
          
          {/* Banner */}
          <div style={{ background:'linear-gradient(135deg, #071812, #0A6640)', borderRadius:'var(--r-xl)', padding:'32px', marginBottom:24, color:'white', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ maxWidth:500 }}>
              <div className="badge badge-accent" style={{ marginBottom:12 }}>LIVE NOW</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:8 }}>Join the Chemistry Intensive</h2>
              <p style={{ opacity:0.8, marginBottom:20 }}>Dr. Adeyemi is covering Organic Chemistry naming conventions right now. Join 42 other students.</p>
              <Link to="/live"><button className="btn btn-accent" style={{ borderRadius:999, gap:8 }}><Radio size={18} /> Join Live Class</button></Link>
            </div>
            <div style={{ width:120, height:120, background:'rgba(255,255,255,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--clr-accent)' }}>
              <Video size={64} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
            <div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', marginBottom:16 }}>Upcoming Sessions</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {upcomingClasses.map(c => (
                  <div key={c.id} className="card" style={{ display:'flex', alignItems:'center', gap:20 }}>
                    <div style={{ width:60, height:60, borderRadius:14, background:'var(--clr-primary-50)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)' }}>
                      <Users size={32} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, marginBottom:4, alignItems:'center' }}>
                        <span className="badge badge-primary" style={{ fontSize:'0.7rem' }}>{c.subject}</span>
                        <span style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', display:'flex', alignItems:'center', gap:4 }}><Clock size={12} /> {c.time}</span>
                      </div>
                      <h4 style={{ fontWeight:700, fontSize:'1rem' }}>{c.topic}</h4>
                      <div style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)', marginTop:4 }}>with {c.tutor} · {c.students} students registered</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'0.75rem', fontWeight:600, color: c.status.includes('Live')?'var(--clr-danger)':'var(--clr-text-muted)', marginBottom:8, display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end' }}>
                        {c.status.includes('Live') && <Radio size={14} className="animate-pulse" />} {c.status}
                      </div>
                      <button className={`btn btn-sm ${c.status.includes('Live')?'btn-primary':'btn-outline'}`} style={{ borderRadius:999, gap:6 }}>
                        {c.status.includes('Live') ? <><Play size={14} fill="currentColor" /> Join Now</> : <><Calendar size={14} /> Remind Me</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', marginTop:32, marginBottom:16 }}>Past Recordings</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
                {pastRecordings.map(r => (
                  <div key={r.id} className="card card-hover" style={{ padding:16 }}>
                    <div style={{ height:100, background:'var(--clr-bg)', borderRadius:'var(--r-md)', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)', position:'relative' }}>
                      <Tv size={32} />
                      <span style={{ position:'absolute', bottom:6, right:6, background:'rgba(0,0,0,0.6)', color:'white', padding:'2px 6px', borderRadius:4, fontSize:'0.65rem', display:'flex', alignItems:'center', gap:4 }}><Clock size={10} /> {r.duration}</span>
                    </div>
                    <div style={{ fontSize:'0.7rem', color:'var(--clr-primary)', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{r.subject}</div>
                    <h5 style={{ fontWeight:700, fontSize:'0.875rem', marginBottom:8, height:40, overflow:'hidden' }}>{r.topic}</h5>
                    <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', display:'flex', justifyContent:'space-between' }}>
                      <span>{r.date}</span>
                      <span>{r.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div className="card" style={{ background:'var(--clr-accent-50)', border:'1px solid var(--clr-accent-light)' }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom:12 }}>Tutor Office Hours</h3>
                <p style={{ fontSize:'0.8125rem', color:'var(--clr-text-secondary)', marginBottom:16, lineHeight:1.6 }}>Get 1-on-1 help from top tutors. Office hours are open for Premium subscribers.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {['Mathematics - Today 2pm','English - Wed 4pm','Physics - Thu 11am'].map((t,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.8125rem', fontWeight:600 }}>
                      <span style={{ color:'var(--clr-accent-dark)' }}>●</span> {t}
                    </div>
                  ))}
                </div>
                <button className="btn btn-accent btn-sm w-full" style={{ marginTop:20, borderRadius:999, gap:8 }}><MessageSquare size={16} /> Book a slot</button>
              </div>

              <div className="card">
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom:16 }}>Your Live Stats</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>Classes attended</span>
                    <span style={{ fontWeight:700 }}>12</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>Questions asked</span>
                    <span style={{ fontWeight:700 }}>45</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>Watch time</span>
                    <span style={{ fontWeight:700 }}>18h 30m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
