import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  BookOpen, 
  BarChart3, 
  Gem, 
  Target, 
  FileText, 
  Lightbulb, 
  Rocket,
  ChevronRight
} from 'lucide-react';
import { api } from '../utils/api';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card card-hover" style={{ display:'flex', gap:16, alignItems:'center' }}>
      <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color: color, flexShrink:0 }}>
        <Icon size={24} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{label}</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.625rem', fontWeight:800, color:'var(--clr-text-primary)', lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await api.getDashboard();
        setData(dashboard);
      } catch (err) {
        console.error(err);
        if (err.message.includes('Token')) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div style={{ display:'flex', minHeight:'50vh', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)', fontWeight:700 }}>Loading Dashboard...</div>;
  if (!data) return null;

  const { user, recentAttempts, overallProgress } = data;

  return (
    <>

          {/* Exam countdown banner */}
          <div style={{ background:'linear-gradient(135deg, #071812, #0A6640)', borderRadius:'var(--r-xl)', padding:'20px 28px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>WAEC Examination</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'white' }}>
                <span style={{ color:'var(--clr-accent)', fontSize:'2.5rem' }}>47</span> days remaining
              </div>
              <div style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)', marginTop:6 }}>Exam date: 23 June 2025 · Tier: <span style={{ color:'var(--clr-accent)', fontWeight:700 }}>{user.tier}</span></div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'var(--clr-accent)' }}>{user.points > 200 ? '287' : '---'}</div>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>Predicted Score</div>
              </div>
              <Link to="/exam"><button className="btn btn-accent" style={{ borderRadius:999, gap:8 }}><Target size={18} /> Take Mock Exam</button></Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid-4" style={{ marginBottom:24 }}>
            <StatCard icon={Flame} label="Study Streak" value={user.streak} sub="days in a row" color="#F4A924" />
            <StatCard icon={BookOpen} label="Lessons Done" value={overallProgress} sub="total completed" color="#0A6640" />
            <StatCard icon={BarChart3} label="Avg Mock Score" value={recentAttempts.length ? `${Math.round(recentAttempts.reduce((acc,curr)=>acc+curr.score,0)/recentAttempts.length)}%` : '0%'} sub="last sessions" color="#2563EB" />
            <StatCard icon={Gem} label="PassPort Points" value={user.points} sub="rank: Silver" color="#16A34A" />
          </div>

          <div className="grid-2" style={{ marginBottom:24 }}>
            {/* Recent Mocks */}
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem' }}>Recent Performance</h3>
                  <p style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:3 }}>Your last {recentAttempts.length} mock sessions</p>
                </div>
                <Link to="/practice" className="badge badge-primary">Practice more</Link>
              </div>
              <div style={{ maxHeight:360, overflowY:'auto' }}>
                {recentAttempts.length > 0 ? recentAttempts.map((attempt, i) => (
                  <div key={i} style={{ padding:'16px 24px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'var(--clr-primary-50)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)', flexShrink:0 }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.8125rem', fontWeight:600, color:'var(--clr-text-primary)' }}>Mock Exam Attempt</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:2 }}>{new Date(attempt.date).toLocaleDateString()} · {Math.round(attempt.duration / 60)} mins</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'1rem', fontWeight:800, color:'var(--clr-primary)' }}>{attempt.score}/{attempt.total}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)' }}>{Math.round((attempt.score/attempt.total)*100)}%</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding:40, textAlign:'center', color:'var(--clr-text-muted)' }}>No mock attempts yet. Start practicing!</div>
                )}
              </div>
            </div>

            {/* Weekly Streak Card */}
            <div className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem', display:'flex', alignItems:'center', gap:8 }}>Weekly Progress <Flame size={16} color="var(--clr-accent)" /></h3>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:800, color:'var(--clr-accent)' }}>{user.streak}</span>
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between', flexWrap:'wrap' }}>
                {['M','T','W','T','F','S','S'].map((day, i) => {
                  const isActive = i < (user.streak % 7);
                  return (
                    <div key={i} style={{ flex:'1 1 auto', minWidth:32, textAlign:'center' }}>
                      <div style={{ height:36, borderRadius:8, background: isActive ? 'linear-gradient(135deg, var(--clr-accent), #e8961a)' : 'var(--clr-bg)', border: isActive ? 'none' : '1px solid var(--clr-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', marginBottom:6 }}>
                        {isActive ? <Flame size={14} fill="white" /> : ''}
                      </div>
                      <div style={{ fontSize:'0.65rem', color:'var(--clr-text-muted)', fontWeight:600 }}>{day}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:24, padding:16, background:'var(--clr-primary-50)', borderRadius:12 }}>
                <div style={{ fontSize:'0.8125rem', fontWeight:600, color:'var(--clr-primary)' }}>Goal Progress</div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--clr-text-muted)', margin:'8px 0 4px' }}>
                  <span>3/5 modules done</span><span>60%</span>
                </div>
                <div className="progress" style={{ height:6 }}><div className="progress-bar" style={{ width:'60%' }} /></div>
              </div>
            </div>
          </div>

          {/* Personalized recommendations */}
          <div className="card">
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom:16 }}>AI Recommendations</h3>
            <div className="grid-2">
              <div style={{ padding:16, border:'1px solid var(--clr-border)', borderRadius:12, display:'flex', gap:12 }}>
                <div style={{ color:'var(--clr-warning)', flexShrink:0 }}><Lightbulb size={24} /></div>
                <div>
                  <div style={{ fontSize:'0.875rem', fontWeight:700 }}>Focus on Biology Genetics</div>
                  <p style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:4 }}>You failed 3 questions on Mendelian Laws yesterday. Rewatch the week 2 lesson.</p>
                  <Link to="/lessons"><button className="btn btn-sm btn-ghost" style={{ padding:0, marginTop:8, color:'var(--clr-primary)', fontWeight:700, gap:4 }}>Watch Lesson <ChevronRight size={14} /></button></Link>
                </div>
              </div>
              <div style={{ padding:16, border:'1px solid var(--clr-border)', borderRadius:12, display:'flex', gap:12 }}>
                <div style={{ color:'var(--clr-primary)', flexShrink:0 }}><Rocket size={24} /></div>
                <div>
                  <div style={{ fontSize:'0.875rem', fontWeight:700 }}>Increase Mock Speed</div>
                  <p style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:4 }}>You spent 4 mins on Math integration questions. Aim for 2 mins to finish JAMB early.</p>
                  <Link to="/practice"><button className="btn btn-sm btn-ghost" style={{ padding:0, marginTop:8, color:'var(--clr-primary)', fontWeight:700, gap:4 }}>Timed Practice <ChevronRight size={14} /></button></Link>
                </div>
              </div>
            </div>
          </div>

    </>
  );
}
