import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Clock, 
  BarChart3, 
  Rocket, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  FlagOff, 
  CheckCircle2, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';

const TOTAL_TIME = 100 * 60; // 100 minutes

const examQuestions = [
  { id:1, subject:'English', text:'Choose the word that is most nearly opposite in meaning to the word in capitals. TACITURN:', options:['A. Talkative','B. Silent','C. Moody','D. Angry'], answer:'A' },
  { id:2, subject:'English', text:'From the options below, choose the one that has the same vowel sound as the word: FEAT', options:['A. Feat','B. Fat','C. Fate','D. Fit'], answer:'A' },
  { id:3, subject:'Mathematics', text:'Simplify: (2³ × 2⁴) ÷ 2⁵', options:['A. 2','B. 4','C. 8','D. 16'], answer:'B' },
  { id:4, subject:'Mathematics', text:'If the sum of the roots of 2x² + 3x - 5 = 0 is m, find m.', options:['A. -3/2','B. 3/2','C. -5/2','D. 5/2'], answer:'A' },
  { id:5, subject:'Biology', text:'The organelle responsible for protein synthesis in a cell is the:', options:['A. Mitochondria','B. Nucleus','C. Ribosome','D. Golgi apparatus'], answer:'C' },
  { id:6, subject:'Biology', text:'Which of the following is NOT a function of the human skeleton?', options:['A. Support','B. Protection','C. Digestion','D. Movement'], answer:'C' },
  { id:7, subject:'Chemistry', text:'What is the oxidation number of sulphur in H₂SO₄?', options:['A. +2','B. +4','C. +6','D. +8'], answer:'C' },
  { id:8, subject:'Chemistry', text:'Which of the following is a noble gas?', options:['A. Fluorine','B. Chlorine','C. Nitrogen','D. Argon'], answer:'D' },
  { id:9, subject:'Physics', text:'The unit of electric potential difference is the:', options:['A. Ampere','B. Ohm','C. Volt','D. Watt'], answer:'C' },
  { id:10, subject:'Physics', text:'A car accelerates uniformly from rest to 20 m/s in 4 seconds. Its acceleration is:', options:['A. 2 m/s²','B. 5 m/s²','C. 10 m/s²','D. 80 m/s²'], answer:'B' },
  ...Array.from({length:30}, (_,i) => ({ id:i+11, subject:['Mathematics','Biology','Chemistry','Physics','English'][i%5], text:`Sample question ${i+11}: This is a sample JAMB CBT question testing your knowledge of the subject matter.`, options:['A. Option A','B. Option B','C. Option C','D. Option D'], answer:'A' }))
];

const subjectColors = { English:'#DBEAFE', Mathematics:'#DCFCE7', Biology:'#EBF5F0', Chemistry:'#FEF3C7', Physics:'#FEE2E2' };

function formatTime(secs) {
  const m = Math.floor(secs/60), s = secs%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function ExamSimulator() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState(new Set());
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(v => { if (v <= 1) { clearInterval(timerRef.current); setSubmitted(true); return 0; } return v - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const answered = Object.keys(answers).length;
  const correct = submitted ? Object.entries(answers).filter(([id, ans]) => examQuestions.find(q=>q.id===parseInt(id))?.answer === ans).length : 0;
  const score = Math.round((correct / examQuestions.length) * 100);
  const pct = timeLeft / TOTAL_TIME;
  const timeColor = pct > 0.4 ? 'var(--clr-success)' : pct > 0.15 ? 'var(--clr-warning)' : 'var(--clr-danger)';

  if (!started) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #071812, #0A3D2E)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:'var(--r-2xl)', padding:48, maxWidth:540, width:'100%', textAlign:'center', boxShadow:'0 40px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ color:'var(--clr-accent)', marginBottom:20, display:'flex', justifyContent:'center' }}><Target size={64} /></div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, marginBottom:12 }}>JAMB CBT Mock Exam</h1>
        <p style={{ color:'var(--clr-text-secondary)', lineHeight:1.7, marginBottom:28 }}>Simulates the actual JAMB CBT interface. 40 questions across 4 subjects. <strong>100 minutes.</strong> No going back after submission.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {[{icon:GraduationCap,label:'40 Questions',sub:'JAMB-style', color:'var(--clr-primary)'},{icon:Clock,label:'100 Minutes',sub:'Timed exam', color:'var(--clr-warning)'},{icon:BarChart3,label:'Score Report',sub:'With analysis', color:'var(--clr-success)'}].map((s,i)=>(
            <div key={i} style={{ background:'var(--clr-bg)', borderRadius:'var(--r-md)', padding:'16px 12px' }}>
              <div style={{ color:s.color, marginBottom:8, display:'flex', justifyContent:'center' }}><s.icon size={28} /></div>
              <div style={{ fontWeight:700, fontSize:'0.875rem' }}>{s.label}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginBottom:12, gap:8 }} onClick={()=>setStarted(true)}><Rocket size={20} /> Start Exam Now</button>
        <Link to="/practice"><button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:'0.875rem', gap:8 }}><ArrowLeft size={16} /> Back to Practice</button></Link>
      </div>
    </div>
  );

  if (submitted) {
    const subjectBreakdown = ['Mathematics','Biology','Chemistry','Physics','English'].map(sub => {
      const qs = examQuestions.filter(q=>q.subject===sub);
      const right = qs.filter(q=>answers[q.id]===q.answer).length;
      return { sub, right, total:qs.length, pct:Math.round((right/qs.length)*100) };
    });
    return (
      <div style={{ minHeight:'100vh', background:'var(--clr-bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ maxWidth:640, width:'100%' }}>
          <div style={{ background:'linear-gradient(135deg, #071812, #0A6640)', borderRadius:'var(--r-xl)', padding:40, textAlign:'center', marginBottom:24, color:'white' }}>
            <div style={{ fontSize:64, marginBottom:12 }}>{score>=70?'🎉':score>=50?'😐':'😔'}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'4rem', fontWeight:800, color:'var(--clr-accent)', lineHeight:1 }}>{score}%</div>
            <div style={{ fontSize:'1.125rem', marginTop:8, opacity:0.8 }}>{correct} / {examQuestions.length} correct</div>
            <div style={{ marginTop:16, padding:'12px 20px', background:'rgba(255,255,255,0.08)', borderRadius:'var(--r-md)', fontSize:'0.9rem', opacity:0.7 }}>
              {score>=70?'Excellent performance! Keep it up.':score>=50?'Good effort. Focus on your weak areas.':'More practice needed. Don\'t give up!'}
            </div>
          </div>
          <div className="card" style={{ marginBottom:20 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>📊 Subject Breakdown</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {subjectBreakdown.map(s => (
                <div key={s.sub}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:'0.875rem' }}>
                    <span style={{ fontWeight:600 }}>{s.sub}</span>
                    <span style={{ color: s.pct>=70?'var(--clr-success)':s.pct>=50?'var(--clr-warning)':'var(--clr-danger)', fontWeight:700 }}>{s.right}/{s.total} ({s.pct}%)</span>
                  </div>
                  <div className="progress"><div className="progress-bar" style={{ width:`${s.pct}%`, background:s.pct>=70?'var(--clr-success)':s.pct>=50?'var(--clr-warning)':'var(--clr-danger)' }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={()=>{ setSubmitted(false); setStarted(false); setAnswers({}); setCurrent(0); setTimeLeft(TOTAL_TIME); setFlagged(new Set()); }} className="btn btn-outline" style={{ flex:1, justifyContent:'center', gap:8 }}>Retake Exam</button>
            <Link to="/dashboard" style={{ flex:1, display:'flex' }}><button className="btn btn-primary" style={{ flex:1, justifyContent:'center', gap:8 }}><ArrowLeft size={18} /> Dashboard</button></Link>
            <Link to="/practice" style={{ flex:1, display:'flex' }}><button className="btn btn-accent" style={{ flex:1, justifyContent:'center', gap:8 }}>Practice Weak Areas <ChevronRight size={18} /></button></Link>
          </div>
        </div>
      </div>
    );
  }

  const q = examQuestions[current];

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#F0F4F1' }}>
      {/* Exam header */}
      <div style={{ background:'var(--clr-bg-sidebar)', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={18} /></div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'white', fontSize:'1rem' }}>PassPort CBT</span>
          </div>
          <div style={{ width:1, height:30, background:'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)' }}>JAMB Mock Examination 2025</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Time Left</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:800, color:timeColor }}>{formatTime(timeLeft)}</div>
          </div>
          <div style={{ width:1, height:30, background:'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Answered</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:800, color:'white' }}>{answered}/{examQuestions.length}</div>
          </div>
          <button onClick={()=>{ clearInterval(timerRef.current); setSubmitted(true); }} className="btn btn-accent btn-sm" style={{ borderRadius:999, marginLeft:8, gap:8 }}><Send size={14} /> Submit Exam</button>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height:4, background:'rgba(0,0,0,0.1)', flexShrink:0 }}>
        <div style={{ height:'100%', background:timeColor, width:`${pct*100}%`, transition:'width 1s linear, background 0.5s' }} />
      </div>

      <div style={{ flex:1, display:'grid', gridTemplateColumns:'220px 1fr 200px', gap:0, overflow:'hidden' }}>
        {/* Subject panel */}
        <div style={{ background:'white', borderRight:'1px solid var(--clr-border-light)', padding:20, overflowY:'auto' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--clr-text-muted)', marginBottom:16 }}>Subjects</div>
          {['English','Mathematics','Biology','Chemistry','Physics'].map(sub => {
            const subQs = examQuestions.filter(q=>q.subject===sub);
            const subDone = subQs.filter(q=>answers[q.id]).length;
            return (
              <button key={sub} onClick={()=>setCurrent(examQuestions.findIndex(q=>q.subject===sub))} style={{ width:'100%', padding:'10px 12px', borderRadius:'var(--r-sm)', marginBottom:6, background: q.subject===sub ? subjectColors[sub] : 'transparent', border:`1px solid ${q.subject===sub?'var(--clr-primary)':'transparent'}`, textAlign:'left', cursor:'pointer', transition:'all var(--ease)' }}>
                <div style={{ fontSize:'0.8125rem', fontWeight:600, color:q.subject===sub?'var(--clr-primary)':'var(--clr-text-primary)' }}>{sub}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', marginTop:3 }}>{subDone}/{subQs.length} done</div>
              </button>
            );
          })}
        </div>

        {/* Question area */}
        <div style={{ padding:'28px 32px', overflowY:'auto' }}>
          <div style={{ display:'flex', gap:10, marginBottom:24, alignItems:'center' }}>
            <span className="badge" style={{ background:subjectColors[q.subject], color:'var(--clr-text-primary)', fontWeight:600, fontSize:'0.75rem' }}>{q.subject}</span>
            <span style={{ fontSize:'0.875rem', color:'var(--clr-text-muted)' }}>Question {current+1} of {examQuestions.length}</span>
            <button onClick={()=>setFlagged(v=>{ const n=new Set(v); n.has(q.id)?n.delete(q.id):n.add(q.id); return n; })} style={{ marginLeft:'auto', background: flagged.has(q.id)?'var(--clr-warning-bg)':'transparent', border:`1px solid ${flagged.has(q.id)?'var(--clr-warning)':'var(--clr-border)'}`, color: flagged.has(q.id)?'var(--clr-warning)':'var(--clr-text-muted)', borderRadius:'var(--r-sm)', padding:'6px 12px', fontSize:'0.8125rem', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              {flagged.has(q.id)?<><FlagOff size={14} /> Unflag</>:<><Flag size={14} /> Flag Question</>}
            </button>
          </div>

          <div style={{ background:'white', borderRadius:'var(--r-xl)', padding:32, marginBottom:24, border:'1px solid var(--clr-border-light)' }}>
            <p style={{ fontSize:'1.0625rem', lineHeight:1.8, fontWeight:500, color:'var(--clr-text-primary)', marginBottom:28 }}>{q.text}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {q.options.map((opt,i) => {
                const letter = opt[0];
                const sel = answers[q.id] === letter;
                return (
                  <button key={i} onClick={()=>setAnswers(v=>({...v,[q.id]:letter}))} style={{ padding:'14px 20px', borderRadius:'var(--r-md)', border:`2px solid ${sel?'var(--clr-primary)':'var(--clr-border)'}`, background:sel?'var(--clr-primary-50)':'white', textAlign:'left', fontSize:'0.9375rem', cursor:'pointer', color:sel?'var(--clr-primary)':'var(--clr-text-primary)', fontWeight:sel?600:400, transition:'all var(--ease)' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <button onClick={()=>setCurrent(v=>Math.max(0,v-1))} disabled={current===0} className="btn btn-outline" style={{ gap:8 }}><ChevronLeft size={18} /> Previous</button>
            <button onClick={()=>setCurrent(v=>Math.min(examQuestions.length-1,v+1))} disabled={current===examQuestions.length-1} className="btn btn-primary" style={{ marginLeft:'auto', gap:8 }}>Next <ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Question grid */}
        <div style={{ background:'white', borderLeft:'1px solid var(--clr-border-light)', padding:16, overflowY:'auto' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--clr-text-muted)', marginBottom:12 }}>Question Map</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
            {examQuestions.map((qn,i) => (
              <button key={qn.id} onClick={()=>setCurrent(i)} style={{ aspectRatio:'1', borderRadius:6, border:`2px solid ${i===current?'var(--clr-primary)':answers[qn.id]?'var(--clr-primary)':flagged.has(qn.id)?'var(--clr-warning)':'var(--clr-border)'}`, background: i===current?'var(--clr-primary)':answers[qn.id]?'var(--clr-primary-100)':flagged.has(qn.id)?'var(--clr-warning-bg)':'transparent', color: i===current?'white':'var(--clr-text-primary)', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {i+1}
              </button>
            ))}
          </div>
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:8, fontSize:'0.7rem' }}>
            {[['var(--clr-primary-100)','Answered'],['var(--clr-warning-bg)','Flagged'],['white','Not answered']].map(([bg,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:14, height:14, borderRadius:4, background:bg, border:'1px solid var(--clr-border)', flexShrink:0 }} />
                <span style={{ color:'var(--clr-text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
