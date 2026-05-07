import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  Users, 
  Flame, 
  TrendingUp, 
  MessageSquare,
  X
} from 'lucide-react';
import { api } from '../utils/api';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getChildren();
        setChildren(data);
      } catch (err) {
        console.error(err);
        if (err.message.includes('Token')) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLinkChild = async (e) => {
    e.preventDefault();
    setLinkLoading(true);
    try {
      await api.linkChild(linkEmail);
      const data = await api.getChildren();
      setChildren(data);
      setShowLinkModal(false);
      setLinkEmail('');
    } catch (err) {
      alert(err.message || 'Failed to link child');
    } finally {
      setLinkLoading(false);
    }
  };

  if (loading) return <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', color:'var(--clr-primary)', fontWeight:700 }}>Loading Parent View...</div>;

  const child = children[activeChild];

  return (
    <div style={{ minHeight:'100vh', background:'var(--clr-bg)' }}>
      {/* Topbar */}
      <header style={{ background:'white', borderBottom:'1px solid var(--clr-border-light)', padding:'0 var(--sp-8)', height:'var(--navbar-h)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={18} /></div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', color:'var(--clr-text-primary)' }}>PassPort</span>
          </Link>
          <div style={{ height:24, width:1, background:'var(--clr-border)' }} />
          <span className="badge badge-primary" style={{ padding:'6px 14px' }}>Parent Dashboard</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setShowLinkModal(true)} className="btn btn-primary btn-sm" style={{ borderRadius:999, gap:8 }}>
            <Plus size={16} /> Link Child
          </button>
          <div className="avatar avatar-md">FO</div>
        </div>
      </header>

      <div style={{ padding:'var(--sp-8)', maxWidth:1280, margin:'0 auto' }}>
        {children.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:64 }}>
            <div style={{ color:'var(--clr-primary)', marginBottom:24, display:'flex', justifyContent:'center' }}><Users size={64} /></div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.5rem', marginBottom:12 }}>No children linked</h2>
            <p style={{ color:'var(--clr-text-muted)', marginBottom:32, maxWidth:400, margin:'0 auto 32px' }}>Link your children using their registration email to monitor their progress and receive weekly WhatsApp reports.</p>
            <button onClick={() => setShowLinkModal(true)} className="btn btn-primary btn-lg" style={{ gap:8 }}>Link Your First Child <Plus size={20} /></button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>
            <div>
              {/* Child selector */}
              <div style={{ display:'flex', gap:16, marginBottom:24, overflowX:'auto', paddingBottom:8 }}>
                {children.map((c,i) => (
                  <button key={c.id} onClick={()=>setActiveChild(i)} style={{ flex:'0 0 300px', padding:'20px 24px', borderRadius:'var(--r-xl)', border:`2px solid ${i===activeChild?'var(--clr-primary)':'var(--clr-border)'}`, background:i===activeChild?'var(--clr-primary-50)':'white', cursor:'pointer', textAlign:'left', transition:'all var(--ease)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                      <div className="avatar avatar-lg">{c.firstName?.[0]}{c.lastName?.[0]}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'1rem', color: i===activeChild?'var(--clr-primary)':'var(--clr-text-primary)' }}>{c.firstName} {c.lastName}</div>
                        <div style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>{c.class} · {c.school}</div>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                      {[{v:`${c.streak}`,l:'streak',icon:Flame},{v:c.points,l:'points',icon:TrendingUp},{v:c.tier,l:'plan',icon:GraduationCap}].map((s,j)=>(
                        <div key={j} style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem', color: i===activeChild?'var(--clr-primary)':'var(--clr-text-primary)', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                            {s.v} {s.icon && <s.icon size={14} color={j===0?'var(--clr-accent)':'currentColor'} />}
                          </div>
                          <div style={{ fontSize:'0.65rem', color:'var(--clr-text-muted)' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Activity Card */}
              <div className="card" style={{ marginBottom:24 }}>
                 <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>Performance Snapshot: {child.firstName}</h3>
                 <p style={{ color:'var(--clr-text-muted)', fontSize:'0.875rem', marginBottom:24 }}>Real-time data from {child.firstName}'s recent study sessions.</p>
                 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
                    <div style={{ padding:20, background:'var(--clr-bg)', borderRadius:12 }}>
                        <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginBottom:4 }}>LAST ACTIVE</div>
                        <div style={{ fontWeight:700 }}>{new Date(child.lastActive).toLocaleDateString()}</div>
                    </div>
                    <div style={{ padding:20, background:'var(--clr-bg)', borderRadius:12 }}>
                        <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginBottom:4 }}>TOTAL POINTS</div>
                        <div style={{ fontWeight:700, color:'var(--clr-primary)' }}>{child.points} XP</div>
                    </div>
                    <div style={{ padding:20, background:'var(--clr-bg)', borderRadius:12 }}>
                        <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginBottom:4 }}>CURRENT STREAK</div>
                        <div style={{ fontWeight:700, color:'var(--clr-accent)' }}>{child.streak} Days</div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: WhatsApp report */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:'linear-gradient(135deg, #25D366, #128C7E)', borderRadius:'var(--r-xl)', padding:24, color:'white' }}>
                <div style={{ marginBottom:12 }}><MessageSquare size={32} /></div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', marginBottom:8 }}>WhatsApp Weekly Digest</h3>
                <p style={{ fontSize:'0.8125rem', opacity:0.85, lineHeight:1.6, marginBottom:16 }}>Receive a summary of your children's progress every Monday morning — directly on WhatsApp.</p>
                <button style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:999, padding:'10px 20px', fontSize:'0.875rem', fontWeight:600, cursor:'pointer', width:'100%' }}>
                  Enabled for your account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link Child Modal */}
      {showLinkModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div className="card animate-fadeInUp" style={{ maxWidth:400, width:'100%', margin:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>Link a Child</h3>
              <button onClick={()=>setShowLinkModal(false)} style={{ background:'none', border:'none', color:'var(--clr-text-muted)', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleLinkChild}>
              <div className="form-group" style={{ marginBottom:20 }}>
                <label className="form-label">Child's Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. emeka@example.com" 
                  required 
                  value={linkEmail}
                  onChange={e=>setLinkEmail(e.target.value)}
                />
                <p style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:8 }}>The child must already have a PassPort account.</p>
              </div>
              <button type="submit" disabled={linkLoading} className="btn btn-primary w-full" style={{ justifyContent:'center' }}>
                {linkLoading ? 'Linking...' : 'Link Child →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
