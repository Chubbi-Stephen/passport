import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { 
  Target, 
  Clock, 
  ArrowLeft, 
  Flag, 
  FlagOff, 
  CheckCircle2, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Trophy,
  AlertCircle
} from 'lucide-react';

const TOTAL_TIME = 40 * 60; // 40 minutes per subject for mock

function formatTime(secs) {
  const m = Math.floor(secs/60), s = secs%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function ExamSimulator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [started, setStarted] = useState(false);
  const [examData, setExamData] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const timerRef = useRef(null);

  // Load available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.getSubjects();
        setSubjects(data);
        if (data.length > 0) setSelectedSubjectId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, []);

  // Timer logic
  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(v => {
          if (v <= 1) {
            handleComplete();
            return 0;
          }
          return v - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const handleStart = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    try {
      const data = await api.startExam({ 
        subjectId: selectedSubjectId,
        questionCount: 40 
      });
      setExamData(data.questions);
      setSessionId(data.sessionId);
      setStarted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to start exam. Make sure you have questions for this subject.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    clearInterval(timerRef.current);
    setLoading(true);
    try {
      const responses = Object.entries(answers).map(([qId, selectedOption]) => ({
        questionId: qId,
        selectedOption
      }));

      const data = await api.finishExam({
        sessionId,
        responses
      });
      setResultData(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit exam.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = (id) => {
    setFlagged(v => {
      const n = new Set(v);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  if (loading && !started) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="animate-spin" style={{ marginBottom: 12 }}><Clock size={40} /></div>
        <h3>Prepping your exam...</h3>
      </div>
    </div>
  );

  // Setup / Welcome Screen
  if (!started) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #071812, #0A3D2E)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:32, padding:48, maxWidth:540, width:'100%', textAlign:'center', boxShadow:'0 40px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ color:'var(--clr-primary)', marginBottom:20, display:'flex', justifyContent:'center' }}><Target size={64} /></div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.25rem', fontWeight:800, marginBottom:12, color: 'var(--clr-text-primary)' }}>Standard Mock Exam</h1>
        <p style={{ color:'var(--clr-text-secondary)', lineHeight:1.7, marginBottom:32 }}>Simulate the real CBT environment. Questions are randomized and timed.</p>
        
        <div className="form-group" style={{ marginBottom: 32, textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text-muted)', marginBottom: 8, display: 'block' }}>CHOOSE SUBJECT</label>
          <select 
            className="form-select" 
            style={{ width: '100%', height: 56, fontSize: '1rem', borderRadius: 16 }}
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <button className="btn btn-primary btn-lg w-full" style={{ height: 64, borderRadius: 20, fontSize: '1.25rem', justifyContent: 'center' }} onClick={handleStart}>
          Enter Exam Hall
        </button>
        <button className="btn btn-ghost w-full mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );

  // Result Screen
  if (submitted && resultData) {
    const { result, pointsAwarded } = resultData;
    const score = Math.round(result.score);
    return (
      <div style={{ minHeight:'100vh', background:'#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="card animate-fadeInUp" style={{ padding: 48, textAlign: 'center', marginBottom: 24, background: 'white', borderRadius: 32 }}>
            <div style={{ color: 'var(--clr-success)', marginBottom: 16 }}><Trophy size={80} /></div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: 8 }}>Exam Completed!</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--clr-text-secondary)', marginBottom: 40 }}>Excellent work, Candidate.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ padding: 24, background: 'var(--clr-bg)', borderRadius: 24 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>FINAL SCORE</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--clr-primary)' }}>{score}%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>{result.correct} / {result.total} Correct</div>
              </div>
              <div style={{ padding: 24, background: 'var(--clr-primary-50)', borderRadius: 24, border: '2px solid var(--clr-primary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase' }}>POINTS EARNED</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--clr-primary)' }}>+{pointsAwarded}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>Streak Updated! 🔥</div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg w-full" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const q = examData && examData.length > 0 ? examData[current] : null;
  const pct = timeLeft / TOTAL_TIME;
  const timeColor = pct > 0.3 ? 'white' : 'var(--clr-danger)';

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#F1F5F9' }}>
      {/* Exam Hall Header */}
      <div style={{ background: '#0F172A', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <GraduationCap className="text-accent" />
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Candidate Mode</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>Standard CBT Simulator</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.5 }}>TIME REMAINING</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: timeColor, fontFamily: 'monospace' }}>{formatTime(timeLeft)}</div>
          </div>
          <button onClick={handleComplete} className="btn btn-accent btn-sm" style={{ fontWeight: 800 }}>SUBMIT EXAM</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Navigator (Question Map) */}
        <div className="mobile-hidden" style={{ width: 280, background: 'white', borderRight: '1px solid var(--clr-border)', padding: 24, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Question Map</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {examData.map((qn, i) => {
              const isCurrent = current === i;
              const isAnswered = !!answers[qn.id];
              const isFlagged = flagged.has(qn.id);
              
              let bg = '#F1F5F9', color = '#64748B', border = '1px solid transparent';
              if (isCurrent) { bg = 'var(--clr-primary)'; color = 'white'; }
              else if (isFlagged) { bg = '#FEF3C7'; color = '#D97706'; border = '1px solid #FCD34D'; }
              else if (isAnswered) { bg = '#DCFCE7'; color = '#15803D'; }

              return (
                <button 
                  key={qn.id} 
                  onClick={() => setCurrent(i)}
                  style={{ 
                    height: 48, borderRadius: 12, background: bg, color: color, 
                    border, fontSize: '0.875rem', fontWeight: 800 
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Testing Area */}
        <div style={{ flex: 1, padding: 40, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {q ? (
            <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, alignItems: 'center' }}>
                <span className="badge badge-primary">Mathematics</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => toggleFlag(q.id)}
                    className="btn btn-sm" 
                    style={{ background: flagged.has(q.id) ? '#FEF3C7' : 'transparent', color: flagged.has(q.id) ? '#D97706' : 'var(--clr-text-muted)', border: '1px solid #e2e8f0' }}
                  >
                    {flagged.has(q.id) ? <FlagOff size={16} /> : <Flag size={16} />} 
                    <span style={{ marginLeft: 8 }}>{flagged.has(q.id) ? 'Unflag' : 'Flag for Review'}</span>
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: 40, background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.5rem', lineHeight: 1.6, fontWeight: 700, color: '#1E293B', marginBottom: 40 }}>{q.text}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  {['A', 'B', 'C', 'D'].map((letter, i) => {
                    const optionText = q[`option${letter}`];
                    const isSelected = answers[q.id] === letter;
                    return (
                      <button 
                        key={i} 
                        onClick={() => setAnswers(v => ({ ...v, [q.id]: letter }))}
                        style={{ 
                          padding: '20px 24px', textAlign: 'left', borderRadius: 16, border: isSelected ? '2px solid var(--clr-primary)' : '2px solid #E2E8F0',
                          background: isSelected ? 'var(--clr-primary-50)' : 'white', fontSize: '1.1rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 16
                        }}
                      >
                         <div style={{ width: 32, height: 32, borderRadius: 10, background: isSelected ? 'var(--clr-primary)' : '#F1F5F9', color: isSelected ? 'white' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>{letter}</div>
                         {optionText}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={() => setCurrent(v => Math.max(0, v - 1))} disabled={current === 0} style={{ flex: 1, height: 64, borderRadius: 16 }} className="btn btn-outline"><ChevronLeft /> Back</button>
                <button onClick={() => setCurrent(v => Math.min(examData.length - 1, v + 1))} disabled={current === examData.length - 1} style={{ flex: 1, height: 64, borderRadius: 16 }} className="btn btn-primary">Next <ChevronRight /></button>
              </div>
            </div>
          ) : (
             <div className="text-center" style={{ marginTop: 100 }}>
                <AlertCircle size={64} className="text-muted" style={{ marginBottom: 16 }} />
                <h3>No questions in this pack</h3>
                <button className="btn btn-primary mt-4" onClick={() => setStarted(false)}>Go Back</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
