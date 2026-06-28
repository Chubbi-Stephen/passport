import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame,
  Zap,
  Target,
  BookOpen,
  Gem,
  Loader2
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const badges = [
  { icon: Flame, name:'14-Day Streak', desc:'Studied 14 days in a row', earned:true, color:'var(--clr-accent)' },
  { icon: Zap, name:'Speed Demon', desc:'Completed 50 questions in under 30 min', earned:true, color:'#2563EB' },
  { icon: Target, name:'Sharpshooter', desc:'Scored 90%+ on a mock', earned:false, color:'var(--clr-danger)' },
  { icon: BookOpen, name:'Scholar', desc:'Completed all lessons in a subject', earned:false, color:'var(--clr-success)' },
  { icon: Trophy, name:'Top 10 National', desc:'Reach top 10 on the national board', earned:false, color:'var(--clr-warning)' },
  { icon: Gem, name:'Diamond', desc:'Achieve a 30-day streak', earned:false, color:'var(--clr-primary)' },
];

function getInitials(firstName, lastName) {
  return `${(firstName || '?')[0]}${(lastName || '?')[0]}`.toUpperCase();
}

export default function Leaderboard() {
  const { user: authUser } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getLeaderboard();
        setBoard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const myEntry = board.find(s => s.firstName === authUser?.firstName && s.lastName === authUser?.lastName);
  const myRank = myEntry ? board.indexOf(myEntry) + 1 : null;
  const top3 = board.slice(0, 3);
  // Podium order: 2nd, 1st, 3rd
  const podium = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <>
      {/* My rank banner */}
      <div style={{ background:'linear-gradient(135deg, #071812, #0A6640)', borderRadius:'var(--r-xl)', padding:'24px 28px', marginBottom:24, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'3.5rem', fontWeight:900, color:'var(--clr-accent)', lineHeight:1 }}>
            {myRank ? `#${myRank}` : '—'}
          </div>
          <div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Your National Rank</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', color:'white' }}>
              {authUser?.firstName || 'Student'} {authUser?.lastName || ''}
            </div>
            <div style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.5)', marginTop:2 }}>
              🔥 {authUser?.streak || 0}-day streak · {authUser?.points || 0} pts
            </div>
          </div>
        </div>
        <div className="mobile-hidden" style={{ height:60, width:1, background:'rgba(255,255,255,0.1)', margin:'0 8px' }} />
        <div style={{ display:'flex', gap:28 }}>
          {[
            { v: authUser?.points || 0, l: 'Total Points' },
            { v: myRank ? `#${myRank}` : 'Unranked', l: 'Your Position' }
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:800, color: i===1?'var(--clr-success)':'var(--clr-accent)' }}>{s.v}</div>
              <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24 }}>
        <div>
          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80, gap:12, color:'var(--clr-text-muted)' }}>
              <Loader2 size={28} style={{ animation:'spin 1s linear infinite' }} /> Loading live rankings...
            </div>
          ) : (
            <>
              {/* Podium */}
              {podium.length >= 3 && (
                <div style={{ display:'flex', gap:12, marginBottom:24, alignItems:'flex-end', justifyContent:'center', padding:'24px 0', flexWrap:'wrap' }}>
                  {podium.map((u, i) => {
                    const heights = [140, 180, 120];
                    const colors = ['#C0C0C0', 'var(--clr-accent)', '#CD7F32'];
                    const gradients = [
                      'linear-gradient(180deg,#C0C0C0,#A0A0A0)',
                      'linear-gradient(180deg,var(--clr-accent),#e8961a)',
                      'linear-gradient(180deg,#CD7F32,#A0522D)'
                    ];
                    const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                    return (
                      <div key={u.id || i} style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                        <div style={{ color: colors[i] }}>{i===1 ? <Trophy size={28} /> : <Medal size={24} />}</div>
                        <div className="avatar avatar-lg" style={{ background: gradients[i], boxShadow: i===1?'var(--shadow-accent)':'var(--shadow-md)', fontSize:'1.1rem', fontWeight:800 }}>
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div style={{ fontWeight:700, fontSize:'0.8125rem', maxWidth:100 }}>{u.firstName}</div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color: i===1?'var(--clr-accent)':'var(--clr-text-primary)' }}>{u.points} pts</div>
                        <div style={{ height:heights[i], width:80, background: gradients[i], borderRadius:'12px 12px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:900, color:'white', boxShadow:'var(--shadow-md)' }}>
                          #{rank}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="card" style={{ padding:0, overflowX:'auto' }}>
                <div style={{ minWidth:500 }}>
                  <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'grid', gridTemplateColumns:'50px 1fr 100px 100px 80px', gap:12, fontSize:'0.7rem', fontWeight:700, color:'var(--clr-text-muted)', textTransform:'uppercase' }}>
                    <span>Rank</span><span>Student</span><span>State</span><span>Points</span><span>Streak</span>
                  </div>
                  {board.length === 0 ? (
                    <div style={{ padding:40, textAlign:'center', color:'var(--clr-text-muted)' }}>No students on the board yet. Complete a mock exam to appear!</div>
                  ) : board.map((u, idx) => {
                    const rank = idx + 1;
                    const isMe = u.firstName === authUser?.firstName && u.lastName === authUser?.lastName;
                    return (
                      <div key={u.id || idx} style={{ padding:'14px 20px', borderBottom:'1px solid var(--clr-border-light)', display:'grid', gridTemplateColumns:'50px 1fr 100px 100px 80px', gap:12, alignItems:'center', background: isMe ? 'var(--clr-primary-50)' : 'white' }}>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.0625rem', color: rank===1?'#F59E0B':rank===2?'#94A3B8':rank===3?'#CD7F32':isMe?'var(--clr-primary)':'var(--clr-text-muted)' }}>
                          {rank<=3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="avatar avatar-sm">{getInitials(u.firstName, u.lastName)}</div>
                          <div style={{ fontWeight: isMe?700:500, fontSize:'0.875rem' }}>
                            {u.firstName} {u.lastName} {isMe && <span style={{ fontSize:'0.65rem', color:'var(--clr-primary)', fontWeight:700 }}>(You)</span>}
                          </div>
                        </div>
                        <span style={{ fontSize:'0.75rem', color:'var(--clr-text-muted)' }}>{u.state || '—'}</span>
                        <span style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>{u.points}</span>
                        <span style={{ fontSize:'0.8125rem', display:'flex', alignItems:'center', gap:4 }}>
                          <Flame size={12} color={u.streak > 0 ? 'var(--clr-accent)' : 'var(--clr-border)'} />
                          {u.streak}d
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div className="card">
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem', marginBottom:16 }}>Badges</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {badges.slice(0, 4).map((b, i) => (
                <div key={i} style={{ padding:'10px', borderRadius:'var(--r-md)', background:b.earned?'var(--clr-primary-50)':'var(--clr-bg)', textAlign:'center', opacity:b.earned?1:0.5, border:'1px solid var(--clr-border-light)' }}>
                  <div style={{ color: b.earned?b.color:'var(--clr-text-muted)', marginBottom:4, display:'flex', justifyContent:'center' }}><b.icon size={20} /></div>
                  <div style={{ fontSize:'0.7rem', fontWeight:700 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background:'linear-gradient(135deg,#071812,#0A3D2E)', color:'white' }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem', marginBottom:8, color:'white' }}>🏆 How to Climb</h3>
            <ul style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.7)', lineHeight:2, paddingLeft:16 }}>
              <li>Complete Mock Exams to earn Points</li>
              <li>Higher scores = More Points earned</li>
              <li>Maintain daily streaks for bonus XP</li>
              <li>Top 3 win the Weekly Trophy 🎖️</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

