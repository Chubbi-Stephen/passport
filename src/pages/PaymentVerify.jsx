import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verify = async () => {
      if (!reference) return navigate('/dashboard');
      try {
        const result = await api.verifyPayment(reference);
        if (result.tier) {
          // Update local storage user data
          const user = JSON.parse(localStorage.getItem('passport_user'));
          user.tier = result.tier;
          localStorage.setItem('passport_user', JSON.stringify(user));
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 3000);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
    verify();
  }, [reference, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-bg)', padding: 24 }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: '48px 32px' }}>
        {status === 'verifying' && (
          <>
            <div style={{ color: 'var(--clr-primary)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <Loader2 size={60} className="animate-spin" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: 12 }}>Verifying Payment</h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>Please wait while we confirm your transaction with Paystack...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ color: 'var(--clr-success)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <CheckCircle2 size={80} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: 12, color: 'var(--clr-success)' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Your account has been upgraded. Redirecting you to the dashboard...</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Go to Dashboard</button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ color: 'var(--clr-danger)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <XCircle size={80} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: 12, color: 'var(--clr-danger)' }}>Verification Failed</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>We couldn't verify your payment. If you were debited, please contact support with your reference: <strong>{reference}</strong></p>
            <button onClick={() => navigate('/upgrade')} className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>Try Again</button>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
