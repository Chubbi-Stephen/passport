import { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Bell,
  User,
  Target,
  Layout,
  Check,
  Monitor,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [notifications, setNotifications] = useState({
    streaks: true,
    results: true,
    newLessons: false,
    parentsEmail: true
  });

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    school: '',
    state: '',
  });

  const [goals, setGoals] = useState({
    questionsPerDay: '50 Questions',
    examDate: '2026-04-15'
  });

  // Load current profile from localStorage (set during login/dashboard load)
  useEffect(() => {
    const stored = localStorage.getItem('passport_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setProfile({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          school: user.school || '',
          state: user.state || '',
        });
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const toggleNotif = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const result = await api.updateProfile(profile);

      // Update localStorage so subsequent page loads reflect the change
      const stored = localStorage.getItem('passport_user');
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem('passport_user', JSON.stringify({ ...user, ...result.user }));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Settings</h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>Manage your account, preferences, and study environment.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Profile Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-primary-50)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Profile</h3>
          </div>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  value={profile.firstName}
                  onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                  placeholder="e.g. Chidi"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  value={profile.lastName}
                  onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                  placeholder="e.g. Okonkwo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">School</label>
                <input
                  className="form-input"
                  value={profile.school}
                  onChange={e => setProfile(p => ({ ...p, school: e.target.value }))}
                  placeholder="e.g. Federal Government College"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  className="form-input"
                  value={profile.state}
                  onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                  placeholder="e.g. Lagos"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-primary-50)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layout size={18} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Appearance</h3>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--clr-border-light)' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 4 }}>Color Theme</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>Choose how PassPort looks to you.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'System' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--r-md)',
                      border: theme === mode.id ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                      background: theme === mode.id ? 'var(--clr-primary-50)' : 'var(--clr-bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all var(--ease)'
                    }}
                  >
                    <mode.icon size={20} color={theme === mode.id ? 'var(--clr-primary)' : 'var(--clr-text-muted)'} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: theme === mode.id ? 'var(--clr-primary)' : 'var(--clr-text-primary)' }}>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-accent-50)', color: 'var(--clr-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Notifications</h3>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>
            {[
              { id: 'streaks', title: 'Streak Reminders', desc: 'Get alerted before you lose your daily study streak.' },
              { id: 'results', title: 'Performance Reports', desc: 'Notify me when my mock results are ready.' },
              { id: 'newLessons', title: 'New Content', desc: 'Email me when new syllabus videos are uploaded.' },
              { id: 'parentsEmail', title: 'Parent Portal', desc: 'Share weekly progress reports with my parent/guardian.' }
            ].map((item, idx, arr) => (
              <div key={item.id} style={{ padding: '16px 24px', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--clr-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <button
                  onClick={() => toggleNotif(item.id)}
                  style={{ width: 44, height: 24, borderRadius: 99, background: notifications[item.id] ? 'var(--clr-primary)' : 'var(--clr-border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}
                >
                  <div style={{ position: 'absolute', top: 2, left: notifications[item.id] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Study Goals Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-success-bg)', color: 'var(--clr-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Study Goals</h3>
          </div>

          <div className="card">
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Questions Per Day</label>
              <select
                className="form-select"
                value={goals.questionsPerDay}
                onChange={e => setGoals(g => ({ ...g, questionsPerDay: e.target.value }))}
              >
                <option>10 Questions</option>
                <option>25 Questions</option>
                <option>50 Questions</option>
                <option>100 Questions</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Main Exam Date</label>
              <input
                type="date"
                className="form-input"
                value={goals.examDate}
                onChange={e => setGoals(g => ({ ...g, examDate: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Error / Success feedback */}
        {error && (
          <div style={{ padding: '12px 18px', background: 'var(--clr-danger-bg, #FEF2F2)', border: '1px solid var(--clr-danger, #EF4444)', borderRadius: 'var(--r-md)', color: 'var(--clr-danger)', fontSize: '0.875rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {saved && (
          <div style={{ padding: '12px 18px', background: 'var(--clr-success-bg)', border: '1px solid var(--clr-success)', borderRadius: 'var(--r-md)', color: 'var(--clr-success)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} /> Profile saved successfully!
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ alignSelf: 'flex-start', marginTop: 12, gap: 8, minWidth: 160, justifyContent: 'center' }}
        >
          {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Check size={18} /> Save All Changes</>}
        </button>

      </div>
    </div>
  );
}
