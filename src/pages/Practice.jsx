import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  SearchX,
  FileText
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { api } from '../utils/api';

const subjectList = ['All','Mathematics','English Language','Biology','Chemistry','Physics'];
const yearList = ['All Years','2024','2023','2022','2021','2020'];

export default function Practice() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selSubject, setSelSubject] = useState('All');
  const [selYear, setSelYear] = useState('All Years');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  const [timedMode, setTimedMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Audio feedback
  const playSound = (type) => {
    try {
      const audio = new Audio(type === 'correct' 
        ? 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3' // Crisp Level Up
        : 'https://cdn.freesound.org/previews/415/415764_6090639-lq.mp3'); // Error buzz
      audio.volume = 0.6; // Boosted volume
      audio.play();
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // Haptic feedback
  const triggerHaptic = (type) => {
    if (window.navigator && window.navigator.vibrate) {
      if (type === 'correct') window.navigator.vibrate([10, 30, 10]);
      else window.navigator.vibrate([50, 100, 50]);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selSubject && selSubject !== 'All') params.subject = selSubject;
        if (selYear && selYear !== 'All' && selYear !== 'All Years') params.year = selYear;
        
        const data = await api.getPractice(params);
        
        if (data && Array.isArray(data)) {
          setQuestions(data.map(q => ({
            ...q,
            // Format options clearly for comparison
            formattedOptions: [
              { letter: 'A', text: q.optionA },
              { letter: 'B', text: q.optionB },
              { letter: 'C', text: q.optionC },
              { letter: 'D', text: q.optionD }
            ].filter(o => o.text),
            answer: q.correctOption,
          })));
          setCurrent(0);
          setSelected({});
          setRevealed({});
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
        if (err.message.includes('401')) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selSubject, selYear]);

  const q = questions[current];
  const totalAnswered = Object.keys(selected).length;
  const totalCorrect = Object.entries(selected).filter(([id, ans]) => {
    const found = questions.find(q => q.id === id);
    return found && found.answer === ans;
  }).length;

  function handleSelect(qId, letter) {
    if (revealed[qId]) return;
    setSelected(v => ({ ...v, [qId]: letter }));
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
  }

  function handleReveal(qId) {
    if (!selected[qId]) return;
    setRevealed(v => ({ ...v, [qId]: true }));
    
    // Feedback Trigger
    const correct = selected[qId] === q.answer;
    playSound(correct ? 'correct' : 'error');
    triggerHaptic(correct ? 'correct' : 'error');
  }

  const handleEndSession = async () => {
    if (totalAnswered === 0) return navigate('/dashboard');
    setSubmitting(true);
    try {
      // Practice sessions don't use the formal exam grading flow —
      // just navigate back. The streak is updated on Mock Exam completion.
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, margin: '0 auto', paddingBottom: 140 }}>
      {/* Compact Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--clr-bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          <select className="form-select" value={selSubject} onChange={e=>setSelSubject(e.target.value)} style={{ padding: '4px 24px 4px 12px', fontSize: '0.75rem', height: 32 }}>
            {subjectList.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--clr-text-muted)', fontWeight: 700 }}>SCORE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--clr-primary)', lineHeight: 1 }}>{totalAnswered > 0 ? Math.round((totalCorrect/totalAnswered)*100) : 0}%</div>
          </div>
          <button onClick={handleEndSession} className="btn btn-dark" style={{ height: 32, padding: '0 12px', fontSize: '0.75rem', borderRadius: 8 }}>End</button>
        </div>
      </div>

      {/* Main Focus Area */}
      {loading ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>Loading Questions...</div>
      ) : q ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className={`card ${revealed[q.id] ? (selected[q.id] === q.answer ? 'animate-fadeIn' : 'animate-shake') : 'animate-fadeIn'}`} style={{ padding: '32px 24px', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-primary">{q.subject?.name}</span>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-muted)', background: 'var(--clr-border-light)', padding: '4px 12px', borderRadius: 6 }}>
                {current + 1} / {questions.length}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.5, marginBottom: 32, color: 'var(--clr-text-primary)' }}>
              {q.text}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 8 }}>
              {q.formattedOptions.map((opt, i) => {
                const isSelected = selected[q.id] === opt.letter;
                const isCorrect = opt.letter === q.answer;
                const isRevealed = revealed[q.id];
                
                let bg = 'var(--clr-bg-card)';
                let border = 'var(--clr-border)';
                let color = 'var(--clr-text-primary)';
                
                if (isRevealed && isCorrect) { bg = 'var(--clr-success-bg)'; border = 'transparent'; color = 'var(--clr-success)'; }
                else if (isRevealed && isSelected && !isCorrect) { bg = 'var(--clr-danger-bg)'; border = 'transparent'; color = 'var(--clr-danger)'; }
                else if (isSelected) { bg = 'rgba(10,102,64,0.05)'; border = 'var(--clr-primary)'; color = 'var(--clr-primary)'; }
                
                return (
                  <button 
                    key={i} 
                    onClick={() => handleSelect(q.id, opt.letter)} 
                    className={isSelected ? 'animate-pop' : ''}
                    style={{ 
                      padding: '20px', borderRadius: 16, border: `2px solid ${border}`, background: bg, color: color, textAlign: 'left', fontSize: '1.05rem', cursor: isRevealed ? 'default' : 'pointer', fontWeight: isSelected || (isCorrect && isRevealed) ? 700 : 500, display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)', transform: isSelected && !isRevealed ? 'scale(1.02)' : 'none', position: 'relative'
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: isSelected ? 'var(--clr-primary)' : 'var(--clr-border-light)', color: isSelected ? 'white' : 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0 }}>
                      {opt.letter}
                    </div>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {!revealed[q.id] && (
            <div style={{ padding: '0 8px' }}>
              <button 
                onClick={() => handleReveal(q.id)} 
                disabled={!selected[q.id]} 
                className="btn btn-primary w-full" 
                style={{ height: 56, borderRadius: 16, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: selected[q.id] ? '0 8px 16px rgba(10,102,64,0.3)' : 'none' }}
              >
                Check Answer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: 60, borderRadius: 24 }}>
          <SearchX size={64} className="text-muted" style={{ marginBottom: 16, opacity: 0.2 }} />
          <h3 style={{ fontWeight: 800 }}>No Questions Loaded</h3>
          <p className="text-muted">Pick a subject or import some questions to start.</p>
        </div>
      )}

      {/* Answer Feedback Bar (The Duolingo Feel) */}
      {q && revealed[q.id] && (
        <div className="animate-fadeInUp" style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          background: selected[q.id] === q.answer ? '#dcfce7' : '#fee2e2',
          padding: '24px 32px 40px', zIndex: 1000,
          borderTop: `2px solid ${selected[q.id] === q.answer ? '#86efac' : '#fca5a5'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ maxWidth: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            {/* Left side: Icon + Text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                width: 56, height: 56, borderRadius: '50%', 
                background: selected[q.id] === q.answer ? '#16a34a' : '#dc2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
              }}>
                {selected[q.id] === q.answer ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, 
                  color: selected[q.id] === q.answer ? '#166534' : '#991b1b', margin: 0 
                }}>
                  {selected[q.id] === q.answer ? 'Excellent!' : 'Correct Answer:'}
                </h3>
                <p style={{ color: selected[q.id] === q.answer ? '#14532d' : '#7f1d1d', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>
                  {selected[q.id] === q.answer ? 'You found the right solution.' : `It was Option ${q.answer}`}
                </p>
              </div>
            </div>

            {/* Right side: Action */}
            <button 
              onClick={() => setCurrent(v => Math.min(questions.length-1, v+1))} 
              className="btn"
              style={{ 
                height: 56, padding: '0 40px', borderRadius: 16, border: 'none',
                background: selected[q.id] === q.answer ? '#16a34a' : '#dc2626',
                color: 'white', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Floating Navigator Footer */}
      {!revealed[q?.id] && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--clr-bg-sidebar)', padding: '12px 20px', display: 'flex', gap: 8, overflowX: 'auto', borderTop: '1px solid var(--clr-border)', zIndex: 100 }}>
          {questions.map((qn, i) => {
            const rev = revealed[qn.id];
            const isSel = selected[qn.id];
            const isCorrect = isSel === qn.answer;
            const isCurrent = i === current;
            let bg = 'rgba(255,255,255,0.05)', color = 'rgba(255,255,255,0.4)';
            if (isCurrent) { bg = 'var(--clr-primary)'; color = 'white'; }
            else if (rev) { bg = isCorrect ? 'var(--clr-success)' : 'var(--clr-danger)'; color = 'white'; }
            else if (isSel) { bg = 'rgba(255,255,255,0.2)'; color = 'white'; }
            return (
              <button key={qn.id} onClick={() => setCurrent(i)} style={{ minWidth: 36, height: 36, borderRadius: 8, background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
