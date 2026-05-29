import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Database,
  Info
} from 'lucide-react';

export default function QuestionUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [examType, setExamType] = useState('JAMB');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const inputRef = useRef(null);

  // Fetch real subjects from database on load
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/subjects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSubjects(data);
          setSelectedSubjectId(data[0].id);
        } else {
          // Fallback for UI testing
          const defaults = [
            { id: 'math-123', name: 'Mathematics' },
            { id: 'eng-123', name: 'English Language' },
            { id: 'bio-123', name: 'Biology' },
          ];
          setSubjects(defaults);
          setSelectedSubjectId(defaults[0].id);
        }
      })
      .catch(err => {
        console.error("Error fetching subjects:", err);
        const defaults = [
          { id: 'math-123', name: 'Mathematics' },
          { id: 'eng-123', name: 'English Language' },
          { id: 'bio-123', name: 'Biology' },
        ];
        setSubjects(defaults);
        setSelectedSubjectId(defaults[0].id);
      });
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStep(2);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };

  const reset = () => {
    setFile(null);
    setStep(1);
    setMessage({ type: '', text: '' });
  };

  const completeImport = async () => {
    if (!file || !selectedSubjectId) return;
    
    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', selectedSubjectId);
    formData.append('examType', examType);

    try {
      const response = await fetch('http://localhost:5000/api/admin/import-questions', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully imported ${result.count} questions!` });
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-text-primary)' }}>
          Question Importer
        </h2>
        <p style={{ color: 'var(--clr-text-secondary)', marginTop: 4 }}>
          Bulk upload JAMB & WAEC past questions using CSV or Excel templates.
        </p>
      </div>

      {message.text && (
        <div style={{ 
          padding: '16px', 
          borderRadius: 'var(--r-md)', 
          marginBottom: 24,
          background: message.type === 'success' ? 'var(--clr-success-bg)' : 'var(--clr-danger-bg)',
          color: message.type === 'success' ? 'var(--clr-success)' : 'var(--clr-danger)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${message.type === 'success' ? 'var(--clr-success)' : 'var(--clr-danger)'}`
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{message.text}</span>
          <button onClick={() => setMessage({type:'', text:''})} style={{ marginLeft: 'auto', color: 'inherit' }}><X size={18} /></button>
        </div>
      )}

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {step === 1 ? (
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: dragActive ? '2px dashed var(--clr-primary)' : '2px dashed var(--clr-border)',
                background: dragActive ? 'var(--clr-primary-50)' : 'var(--clr-bg-card)',
                borderRadius: 'var(--r-lg)',
                transition: 'all var(--ease)',
                position: 'relative'
              }}
            >
              <input 
                ref={inputRef}
                type="file" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <div style={{ 
                width: 64, height: 64, 
                borderRadius: '50%', 
                background: 'var(--clr-primary-50)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--clr-primary)',
                marginBottom: 20
              }}>
                <Upload size={32} />
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--clr-text-primary)' }}>Drag & drop your file here</h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>xlsx, csv files supported</p>
              
              <button 
                onClick={onButtonClick}
                className="btn btn-primary"
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <FileText className="text-green" size={20} />
                  <span style={{ fontWeight: 700, color: 'var(--clr-text-primary)' }}>{file?.name}</span>
                </div>
                <button onClick={reset} className="btn btn-ghost btn-sm">Change File</button>
              </div>

              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--clr-bg)', borderRadius: 'var(--r-md)', marginBottom: 24 }}>
                <CheckCircle2 size={48} className="text-green" style={{ marginBottom: 16 }} />
                <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--clr-text-primary)' }}>File Ready for Processing</h4>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Click "Start Import" to process the data.</p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={reset} className="btn btn-outline" disabled={uploading}>Cancel</button>
                <button 
                  className="btn btn-primary"
                  onClick={completeImport}
                  disabled={uploading || !selectedSubjectId}
                >
                  {uploading ? 'Importing...' : 'Start Import Now'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16, color: 'var(--clr-text-primary)' }}>Import Settings</h4>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Target Subject</label>
              <select 
                className="form-select" 
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                <option value="">Select a subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Exam Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className={`btn btn-sm flex-1 ${examType === 'JAMB' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setExamType('JAMB')}
                >JAMB</button>
                <button 
                  className={`btn btn-sm flex-1 ${examType === 'WAEC' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setExamType('WAEC')}
                >WAEC</button>
              </div>
            </div>
            
            <div className="divider" style={{ margin: '16px 0' }} />
            
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
              <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                <Info size={14} style={{ flexShrink: 0 }} />
                <span>Format: Question, A, B, C, D, Answer, Topic, Year, Difficulty</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--clr-accent-50)', border: '1px solid rgba(244,169,36,0.3)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-accent-dark)', marginBottom: 8, display:'flex', alignItems:'center', gap:8 }}>
              <Database size={16} /> Batch Engine
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--clr-accent-dark)', opacity: 0.8 }}>
              Optimized for large datasets. Processing questions in background threads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
