import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function CustomerLogin() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/customer/login', form);
      login(data.token);
      navigate('/customer/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 40% 30%, rgba(0,212,168,0.1) 0%, var(--bg) 70%)' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>👤</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.7rem', fontWeight:800 }}>Customer Login</h2>
          <p style={{ color:'var(--text2)', fontSize:'0.85rem', marginTop:'0.3rem' }}>Access your credit dashboard</p>
        </div>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={submit}>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required placeholder="••••••••" />
          <Button type="submit" loading={loading} style={{ width:'100%', marginTop:'0.5rem' }}>Login</Button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1.2rem', color:'var(--text2)', fontSize:'0.9rem' }}>
          New user? <Link to="/customer/register">Register here</Link>
        </p>
        <p style={{ textAlign:'center', marginTop:'0.5rem' }}><Link to="/apply" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>Apply for a card first</Link></p>
        <p style={{ textAlign:'center', marginTop:'0.5rem' }}><Link to="/" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>← Back to Home</Link></p>
      </div>
    </div>
  );
}
