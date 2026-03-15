import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function AdminLogin() {
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/admin/login', form);
      login(data.token);
      navigate('/admin/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 60% 30%, rgba(108,99,255,0.12) 0%, var(--bg) 70%)' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🔐</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.7rem', fontWeight:800 }}>Admin Login</h2>
          <p style={{ color:'var(--text2)', fontSize:'0.85rem', marginTop:'0.3rem' }}>CCAMS Administration Panel</p>
        </div>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={submit}>
          <Input label="Username" value={form.username} onChange={e => setForm({...form, username:e.target.value})} required placeholder="admin" />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required placeholder="••••••••" />
          <Button type="submit" loading={loading} style={{ width:'100%', marginTop:'0.5rem' }}>Sign In</Button>
        </form>
        <div style={{ marginTop:'1.2rem', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.8rem', fontSize:'0.82rem', color:'var(--text2)' }}>
          💡 First time? Call <code style={{ color:'var(--accent)' }}>POST /api/auth/admin/seed</code> to create admin account.<br/>
          Default: <strong style={{ color:'var(--text)' }}>admin / admin123</strong>
        </div>
        <p style={{ textAlign:'center', marginTop:'1rem' }}><Link to="/" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>← Back to Home</Link></p>
      </div>
    </div>
  );
}
