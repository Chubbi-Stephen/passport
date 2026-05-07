import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Flame, 
  AlertTriangle, 
  Trophy, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header style={{
      height: 'var(--navbar-h)',
      background: 'white',
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
      <div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.125rem', fontWeight:700, color:'var(--clr-text-primary)', lineHeight:1 }}>{title || 'Dashboard'}</h1>
        {subtitle && <p style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:3 }}>{subtitle}</p>}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Search */}
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <span style={{ position:'absolute', left:12, color:'var(--clr-text-muted)' }}><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search topics, subjects…"
            className="form-input"
            style={{ paddingLeft:36, width:220, height:38, fontSize:'0.8125rem', borderRadius:999 }}
          />
        </div>

        {/* Streak */}
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--clr-accent-50)', padding:'6px 12px', borderRadius:999, border:'1px solid rgba(244,169,36,0.2)' }}>
          <Flame size={16} color="var(--clr-accent)" fill="var(--clr-accent)" />
          <span style={{ fontSize:'0.8125rem', fontWeight:700, color:'var(--clr-accent-dark)' }}>14</span>
        </div>

        {/* Notifications */}
        <div style={{ position:'relative' }}>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setNotifOpen(v => !v)}
            style={{ position:'relative', color:'var(--clr-text-secondary)' }}
          >
            <Bell size={20} />
            <span style={{
              position:'absolute', top:6, right:6, width:8, height:8,
              background:'var(--clr-danger)', borderRadius:999,
              border:'2px solid white',
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position:'absolute', right:0, top:'calc(100% + 8px)',
              width:320, background:'white', borderRadius:'var(--r-lg)',
              boxShadow:'var(--shadow-lg)', border:'1px solid var(--clr-border-light)',
              animation:'slideDown 0.2s ease',
              zIndex:200,
            }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:700, fontSize:'0.9rem' }}>Notifications</span>
                <span className="badge badge-danger">3 new</span>
              </div>
              {[
                { icon: AlertTriangle, title:'Weak area alert', body:'You fail Cell Division 70% of the time', time:'5 min ago', color:'var(--clr-danger)' },
                { icon: Trophy, title:'Mock exam result', body:'You scored 72% on Biology mock!', time:'2 hrs ago', color:'var(--clr-success)' },
                { icon: Calendar, title:'Live class reminder', body:'Physics with Mr. Eze starts in 30 min', time:'Today', color:'var(--clr-primary)' },
              ].map((n, i) => (
                <div key={i} style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'flex', gap:12, cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--clr-bg)'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <n.icon size={20} color={n.color} style={{ flexShrink:0, marginTop:2 }} />
                  <div>
                    <div style={{ fontSize:'0.8125rem', fontWeight:600 }}>{n.title}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)', marginTop:2 }}>{n.body}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', marginTop:4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding:'12px 20px', textAlign:'center' }}>
                <button className="btn btn-ghost btn-sm" style={{ color:'var(--clr-primary)', fontSize:'0.8125rem' }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="avatar avatar-md" style={{ cursor:'pointer' }}>AO</div>
      </div>
    </header>
  );
}
