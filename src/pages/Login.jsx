import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Flame, 
  BarChart3, 
  Calendar, 
  Eye, 
  EyeOff, 
  ArrowRight,
  User,
  Users
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ ...formData, role });
      setAuth(data.user, data.token);
      
      if (data.user.role === 'PARENT') navigate('/parent');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2" style={{ minHeight:'100vh', gap:0 }}>
      {/* Left panel */}
      <div className="mobile-hidden" style={{ background:'linear-gradient(160deg, #071812 0%, #0A6640 100%)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', bottom:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,169,36,0.1) 0%, transparent 70%)' }} />
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={20} /></div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.25rem', color:'white' }}>PassPort</span>
        </Link>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'2.25rem', fontWeight:800, color:'white', lineHeight:1.2, marginBottom:20 }}>
            Welcome back.<br/>Your <span style={{ color:'var(--clr-accent)' }}>exam awaits.</span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1rem', lineHeight:1.7, marginBottom:40 }}>Every day you study is a day closer to your score. Let's continue where you left off.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[{icon:Flame, label:'14-day study streak active'},{icon:BarChart3, label:'Last mock: 72% Biology'},{icon:Calendar, label:'47 days until WAEC'}].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>
                <s.icon size={18} /> {s.label}
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.3)' }}>© 2025 PassPort Edtech Ltd.</p>
      </div>

      {/* Right panel */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'white', padding:'48px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:6 }}>Sign in</h2>
          <p style={{ color:'var(--clr-text-secondary)', marginBottom:32, fontSize:'0.9375rem' }}>Don't have an account? <Link to="/register" style={{ color:'var(--clr-primary)', fontWeight:600 }}>Sign up free</Link></p>

          {/* Role toggle */}
          <div style={{ display:'flex', gap:8, marginBottom:32, background:'var(--clr-bg)', borderRadius:'var(--r-sm)', padding:4 }}>
            {['STUDENT','PARENT'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:'10px', borderRadius:'var(--r-sm)', fontWeight:600, fontSize:'0.875rem', background: role===r ? 'white' : 'transparent', color: role===r ? 'var(--clr-primary)' : 'var(--clr-text-muted)', boxShadow: role===r ? 'var(--shadow-sm)' : 'none', transition:'all var(--ease)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {r === 'STUDENT' ? <><User size={16} /> Student</> : <><Users size={16} /> Parent</>}
              </button>
            ))}
          </div>

          {error && <div style={{ background:'var(--clr-danger-bg)', color:'var(--clr-danger)', padding:'12px', borderRadius:'var(--r-sm)', marginBottom:'20px', fontSize:'0.875rem', fontWeight:500, border:'1px solid rgba(220,38,38,0.2)' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="adaeze@example.com" 
                required 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display:'flex', justifyContent:'space-between' }}>
                Password <a href="#" style={{ color:'var(--clr-primary)', fontSize:'0.8125rem', fontWeight:500 }}>Forgot password?</a>
              </label>
              <div style={{ position:'relative' }}>
                <input 
                  type={show ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="Enter your password" 
                  required 
                  style={{ paddingRight:44 }}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShow(v=>!v)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'var(--clr-text-muted)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full" style={{ justifyContent:'center', marginTop:4, gap:8 }}>
              {loading ? 'Signing in...' : <>Sign in <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'28px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--clr-border-light)' }} />
            <span style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>or continue with</span>
            <div style={{ flex:1, height:1, background:'var(--clr-border-light)' }} />
          </div>

          <div style={{ display:'flex', gap:12 }}>
            {[{ icon:'G', label:'Google', bg:'#4285F4' },{ icon:'📱', label:'Phone', bg:'var(--clr-primary)' }].map((p,i) => (
              <button key={i} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', border:'1.5px solid var(--clr-border)', borderRadius:'var(--r-sm)', fontWeight:600, fontSize:'0.875rem', color:'var(--clr-text-primary)', background:'white', cursor:'pointer', transition:'all var(--ease)' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--clr-primary)';e.currentTarget.style.background='var(--clr-primary-50)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--clr-border)';e.currentTarget.style.background='white';}}>
                <span style={{ width:22, height:22, borderRadius:'50%', background:p.bg, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800 }}>{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
