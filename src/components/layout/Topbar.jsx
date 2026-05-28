import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Flame, 
  AlertTriangle, 
  Trophy, 
  Calendar,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return '??';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  };

  return (
    <header style={{
      height: 'var(--navbar-h)',
      background: 'var(--clr-bg-card)',
      borderBottom: '1px solid var(--clr-border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--sp-8)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <button 
          className="btn btn-icon btn-ghost" 
          onClick={onMenuClick}
          style={{ display:'none', padding:8, flexShrink:0 }}
          id="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
        <div style={{ minWidth:0 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.125rem', fontWeight:700, color:'var(--clr-text-primary)', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title || 'Dashboard'}</h1>
          {subtitle && <p className="mobile-hidden" style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:3 }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {/* Search */}
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <span className="mobile-hidden" style={{ position:'absolute', left:12, color:'var(--clr-text-muted)' }}><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search…"
            className="form-input mobile-hidden"
            style={{ paddingLeft:36, width:140, height:38, fontSize:'0.8125rem', borderRadius:999 }}
          />
        </div>

        {/* Streak */}
        <div style={{ display:'flex', alignItems:'center', gap:4, background:'var(--clr-accent-50)', padding:'6px 10px', borderRadius:999, border:'1px solid rgba(244,169,36,0.2)', flexShrink:0 }}>
          <Flame size={14} color="var(--clr-accent)" fill="var(--clr-accent)" />
          <span style={{ fontSize:'0.8125rem', fontWeight:700, color:'var(--clr-accent-dark)' }}>{user?.streak || 0}</span>
        </div>

        {/* Notifications */}
        <div style={{ position:'relative' }} className="mobile-hidden">
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setNotifOpen(v => !v)}
            style={{ position:'relative', color:'var(--clr-text-secondary)', padding:8 }}
          >
            <Bell size={20} />
            <span style={{
              position:'absolute', top:6, right:6, width:8, height:8,
              background:'var(--clr-danger)', borderRadius:999,
              border:'2px solid var(--clr-bg-card)',
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position:'absolute', right:0, top:'calc(100% + 8px)',
              width:280, background:'var(--clr-bg-card)', borderRadius:'var(--r-lg)',
              boxShadow:'var(--shadow-lg)', border:'1px solid var(--clr-border-light)',
              zIndex:200,
            }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:700, fontSize:'0.85rem' }}>Notifications</span>
                <span className="badge badge-danger">3</span>
              </div>
              {[
                { icon: AlertTriangle, title:'Weak area alert', body:'You fail Cell Division 70% of the time', time:'5 min ago', color:'var(--clr-danger)' },
                { icon: Trophy, title:'Mock exam result', body:'You scored 72% on Biology mock!', time:'Yesterday', color:'var(--clr-success)' },
              ].map((n, i) => (
                <div key={i} style={{ padding:'12px 16px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', gap:10 }}>
                  <n.icon size={18} color={n.color} style={{ flexShrink:0, marginTop:2 }} />
                  <div>
                    <div style={{ fontSize:'0.8rem', fontWeight:600 }}>{n.title}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', marginTop:2 }}>{n.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="avatar avatar-sm mobile-hidden" style={{ cursor:'pointer' }}>{getInitials()}</div>
      </div>
    </header>
  );
}
