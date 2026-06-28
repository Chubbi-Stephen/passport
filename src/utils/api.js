const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('passport_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  // Student
  getDashboard: async () => {
    const res = await fetch(`${API_BASE_URL}/student/dashboard`, { headers: getHeaders() });
    return res.json();
  },
  getLessons: async () => {
    const res = await fetch(`${API_BASE_URL}/student/lessons`, { headers: getHeaders() });
    return res.json();
  },
  updateLessonProgress: async (lessonId, progress) => {
    const res = await fetch(`${API_BASE_URL}/student/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(progress),
    });
    return res.json();
  },
  getPractice: async (params) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/student/practice?${query}`, { headers: getHeaders() });
    return res.json();
  },
  startExam: async (examConfig) => {
    const res = await fetch(`${API_BASE_URL}/student/exam/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(examConfig),
    });
    return res.json();
  },
  finishExam: async (examResults) => {
    const res = await fetch(`${API_BASE_URL}/student/exam/finish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(examResults),
    });
    return res.json();
  },
  getSubjects: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/subjects`, { headers: getHeaders() });
    return res.json();
  },
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE_URL}/student/leaderboard`, { headers: getHeaders() });
    return res.json();
  },

  // Parent
  getChildren: async () => {
    const res = await fetch(`${API_BASE_URL}/parent/children`, { headers: getHeaders() });
    return res.json();
  },
  getChildActivity: async (childId) => {
    const res = await fetch(`${API_BASE_URL}/parent/children/${childId}/activity`, { headers: getHeaders() });
    return res.json();
  },
  linkChild: async (childEmail) => {
    const res = await fetch(`${API_BASE_URL}/parent/link-child`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ childEmail }),
    });
    return res.json();
  },

  // Payments
  initializePayment: async (paymentData) => {
    const res = await fetch(`${API_BASE_URL}/payment/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return res.json();
  },
  verifyPayment: async (reference) => {
    const res = await fetch(`${API_BASE_URL}/payment/verify?reference=${reference}`, { headers: getHeaders() });
    return res.json();
  },

  // Profile
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
};
