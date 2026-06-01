import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        input:focus { border-color: #667eea !important; box-shadow: 0 0 0 3px rgba(102,126,234,0.15) !important; outline: none; }
        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.5) !important; }
      `}</style>

      <div style={s.card}>
        <div style={s.logo}>✅ <span style={s.logoText}>TaskFlow</span></div>
        <h2 style={s.title}>{isLogin ? '👋 Welcome back!' : '🚀 Create account'}</h2>
        <p style={s.sub}>{isLogin ? 'Sign in to manage your tasks' : 'Start organizing your life today'}</p>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <form onSubmit={submit}>
          {!isLogin && (
            <div style={s.group}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} name="name" placeholder="Durga Trinadh" value={form.name} onChange={handle} required />
            </div>
          )}
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button className="auth-btn" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? '⏳ Please wait...' : isLogin ? '→ Sign In' : '→ Create Account'}
          </button>
        </form>

        <p style={s.switch}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.link} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign up free' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', fontFamily:'Inter, sans-serif', padding:'1rem' },
  card: { background:'#fff', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 25px 60px rgba(0,0,0,0.2)', animation:'fadeIn 0.5s ease' },
  logo: { display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem', fontSize:'1.5rem', fontWeight:800 },
  logoText: { background:'linear-gradient(135deg,#667eea,#f093fb)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  title: { fontSize:'1.6rem', fontWeight:700, color:'#1a1a2e', marginBottom:'0.3rem' },
  sub: { color:'#888', fontSize:'0.9rem', marginBottom:'1.5rem' },
  error: { background:'#fff0f0', border:'1px solid #ffcdd2', color:'#c62828', padding:'0.75rem', borderRadius:10, fontSize:'0.85rem', marginBottom:'1rem' },
  group: { marginBottom:'1.1rem' },
  label: { display:'block', fontSize:'0.82rem', fontWeight:600, color:'#444', marginBottom:'0.4rem' },
  input: { width:'100%', padding:'0.8rem 1rem', border:'2px solid #e8e8f0', borderRadius:10, fontSize:'0.95rem', fontFamily:'Inter, sans-serif', boxSizing:'border-box', transition:'all 0.2s' },
  btn: { width:'100%', padding:'0.9rem', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:12, fontSize:'1rem', fontWeight:600, cursor:'pointer', marginTop:'0.5rem', fontFamily:'Inter, sans-serif', transition:'all 0.3s' },
  switch: { textAlign:'center', marginTop:'1.25rem', fontSize:'0.88rem', color:'#666' },
  link: { color:'#667eea', fontWeight:600, cursor:'pointer' }
};