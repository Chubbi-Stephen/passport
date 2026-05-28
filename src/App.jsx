import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Practice from './pages/Practice';
import ExamSimulator from './pages/ExamSimulator';
import ParentDashboard from './pages/ParentDashboard';
import Lessons from './pages/Lessons';
import LiveClasses from './pages/LiveClasses';
import Leaderboard from './pages/Leaderboard';
import Upgrade from './pages/Upgrade';
import PaymentVerify from './pages/PaymentVerify';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/exam" element={<ExamSimulator />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/live" element={<LiveClasses />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-verify" element={<PaymentVerify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
