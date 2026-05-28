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

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selSubject !== 'All') params.subject = selSubject;
        if (selYear !== 'All Years') params.year = selYear;
        
        const data = await api.getPractice(params);
        setQuestions(data.map(q => ({
          ...q,
          options: JSON.parse(q.options)
        })));
        setCurrent(0);
        setSelected({});
        setRevealed({});
      } catch (err) {
        console.error(err);
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

  function handleSelect(qId, opt) {
    if (revealed[qId]) return;
    setSelected(v => ({ ...v, [qId]: opt[0] }));
  }

  function handleReveal(qId) {
    if (!selected[qId]) return;
    setRevealed(v => ({ ...v, [qId]: true }));
  }

  const handleEndSession = async () => {
    if (totalAnswered === 0) return navigate('/dashboard');
    setSubmitting(true);
    try {
      await api.submitExam({
        score: totalCorrect,
        total: questions.length,
        duration: 0, // Simplified for practice
        answers: Object.entries(selected).map(([id, ans]) => ({ id, ans }))
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid-2-dynamic" style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:24 }}>
        {/* Sidebar filters + question list */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Filters */}
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9375rem', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}><Filter size={16} /> Filters</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize:'0.75rem' }}>Subject</label>
                <select className="form-select" value={selSubject} onChange={e=>setSelSubject(e.target.value)} style={{ fontSize:'0.8125rem', padding:'8px 12px' }}>
                  {subjectList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize:'0.75rem' }}>Year</label>
                <select className="form-select" value={selYear} onChange={e=>setSelYear(e.target.value)} style={{ fontSize:'0.8125rem', padding:'8px 12px' }}>
                  {yearList.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ padding:'16px 20px', background:'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light))', borderRadius:'var(--r-lg)' }}>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Session Score</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'white' }}>{totalAnswered > 0 ? Math.round((totalCorrect/totalAnswered)*100) : 0}%</div>
            <div style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginTop:4 }}>{totalCorrect}/{totalAnswered} correct</div>
          </div>

          <button onClick={handleEndSession} disabled={submitting} className="btn btn-dark w-full" style={{ justifyContent:'center', gap:8 }}>
            {submitting ? 'Saving...' : <><Save size={18} /> End & Save Session</>}
          </button>

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--clr-border-light)', fontSize:'0.8125rem', fontWeight:600 }}>{questions.length} Questions</div>
            <div style={{ overflowY:'auto', maxHeight:400 }}>
              {questions.map((q, i) => {
                const rev = revealed[q.id];
                const correct = selected[q.id] === q.answer;
                return (
                  <button key={q.id} onClick={()=>setCurrent(i)} style={{ width:'100%', padding:'12px 16px', borderBottom:'1px solid var(--clr-border-light)', textAlign:'left', background: i===current ? 'var(--clr-primary-50)' : 'white', display:'flex', gap:10, alignItems:'center', cursor:'pointer', border:'none' }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background: rev ? (correct?'var(--clr-success-bg)':'var(--clr-danger-bg)') : i===current?'var(--clr-primary)':'var(--clr-border)', color: rev ? (correct?'var(--clr-success)':'var(--clr-danger)') : i===current?'white':'var(--clr-text-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
                      {rev ? (correct?<CheckCircle2 size={14} />:<XCircle size={14} />) : i+1}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.75rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.subject?.name} {q.year}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--clr-text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.topic}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {loading ? (
            <div className="card" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:400 }}>Loading questions...</div>
          ) : q ? (
            <>
              <div className="card" style={{ flex:1 }}>
                <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
                  <span className="badge badge-primary">{q.subject?.name}</span>
                  <span className="badge badge-accent">{q.year}</span>
                  <span style={{ marginLeft:'auto', fontSize:'0.8125rem', color:'var(--clr-text-muted)' }}>Q{current+1} of {questions.length}</span>
                </div>

                <p style={{ fontSize:'1.0625rem', fontWeight:500, lineHeight:1.75, marginBottom:28, color:'var(--clr-text-primary)' }}>{q.text}</p>

                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:28 }}>
                  {q.options.map((opt, i) => {
                    const letter = opt[0];
                    const isSelected = selected[q.id] === letter;
                    const isCorrect = letter === q.answer;
                    const isRevealed = revealed[q.id];
                    let bg = 'white', border = 'var(--clr-border)', color = 'var(--clr-text-primary)';
                    if (isRevealed && isCorrect) { bg = 'var(--clr-success-bg)'; border = 'var(--clr-success)'; color = 'var(--clr-success)'; }
                    else if (isRevealed && isSelected && !isCorrect) { bg = 'var(--clr-danger-bg)'; border = 'var(--clr-danger)'; color = 'var(--clr-danger)'; }
                    else if (isSelected) { bg = 'var(--clr-primary-50)'; border = 'var(--clr-primary)'; color = 'var(--clr-primary)'; }
                    return (
                      <button key={i} onClick={() => handleSelect(q.id, opt)} style={{ padding:'14px 18px', borderRadius:'var(--r-md)', border:`1.5px solid ${border}`, background:bg, color, textAlign:'left', fontSize:'0.9375rem', cursor: isRevealed?'default':'pointer', fontWeight: isSelected||(isCorrect&&isRevealed) ? 600 : 400 }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {revealed[q.id] && (
                  <div className="animate-fadeInUp" style={{ padding:'16px 20px', background:'var(--clr-primary-50)', borderRadius:'var(--r-md)', border:'1px solid var(--clr-primary-100)' }}>
                    <div style={{ fontWeight:700, color:'var(--clr-primary)', marginBottom:8, display:'flex', gap:8, alignItems:'center' }}>
                      <Lightbulb size={18} /> Explanation:
                    </div>
                    <p style={{ fontSize:'0.9rem', color:'var(--clr-text-secondary)', lineHeight:1.7 }}>{q.explanation}</p>
                  </div>
                )}
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button onClick={()=>setCurrent(v=>Math.max(0,v-1))} disabled={current===0} className="btn btn-outline" style={{ flex:1, justifyContent:'center', gap:8 }}><ChevronLeft size={18} /> Previous</button>
                {!revealed[q.id] ? (
                  <button onClick={()=>handleReveal(q.id)} disabled={!selected[q.id]} className="btn btn-primary" style={{ flex:2, justifyContent:'center', gap:8 }}>Check Answer</button>
                ) : (
                  <button onClick={()=>setCurrent(v=>Math.min(questions.length-1,v+1))} className="btn btn-accent" style={{ flex:2, justifyContent:'center', gap:8 }}>Next Question <ChevronRight size={18} /></button>
                )}
              </div>
            </>
          ) : (
            <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400, flexDirection:'column', gap:16 }}>
              <div style={{ color:'var(--clr-text-muted)', opacity:0.3 }}><SearchX size={64} /></div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>No results</h3>
              <button onClick={()=>{setSelSubject('All'); setSelYear('All Years');}} className="btn btn-ghost">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
