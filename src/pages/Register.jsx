import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Check, 
  ChevronLeft, 
  ArrowRight,
  User,
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const steps = ['Account','Profile','Subjects','Plan'];

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT',
    phone: '',
    school: '',
    class: 'SS3',
    state: 'Lagos',
    parentPhone: '',
    exam: 'both',
    subjects: ['Mathematics','English Language'],
    tier: 'FREE'
  });

  const allSubjects = ['Mathematics','English Language','Biology','Chemistry','Physics','Economics','Government','Literature','Accounting','Geography'];

  const toggleSubject = s => {
    setFormData(v => ({
      ...v,
      subjects: v.subjects.includes(s) ? v.subjects.filter(x=>x!==s) : [...v.subjects, s]
    }));
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await api.register(formData);
      setAuth(data.user, data.token);
      
      if (data.user.role === 'PARENT') navigate('/parent');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setStep(0); 
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setFormData(v => ({ ...v, [field]: value }));
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      {/* Left */}
      <div style={{ background:'linear-gradient(160deg, #071812 0%, #0A3D2E 100%)', padding:48, display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,169,36,0.12) 0%, transparent 70%)' }} />
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={20} /></div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.25rem', color:'white' }}>PassPort</span>
        </Link>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'white', lineHeight:1.2, marginBottom:20 }}>Start your journey to <span style={{ color:'var(--clr-accent)' }}>exam success</span></h2>
          {/* Progress steps */}
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:32 }}>
            {steps.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background: i<=step ? 'var(--clr-accent)' : 'rgba(255,255,255,0.1)', color: i<=step ? '#0D1F16' : 'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8125rem', flexShrink:0, transition:'all 0.3s' }}>
                  {i < step ? <Check size={16} strokeWidth={3} /> : i+1}
                </div>
                <span style={{ fontSize:'0.9rem', color: i<=step ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: i===step ? 600 : 400, transition:'all 0.3s' }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:40, padding:'20px', background:'rgba(255,255,255,0.05)', borderRadius:16, border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', marginBottom:8 }}>🎁 Free plan includes</div>
            {['10 past questions/day','JAMB & WAEC access','Basic progress tracking'].map((f,i) => (
              <div key={i} style={{ fontSize:'0.875rem', color:'rgba(255,255,255,0.7)', marginBottom:6, display:'flex', alignItems:'center', gap:8 }}><Check size={14} color="var(--clr-success)" />{f}</div>
            ))}
          </div>
        </div>
        <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.3)' }}>© 2025 PassPort Edtech Ltd.</p>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'white', padding:48 }}>
        <div style={{ width:'100%', maxWidth:440 }}>
          {/* Progress bar */}
          <div style={{ marginBottom:32 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--clr-primary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Step {step+1} of {steps.length}</span>
              <span style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)' }}>{steps[step]}</span>
            </div>
            <div className="progress" style={{ height:4 }}><div className="progress-bar" style={{ width:`${((step+1)/steps.length)*100}%` }} /></div>
          </div>

          {error && <div style={{ background:'var(--clr-danger-bg)', color:'var(--clr-danger)', padding:'12px', borderRadius:'var(--r-sm)', marginBottom:'20px', fontSize:'0.875rem', fontWeight:500, border:'1px solid rgba(220,38,38,0.2)' }}>{error}</div>}

          {step === 0 && (
            <div className="animate-fadeIn">
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:6 }}>Create your account</h2>
              <p style={{ color:'var(--clr-text-secondary)', marginBottom:28, fontSize:'0.9375rem' }}>Already have one? <Link to="/login" style={{ color:'var(--clr-primary)', fontWeight:600 }}>Sign in</Link></p>
              <div style={{ display:'flex', gap:8, marginBottom:28, background:'var(--clr-bg)', borderRadius:'var(--r-sm)', padding:4 }}>
                {['STUDENT','PARENT'].map(r => (
                  <button key={r} onClick={()=>updateForm('role', r)} style={{ flex:1, padding:'10px', borderRadius:'var(--r-sm)', fontWeight:600, fontSize:'0.875rem', background:formData.role===r?'white':'transparent', color:formData.role===r?'var(--clr-primary)':'var(--clr-text-muted)', boxShadow:formData.role===r?'var(--shadow-sm)':'none', transition:'all var(--ease)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    {r === 'STUDENT' ? <User size={16} /> : <Users size={16} />} {r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group"><label className="form-label">First name</label><input className="form-input" placeholder="Adaeze" value={formData.firstName} onChange={e=>updateForm('firstName', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Last name</label><input className="form-input" placeholder="Okonkwo" value={formData.lastName} onChange={e=>updateForm('lastName', e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="form-label">Email address</label><input type="email" className="form-input" placeholder="adaeze@example.com" value={formData.email} onChange={e=>updateForm('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone number</label><input type="tel" className="form-input" placeholder="+234 800 000 0000" value={formData.phone} onChange={e=>updateForm('phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="Min. 8 characters" value={formData.password} onChange={e=>updateForm('password', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:6 }}>Your profile</h2>
              <p style={{ color:'var(--clr-text-secondary)', marginBottom:28 }}>Help us personalise your experience</p>
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div className="form-group"><label className="form-label">School name</label><input className="form-input" placeholder="Federal Government College, Lagos" value={formData.school} onChange={e=>updateForm('school', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Class / Year</label>
                  <select className="form-select" value={formData.class} onChange={e=>updateForm('class', e.target.value)}><option>SS2</option><option>SS3</option><option>Graduate — Retaking</option></select>
                </div>
                <div className="form-group"><label className="form-label">State</label>
                  <select className="form-select" value={formData.state} onChange={e=>updateForm('state', e.target.value)}><option>Lagos</option><option>Abuja (FCT)</option><option>Kano</option><option>Rivers</option><option>Oyo</option><option>Anambra</option><option>Other</option></select>
                </div>
                <div className="form-group"><label className="form-label">Parent's WhatsApp number</label><input type="tel" className="form-input" placeholder="+234 800 000 0000" value={formData.parentPhone} onChange={e=>updateForm('parentPhone', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:6 }}>Choose your exam</h2>
              <p style={{ color:'var(--clr-text-secondary)', marginBottom:24 }}>Select which exams you're preparing for</p>
              <div style={{ display:'flex', gap:10, marginBottom:28 }}>
                {['jamb','waec','both'].map(e => (
                  <button key={e} onClick={()=>updateForm('exam', e)} style={{ flex:1, padding:'14px 8px', borderRadius:'var(--r-md)', border:`2px solid ${formData.exam===e?'var(--clr-primary)':'var(--clr-border)'}`, background:formData.exam===e?'var(--clr-primary-50)':'white', color:formData.exam===e?'var(--clr-primary)':'var(--clr-text-secondary)', fontWeight:700, fontSize:'0.8125rem', cursor:'pointer', transition:'all var(--ease)', textTransform:'uppercase' }}>{e}</button>
                ))}
              </div>
              <p style={{ fontSize:'0.875rem', fontWeight:600, marginBottom:14 }}>Select your subjects (min. 4)</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {allSubjects.map(s => {
                  const sel = formData.subjects.includes(s);
                  return (
                    <button key={s} onClick={()=>toggleSubject(s)} style={{ padding:'10px 14px', borderRadius:'var(--r-sm)', border:`1.5px solid ${sel?'var(--clr-primary)':'var(--clr-border)'}`, background:sel?'var(--clr-primary-50)':'white', color:sel?'var(--clr-primary)':'var(--clr-text-secondary)', fontWeight:sel?600:400, fontSize:'0.8125rem', cursor:'pointer', transition:'all var(--ease)', textAlign:'left', display:'flex', alignItems:'center', gap:8 }}>
                      {sel ? <CheckCircle2 size={16} /> : <Circle size={16} />} {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:800, marginBottom:6 }}>Choose your plan</h2>
              <p style={{ color:'var(--clr-text-secondary)', marginBottom:24 }}>You can upgrade anytime</p>
              {[{id:'FREE',name:'Free',price:'₦0',desc:'10 questions/day, 1 subject preview'},{id:'STANDARD',name:'Standard',price:'₦5,000/mo',desc:'Full lessons, past questions & parent dashboard'},{id:'PREMIUM',name:'Premium',price:'₦8,000/mo',desc:'Everything + live tutoring sessions'}].map((p,i) => (
                <div key={i} onClick={()=>updateForm('tier', p.id)} style={{ padding:'16px 20px', borderRadius:'var(--r-md)', border:`2px solid ${formData.tier===p.id?'var(--clr-primary)':'var(--clr-border)'}`, background:formData.tier===p.id?'var(--clr-primary-50)':'white', marginBottom:12, cursor:'pointer', transition:'all var(--ease)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.9375rem', color:formData.tier===p.id?'var(--clr-primary)':'var(--clr-text-primary)' }}>{p.name} {p.id==='STANDARD'&&<span className="badge badge-primary" style={{ marginLeft:8, fontSize:'0.65rem' }}>POPULAR</span>}</div>
                    <div style={{ fontSize:'0.8125rem', color:'var(--clr-text-muted)', marginTop:4 }}>{p.desc}</div>
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color:formData.tier===p.id?'var(--clr-primary)':'var(--clr-text-primary)', flexShrink:0, marginLeft:16 }}>{p.price}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'flex', gap:12, marginTop:32 }}>
            {step > 0 && <button onClick={()=>setStep(v=>v-1)} className="btn btn-outline" style={{ flex:1, justifyContent:'center', gap:8 }}><ChevronLeft size={18} /> Back</button>}
            <button 
              disabled={loading}
              onClick={()=>{ if(step<steps.length-1) setStep(v=>v+1); else handleRegister(); }} 
              className="btn btn-primary" 
              style={{ flex:2, justifyContent:'center', gap:8 }}
            >
              {loading ? 'Creating account...' : step===steps.length-1?'🚀 Start Learning':<>Continue <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
