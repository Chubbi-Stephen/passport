import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Flame,
  Zap,
  Target,
  BookOpen,
  Gem,
  Award
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const tabs = ['National', 'My State (Lagos)', 'My School', 'Friends'];

const nationalBoard = [
  { rank:1, name:'Chidera Anozie', state:'Anambra', school:'FGGC Onitsha', score:312, streak:42, badge:'🥇', change:0 },
  { rank:2, name:'Fatimah Al-Hassan', state:'Kano', school:'GGSS Kano', score:305, streak:38, badge:'🥈', change:2 },
  { rank:3, name:'Tunde Balogun', state:'Lagos', school:'Kings College', score:301, streak:35, badge:'🥉', change:-1 },
  { rank:4, name:'Adaeze Okonkwo', state:'Lagos', school:'FGC Lagos', score:287, streak:14, badge:'', change:3, isMe:true },
  { rank:5, name:'Seun Adesanya', state:'Oyo', school:'Govt College Ibadan', score:284, streak:29, badge:'', change:-2 },
  { rank:6, name:'Ngozi Eze', state:'Enugu', school:'CIC Enugu', score:279, streak:21, badge:'', change:1 },
  { rank:7, name:'Musa Abdullahi', state:'Kaduna', school:'GGSS Kaduna', score:275, streak:18, badge:'', change:4 },
  { rank:8, name:'Blessing Obi', state:'Delta', school:'GGSS Warri', score:271, streak:16, badge:'', change:-1 },
  { rank:9, name:'Amaka Nwosu', state:'Imo', school:'Alvarez Owerri', score:268, streak:22, badge:'', change:0 },
  { rank:10, name:'Damilola Adeyemi', state:'Lagos', school:'Command Sec School', score:265, streak:12, badge:'', change:-3 },
];

const subjectLeaders = [
  { subject:'Biology', name:'Chidera Anozie', score:'96%', avatar:'CA' },
  { subject:'Mathematics', name:'Tunde Balogun', score:'94%', avatar:'TB' },
  { subject:'Chemistry', name:'Fatimah Al-Hassan', score:'91%', avatar:'FA' },
  { subject:'Physics', name:'Adaeze Okonkwo', score:'89%', avatar:'AO', isMe:true },
  { subject:'English', name:'Ngozi Eze', score:'92%', avatar:'NE' },
];

const badges = [
  { icon: Flame, name:'14-Day Streak', desc:'Studied 14 days in a row', earned:true, color:'var(--clr-accent)' },
  { icon: Zap, name:'Speed Demon', desc:'Completed 50 questions in under 30 min', earned:true, color:'var(--clr-info)' },
  { icon: Target, name:'Sharpshooter', desc:'Scored 90%+ on a Biology mock', earned:false, color:'var(--clr-danger)' },
  { icon: BookOpen, name:'Scholar', desc:'Completed all lessons in a subject', earned:false, color:'var(--clr-success)' },
  { icon: Trophy, name:'Top 10 National', desc:'Reach top 10 on the national board', earned:false, color:'var(--clr-warning)' },
  { icon: Gem, name:'Diamond Student', desc:'30-day streak', earned:false, color:'var(--clr-primary)' },
];

export default function Leaderboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState('weekly');

  const myRank = nationalBoard.find(u=>u.isMe);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v=>!v)} />
      <div className="app-main">
        <Topbar title="Leaderboard" subtitle="Compete, improve, and stay accountable" />
        <div className="page-content">

          {/* My rank banner */}
          <div style={{ background:'linear-gradient(135deg, #071812, #0A6640)', borderRadius:'var(--r-xl)', padding:'24px 28px', marginBottom:24, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'3.5rem', fontWeight:900, color:'var(--clr-accent)', lineHeight:1 }}>#4</div>
              <div>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Your National Rank</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', color:'white' }}>Adaeze Okonkwo</div>
                <div style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)', marginTop:2 }}>Lagos · FGC Lagos · 🔥 14-day streak</div>
              </div>
            </div>
            <div style={{ height:60, width:1, background:'rgba(255,255,255,0.1)', margin:'0 8px' }} />
            <div style={{ display:'flex', gap:28 }}>
              {[{v:'287',l:'Mock Score'},{v:'↑ 3',l:'Rank Change'},{v:'Top 3%',l:'Nationally'}].map((s,i)=>(
                <div key={i}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:800, color: i===1?'var(--clr-success)':'var(--clr-accent)' }}>{s.v}</div>
                  <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginLeft:'auto' }}>
              <div style={{ display:'flex', gap:8, marginBottom:10, justifyContent:'flex-end' }}>
                {['weekly','monthly','alltime'].map(p => (
                  <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'6px 14px', borderRadius:999, border:`1px solid ${period===p?'var(--clr-accent)':'rgba(255,255,255,0.15)'}`, background:period===p?'var(--clr-accent)':'transparent', color:period===p?'#0D1F16':'rgba(255,255,255,0.6)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', textTransform:'capitalize', transition:'all var(--ease)' }}>{p}</button>
                ))}
              </div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', textAlign:'right' }}>Updates every 24 hours</div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24 }}>
            <div>
              {/* Tabs */}
              <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--clr-bg-card)', borderRadius:'var(--r-md)', padding:4, border:'1px solid var(--clr-border-light)' }}>
                {tabs.map((t,i)=>(
                  <button key={i} onClick={()=>setActiveTab(i)} style={{ flex:1, padding:'9px 12px', borderRadius:'var(--r-sm)', fontWeight:600, fontSize:'0.8125rem', background:activeTab===i?'var(--clr-primary)':'transparent', color:activeTab===i?'white':'var(--clr-text-muted)', cursor:'pointer', border:'none', transition:'all var(--ease)' }}>{t}</button>
                ))}
              </div>

              {/* Top 3 podium */}
              <div style={{ display:'flex', gap:16, marginBottom:24, alignItems:'flex-end', justifyContent:'center', padding:'24px 0' }}>
                {[nationalBoard[1],nationalBoard[0],nationalBoard[2]].map((u,i)=>{
                  const heights = [160, 200, 140];
                  const sizes = ['avatar-lg', 'avatar-xl', 'avatar-lg'];
                  return (
                    <div key={u.rank} style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                      <div style={{ color: i===1?'var(--clr-accent)':i===0?'#C0C0C0':'#CD7F32' }}>{i===1 ? <Trophy size={32} /> : <Medal size={28} />}</div>
                      <div className={`avatar ${sizes[i]}`} style={{ background: i===1?'linear-gradient(135deg, var(--clr-accent), #e8961a)':i===0?'linear-gradient(135deg, #C0C0C0, #A0A0A0)':'linear-gradient(135deg, #CD7F32, #A0522D)', boxShadow: i===1?'var(--shadow-accent)':'var(--shadow-md)' }}>
                        {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div style={{ fontWeight:700, fontSize:'0.875rem', maxWidth:100 }}>{u.name.split(' ')[0]}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color: i===1?'var(--clr-accent)':'var(--clr-text-primary)' }}>{u.score}</div>
                      <div style={{ height:heights[i], width:96, background: i===1?'linear-gradient(180deg, var(--clr-accent), #e8961a)':i===0?'linear-gradient(180deg, #C0C0C0, #A0A0A0)':'linear-gradient(180deg, #CD7F32, #A0522D)', borderRadius:'12px 12px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900, color:'white', boxShadow:'var(--shadow-md)' }}>
                        #{u.rank}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full table */}
              <div className="card" style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'grid', gridTemplateColumns:'50px 1fr 100px 80px 80px 60px', gap:12, fontSize:'0.7rem', fontWeight:700, color:'var(--clr-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  <span>Rank</span><span>Student</span><span>State</span><span>Score</span><span>Streak</span><span>Change</span>
                </div>
                {nationalBoard.map(u => (
                  <div key={u.rank} style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'grid', gridTemplateColumns:'50px 1fr 100px 80px 80px 60px', gap:12, alignItems:'center', background:u.isMe?'var(--clr-primary-50)':'white', transition:'background var(--ease)' }}
                    onMouseEnter={e=>{ if(!u.isMe) e.currentTarget.style.background='var(--clr-bg)'; }}
                    onMouseLeave={e=>{ if(!u.isMe) e.currentTarget.style.background='white'; }}>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.125rem', color: u.rank<=3?'var(--clr-accent)':u.isMe?'var(--clr-primary)':'var(--clr-text-muted)' }}>
                      {u.badge || `#${u.rank}`}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar avatar-sm" style={{ background: u.isMe?'linear-gradient(135deg, var(--clr-accent), #e8961a)':'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light))' }}>
                        {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{ fontWeight:u.isMe?700:500, fontSize:'0.875rem', color:u.isMe?'var(--clr-primary)':'var(--clr-text-primary)' }}>{u.name} {u.isMe&&<span className="badge badge-primary" style={{ fontSize:'0.6rem', padding:'2px 6px' }}>You</span>}</div>
                        <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)' }}>{u.school}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>{u.state}</span>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', color:u.isMe?'var(--clr-primary)':'var(--clr-text-primary)' }}>{u.score}</span>
                    <span style={{ fontSize:'0.875rem', display:'flex', alignItems:'center', gap:4 }}>
                      <Flame size={14} color="var(--clr-accent)" /> {u.streak}d
                    </span>
                    <span style={{ fontSize:'0.875rem', fontWeight:600, color: u.change>0?'var(--clr-success)':u.change<0?'var(--clr-danger)':'var(--clr-text-muted)', display:'flex', alignItems:'center', gap:2 }}>
                      {u.change>0 ? <><TrendingUp size={14} /> {u.change}</> : u.change<0 ? <><TrendingDown size={14} /> {Math.abs(u.change)}</> : <><Minus size={14} /> -</>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Subject leaders + badges */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="card" style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--clr-border-light)' }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem' }}>Subject Champions</h3>
                </div>
                {subjectLeaders.map((l,i) => (
                  <div key={i} style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', alignItems:'center', gap:12, background:l.isMe?'var(--clr-primary-50)':'white' }}>
                    <div className="avatar avatar-sm">{l.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.8125rem', fontWeight:600, color:l.isMe?'var(--clr-primary)':'var(--clr-text-primary)' }}>{l.subject}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', marginTop:2 }}>{l.name}</div>
                    </div>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.9375rem', color:'var(--clr-accent)' }}>{l.score}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem', marginBottom:16 }}>Your Badges</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {badges.map((b,i) => (
                    <div key={i} style={{ padding:'12px', borderRadius:'var(--r-md)', border:`1px solid ${b.earned?'var(--clr-primary-100)':'var(--clr-border-light)'}`, background:b.earned?'var(--clr-primary-50)':'var(--clr-bg)', textAlign:'center', opacity:b.earned?1:0.5 }}>
                      <div style={{ color: b.earned ? b.color : 'var(--clr-text-muted)', marginBottom:6, display:'flex', justifyContent:'center' }}><b.icon size={28} /></div>
                      <div style={{ fontSize:'0.75rem', fontWeight:700, color:b.earned?'var(--clr-primary)':'var(--clr-text-muted)', lineHeight:1.3 }}>{b.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
