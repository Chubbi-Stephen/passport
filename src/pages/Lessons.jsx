import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Lock,
  Check,
  Clock,
  Eye,
  X,
  BookOpen,
  Video,
  Loader2
} from 'lucide-react';
import { api } from '../utils/api';

const subjects = ['All', 'Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics'];

const subjectColors = {
  Biology: '#EBF5F0',
  Mathematics: '#DCFCE7',
  Chemistry: '#FEF3C7',
  Physics: '#DBEAFE',
  'English Language': '#FEE2E2'
};
const subjectAccents = {
  Biology: 'var(--clr-primary)',
  Mathematics: 'var(--clr-success)',
  Chemistry: 'var(--clr-warning)',
  Physics: 'var(--clr-info)',
  'English Language': 'var(--clr-danger)'
};

export default function Lessons() {
  const [selSubject, setSelSubject] = useState('All');
  const [playing, setPlaying] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    try {
      const data = await api.getLessons();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handlePlay = async (lesson) => {
    if (lesson.locked) return;
    setPlaying(lesson);

    // If lesson not started at all, mark it as started (25%)
    if (lesson.progress === 0) {
      try {
        await api.updateLessonProgress(lesson.id, { completed: false, percentage: 25 });
        fetchLessons(); // Refresh silently
      } catch (err) {
        console.error('Progress update failed:', err);
      }
    }
  };

  const handleMarkComplete = async (lesson) => {
    try {
      await api.updateLessonProgress(lesson.id, { completed: true, percentage: 100 });
      setPlaying(null);
      fetchLessons();
    } catch (err) {
      console.error('Mark complete failed:', err);
    }
  };

  const filtered = lessons.filter(l => selSubject === 'All' || l.subject === selSubject);
  const completedCount = lessons.filter(l => l.completed).length;
  const total = lessons.length;

  return (
    <>
      {/* Progress overview banner */}
      <div style={{ background: 'linear-gradient(135deg, #071812, #0A4F2F)', borderRadius: 'var(--r-xl)', padding: '24px 28px', marginBottom: 24, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Your Progress</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            {completedCount}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>/{total} lessons</span>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
            <span>Overall completion</span>
            <span style={{ color: 'var(--clr-accent)', fontWeight: 700 }}>{total > 0 ? Math.round((completedCount / total) * 100) : 0}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${total > 0 ? (completedCount / total) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--clr-accent), #e8961a)', borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {subjects.slice(1).map(s => {
            const subLessons = lessons.filter(l => l.subject === s);
            const done = subLessons.filter(l => l.completed).length;
            return (
              <div key={s} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: done === subLessons.length && subLessons.length > 0 ? 'var(--clr-accent)' : 'white' }}>{done}/{subLessons.length}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setSelSubject(s)} style={{ padding: '9px 18px', borderRadius: 999, border: `1.5px solid ${selSubject === s ? 'var(--clr-primary)' : 'var(--clr-border)'}`, background: selSubject === s ? 'var(--clr-primary)' : 'transparent', color: selSubject === s ? 'white' : 'var(--clr-text-secondary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', transition: 'all var(--ease)' }}>{s}</button>
        ))}
      </div>

      {/* Lesson grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, color: 'var(--clr-primary)', gap: 12, fontWeight: 600 }}>
          <Loader2 size={24} className="animate-spin" /> Loading lessons...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--clr-text-muted)' }}>No lessons found for this subject yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(lesson => (
            <div key={lesson.id} className="card card-hover" style={{ padding: 0, overflow: 'hidden', opacity: lesson.locked ? 0.65 : 1 }}>
              {/* Thumbnail */}
              <div
                style={{ height: 140, background: subjectColors[lesson.subject] || 'var(--clr-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: lesson.locked ? 'not-allowed' : 'pointer', color: subjectAccents[lesson.subject] }}
                onClick={() => handlePlay(lesson)}
              >
                <BookOpen size={56} />
                {lesson.locked ? (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                    <Lock size={28} color="white" />
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>Complete previous lesson</span>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-primary)', opacity: 0, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                )}
                <span className="badge" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)', fontSize: '0.7rem', gap: 4 }}>
                  <Clock size={12} /> {lesson.duration}
                </span>
                {lesson.completed && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--clr-success)', color: 'white', borderRadius: 999, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={12} strokeWidth={3} /> Done
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <span className="badge" style={{ background: subjectColors[lesson.subject], color: subjectAccents[lesson.subject], fontSize: '0.7rem' }}>{lesson.subject}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {lesson.views.toLocaleString()}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 12, lineHeight: 1.4 }}>{lesson.topic}</h3>
                {lesson.progress > 0 && !lesson.completed && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginBottom: 6 }}>
                      <span>In progress</span><span style={{ fontWeight: 600, color: 'var(--clr-primary)' }}>{lesson.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: 4 }}><div className="progress-bar" style={{ width: `${lesson.progress}%` }} /></div>
                  </div>
                )}
                <button
                  disabled={lesson.locked}
                  onClick={() => handlePlay(lesson)}
                  className={`btn ${lesson.locked ? 'btn-ghost' : lesson.completed ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--r-sm)', cursor: lesson.locked ? 'not-allowed' : 'pointer', gap: 8 }}
                >
                  {lesson.locked ? <><Lock size={14} /> Locked</> : lesson.completed ? <><RotateCcw size={14} /> Rewatch</> : lesson.progress > 0 ? <><Play size={14} /> Continue</> : <><Play size={14} /> Start Lesson</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video player modal */}
      {playing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setPlaying(null)}>
          <div style={{ background: '#0D1F16', borderRadius: 'var(--r-xl)', maxWidth: 800, width: '100%', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #071812, #0A3D2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--clr-accent)' }}>
              <Video size={80} />
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Video player — connects to Cloudflare Stream / Bunny.net CDN</div>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'white' }}>{playing.topic}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{playing.subject} · {playing.duration}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {!playing.completed && (
                  <button
                    onClick={() => handleMarkComplete(playing)}
                    style={{ background: 'var(--clr-success)', border: 'none', color: 'white', borderRadius: 999, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Check size={16} /> Mark Complete
                  </button>
                )}
                <button onClick={() => setPlaying(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 999, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <X size={16} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
