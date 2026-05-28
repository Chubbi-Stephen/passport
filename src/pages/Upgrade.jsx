import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { api } from '../utils/api';

const plans = [
  { id: 'FREE', name: 'Free', price: 0, desc: '10 questions/day, 1 subject preview', features: ['Basic tracking', 'Standard exams'] },
  { id: 'STANDARD', name: 'Standard', price: 5000, desc: 'Full access to all subjects & parents dashboard', features: ['Unlimited practice', 'Parent weekly reports', 'Performance AI'] },
  { id: 'PREMIUM', name: 'Premium', price: 8000, desc: 'Full access + Live tutoring classes', features: ['Everything in Standard', 'Live class access', '1-on-1 office hours'] },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('passport_user');
    if (u) setUser(JSON.parse(u));
    else navigate('/login');
  }, [navigate]);

  const handleUpgrade = async (plan) => {
    if (plan.price === 0) return;
    setLoading(true);
    try {
      const response = await api.initializePayment({
        amount: plan.price,
        plan: plan.id
      });
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Choose the right <span style={{ color: 'var(--clr-primary)' }}>plan for success</span></h2>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.1rem' }}>Invest in your future. Get the tools you need to crush JAMB & WAEC.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {plans.map((p) => {
            const isCurrent = user.tier === p.id;
            return (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: isCurrent ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)', position: 'relative' }}>
                {isCurrent && <span className="badge badge-primary" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '6px 16px' }}>Current Plan</span>}
                
                <div style={{ padding: '24px 24px 0' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)', marginBottom: 24, minHeight: 40 }}>{p.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 32 }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>₦{p.price.toLocaleString()}</span>
                    <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>/month</span>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '0 24px 24px' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
                    {p.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap:10, fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                        <Check size={16} color="var(--clr-success)" strokeWidth={3} /> {f}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handleUpgrade(p)}
                    disabled={loading || isCurrent || p.price === 0}
                    className={`btn w-full ${isCurrent ? 'btn-outline' : 'btn-primary'}`}
                    style={{ justifyContent: 'center', padding: '14px' }}
                  >
                    {isCurrent ? 'Current Plan' : p.price === 0 ? 'Free Forever' : `Upgrade to ${p.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: 48, background: 'var(--clr-bg)', textAlign: 'center', padding: '32px' }}>
          <div style={{ color: 'var(--clr-success)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><ShieldCheck size={48} /></div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Secure Payments by Paystack</h3>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', maxWidth: 500, margin: '0 auto' }}>Your payment information is encrypted and never stored on our servers.</p>
        </div>
      </div>
    </>
  );
}
