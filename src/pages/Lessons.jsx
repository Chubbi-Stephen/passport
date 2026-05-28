import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  Lock, 
  Check, 
  Clock, 
  Eye, 
  X,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Video
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const subjects = ['All','Mathematics','English Language','Biology','Chemistry','Physics'];

const lessons = [
  { id:1, subject:'Biology', topic:'Cell Division & Mitosis', duration:'24 min', views:3420, thumb:BookOpen, progress:100, locked:false, week:1 },
  { id:2, subject:'Biology', topic:'Photosynthesis Explained', duration:'28 min', views:2890, thumb:BookOpen, progress:60, locked:false, week:1 },
  { id:3, subject:'Biology', topic:'Human Digestive System', duration:'32 min', views:2100, thumb:BookOpen, progress:0, locked:false, week:2 },
  { id:4, subject:'Biology', topic:'Genetics & Heredity', duration:'26 min', views:1850, thumb:BookOpen, progress:0, locked:true, week:2 },
  { id:5, subject:'Mathematics', topic:'Quadratic Equations', duration:'30 min', views:4120, thumb:BookOpen, progress:100, locked:false, week:1 },
  { id:6, subject:'Mathematics', topic:'Trigonometry Basics', duration:'35 min', views:3670, thumb:BookOpen, progress:45, locked:false, week:1 },
  { id:7, subject:'Mathematics', topic:'Differentiation & Calculus', duration:'40 min', views:2980, thumb:BookOpen, progress:0, locked:true, week:2 },
  { id:8, subject:'Chemistry', topic:'Organic Chemistry Intro', duration:'27 min', views:2540, thumb:BookOpen, progress:0, locked:false, week:1 },
  { id:9, subject:'Chemistry', topic:'Acid-Base Reactions', duration:'22 min', views:2110, thumb:BookOpen, progress:100, locked:false, week:1 },
  { id:10, subject:'Chemistry', topic:'Electrochemistry', duration:'31 min', views:1640, thumb:BookOpen, progress:0, locked:true, week:2 },
  { id:11, subject:'Physics', topic:'Newton\'s Laws of Motion', duration:'25 min', views:3890, thumb:BookOpen, progress:100, locked:false, week:1 },
  { id:12, subject:'Physics', topic:'Wave Properties', duration:'29 min', views:2430, thumb:BookOpen, progress:30, locked:false, week:1 },
  { id:13, subject:'English Language', topic:'Summary Writing Techniques', duration:'20 min', views:3200, thumb:BookOpen, progress:100, locked:false, week:1 },
  { id:14, subject:'English Language', topic:'Comprehension Strategies', duration:'18 min', views:2780, thumb:BookOpen, progress:75, locked:false, week:1 },
];

const subjectColors = { Biology:'#EBF5F0', Mathematics:'#DCFCE7', Chemistry:'#FEF3C7', Physics:'#DBEAFE', 'English Language':'#FEE2E2' };
const subjectAccents = { Biology:'var(--clr-primary)', Mathematics:'var(--clr-success)', Chemistry:'var(--clr-warning)', Physics:'var(--clr-info)', 'English Language':'var(--clr-danger)' };

export default function Lessons() {
  const [collapsed, setCollapsed] = useState(false);
  const [selSubject, setSelSubject] = useState('All');
  const [playing, setPlaying] = useState(null);

  const filtered = lessons.filter(l => selSubject === 'All' || l.subject === selSubject);
  const completedCount = lessons.filter(l => l.progress === 100).length;

  return (
    <>
      {/* Progress overview */}
      <div style={{ background:'linear-gradient(135deg, #071812, #0A4F2F)', borderRadius:'var(--r-xl)', padding:'24px 28px', marginBottom:24, display:'flex', gap:32, alignItems:'center', flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Your Progress</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'white' }}>{completedCount}<span style={{ fontSize:'1rem', color:'rgba(255,255,255,0.5)', fontWeight:500 }}>/{lessons.length} lessons</span></div>
        </div>
        <div style={{ flex:1, maxWidth:300 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:'0.8125rem', color:'rgba(255,255,255,0.6)' }}>
            <span>Overall completion</span><span style={{ color:'var(--clr-accent)', fontWeight:700 }}>{Math.round((completedCount/lessons.length)*100)}%</span>
          </div>
          <div style={{ height:8, background:'rgba(255,255,255,0.1)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(completedCount/lessons.length)*100}%`, background:'linear-gradient(90deg, var(--clr-accent), #e8961a)', borderRadius:999 }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:16 }}>
          {subjects.slice(1).map(s => {
            const subLessons = lessons.filter(l=>l.subject===s);
            const done = subLessons.filter(l=>l.progress===100).length;
            return (
              <div key={s} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', color: done===subLessons.length?'var(--clr-accent)':'white' }}>{done}/{subLessons.length}</div>
                <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:2 }}>{s.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={()=>setSelSubject(s)} style={{ padding:'9px 18px', borderRadius:999, border:`1.5px solid ${selSubject===s?'var(--clr-primary)':'var(--clr-border)'}`, background:selSubject===s?'var(--clr-primary)':'white', color:selSubject===s?'white':'var(--clr-text-secondary)', fontWeight:600, fontSize:'0.8125rem', cursor:'pointer', transition:'all var(--ease)' }}>{s}</button>
        ))}
      </div>

      {/* Lesson grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
        {filtered.map(lesson => (
          <div key={lesson.id} className="card card-hover" style={{ padding:0, overflow:'hidden', opacity:lesson.locked?0.65:1 }}>
            {/* Thumbnail */}
            <div style={{ height:140, background:subjectColors[lesson.subject]||'var(--clr-primary-50)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:lesson.locked?'not-allowed':'pointer', color:subjectAccents[lesson.subject] }}
              onClick={()=>!lesson.locked&&setPlaying(lesson.id)}>
              <lesson.thumb size={56} />
              {lesson.locked ? (
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                  <Lock size={28} color="white" />
                  <span style={{ color:'white', fontSize:'0.75rem', fontWeight:600 }}>Complete previous lesson</span>
                </div>
              ) : (
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', transition:'background 0.2s', display:'flex', alignItems:'center', justifyContent:'center' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.25)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0)'}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)', opacity:0, transition:'opacity 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='1'}
                    onMouseLeave={e=>e.currentTarget.style.opacity='0'}><Play size={24} fill="currentColor" /></div>
                </div>
              )}
              <span className="badge" style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.6)', color:'white', backdropFilter:'blur(8px)', fontSize:'0.7rem', gap:4 }}><Clock size={12} /> {lesson.duration}</span>
              {lesson.progress===100 && <span style={{ position:'absolute', top:12, left:12, background:'var(--clr-success)', color:'white', borderRadius:999, padding:'4px 10px', fontSize:'0.7rem', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}><Check size={12} strokeWidth={3} /> Done</span>}
            </div>

            {/* Content */}
            <div style={{ padding:'16px 20px' }}>
              <div style={{ display:'flex', gap:8, marginBottom:10, alignItems:'center' }}>
                <span className="badge" style={{ background:subjectColors[lesson.subject], color:subjectAccents[lesson.subject], fontSize:'0.7rem' }}>{lesson.subject}</span>
                <span style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', marginLeft:'auto', display:'flex', alignItems:'center', gap:4 }}><Eye size={12} /> {lesson.views.toLocaleString()}</span>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'0.9375rem', marginBottom:12, lineHeight:1.4 }}>{lesson.topic}</h3>
              {lesson.progress > 0 && lesson.progress < 100 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--clr-text-muted)', marginBottom:6 }}>
                    <span>In progress</span><span style={{ fontWeight:600, color:'var(--clr-primary)' }}>{lesson.progress}%</span>
                  </div>
                  <div className="progress" style={{ height:4 }}><div className="progress-bar" style={{ width:`${lesson.progress}%` }} /></div>
                </div>
              )}
              <button
                disabled={lesson.locked}
                onClick={()=>!lesson.locked&&setPlaying(lesson.id)}
                className={`btn ${lesson.locked?'btn-ghost':lesson.progress===100?'btn-outline':'btn-primary'} btn-sm`}
                style={{ width:'100%', justifyContent:'center', borderRadius:'var(--r-sm)', cursor:lesson.locked?'not-allowed':'pointer', gap:8 }}
              >
                {lesson.locked ? <><Lock size={14} /> Locked</> : lesson.progress===100 ? <><RotateCcw size={14} /> Rewatch</> : lesson.progress > 0 ? <><Play size={14} /> Continue</> : <><Play size={14} /> Start Lesson</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video player modal */}
      {playing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={()=>setPlaying(null)}>
          <div style={{ background:'#0D1F16', borderRadius:'var(--r-xl)', maxWidth:800, width:'100%', overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg, #071812, #0A3D2E)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, color:'var(--clr-accent)' }}>
              <Video size={80} />
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem' }}>Video player — connects to Cloudflare Stream / Bunny.net CDN</div>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, color:'white' }}>{lessons.find(l=>l.id===playing)?.topic}</div>
                <div style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)', marginTop:4 }}>{lessons.find(l=>l.id===playing)?.subject} · {lessons.find(l=>l.id===playing)?.duration}</div>
              </div>
              <button onClick={()=>setPlaying(null)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'white', borderRadius:999, padding:'8px 18px', cursor:'pointer', fontWeight:600, fontSize:'0.875rem', display:'flex', alignItems:'center', gap:8 }}><X size={16} /> Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
