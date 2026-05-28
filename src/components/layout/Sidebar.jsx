import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  PenTool, 
  Target, 
  Gem, 
  Trophy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen, label: 'Lessons', to: '/lessons' },
  { icon: Video, label: 'Live Classes', to: '/live' },
  { icon: PenTool, label: 'Practice', to: '/practice' },
  { icon: Target, label: 'Mock Exam', to: '/exam' },
  { icon: Gem, label: 'Upgrade', to: '/upgrade' },
  { icon: Trophy, label: 'Leaderboard', to: '/leaderboard' },
  { icon: SettingsIcon, label: 'Settings', to: '/settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return '??';
    return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || user.email[0].toUpperCase();
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:99, display:'none' }}
        />
      )}

      <aside className={`sidebar ${!collapsed ? 'open' : ''}`} style={{
        width: collapsed ? '72px' : 'var(--sidebar-w)',
        background: 'var(--clr-bg-sidebar)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--ease)',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 12,
        }}>
          {!collapsed && (
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background:'linear-gradient(135deg, var(--clr-accent), #e8961a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: 'white', flexShrink:0,
              }}><GraduationCap size={20} /></div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', color:'white', letterSpacing:'-0.02em' }}>PassPort</span>
            </Link>
          )}
          {collapsed && (
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, var(--clr-accent), #e8961a)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><GraduationCap size={20} /></div>
          )}
          <button
            onClick={onToggle}
            className="btn btn-icon"
            style={{ color:'rgba(255,255,255,0.5)', minWidth:32, minHeight:32, borderRadius:8 }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Exam Countdown */}
        {!collapsed && (
          <div style={{ margin:'16px 16px 0', padding:'12px 16px', background:'linear-gradient(135deg, rgba(244,169,36,0.15), rgba(244,169,36,0.05))', borderRadius:12, border:'1px solid rgba(244,169,36,0.2)' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:600, color:'var(--clr-accent)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:4 }}>WAEC Countdown</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, color:'white', lineHeight:1 }}>47 <span style={{ fontSize:'0.75rem', fontWeight:500, color:'rgba(255,255,255,0.5)' }}>days left</span></div>
            <div style={{ marginTop:8, height:4, background:'rgba(255,255,255,0.1)', borderRadius:999, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'62%', background:'linear-gradient(90deg, var(--clr-accent), #e8961a)', borderRadius:999 }} />
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4, overflowY:'auto' }}>
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding: collapsed ? '12px 0' : '10px 14px',
                  borderRadius:10, justifyContent: collapsed ? 'center' : 'flex-start',
                  color: active ? 'white' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all var(--ease)',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
              >
                {active && <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:3, height:20, background:'var(--clr-accent)', borderRadius:'0 4px 4px 0' }} />}
                <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user */}
        {!collapsed && (
          <div style={{ padding:'16px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div className="avatar avatar-md" style={{ flexShrink:0 }}>{getInitials()}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.875rem', fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.firstName} {user?.lastName}</div>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>{user?.class || 'Student'} · {user?.tier || 'FREE'}</div>
              </div>
              <button onClick={handleLogout} title="Sign out" style={{ color:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', transition:'color var(--ease)', background:'none', border:'none', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

    </>
  );
}
