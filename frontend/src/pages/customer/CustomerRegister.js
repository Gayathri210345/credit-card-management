import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function CustomerRegister() {
  const [form, setForm] = useState({ fullname:'', email:'', phone:'', password:'' });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await api.post('/auth/customer/register', form);
      setMsg(data.message);
      setTimeout(() => navigate('/customer/login'), 2000);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>📋</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.7rem', fontWeight:800 }}>Customer Register</h2>
          <p style={{ color:'var(--text2)', fontSize:'0.85rem', marginTop:'0.3rem' }}>Only approved applicants can register</p>
        </div>
        {msg   && <Alert type="success">{msg}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={submit}>
          <Input label="Full Name *"  value={form.fullname} onChange={e => setForm({...form, fullname:e.target.value})} required placeholder="Your full name" />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required placeholder="Must match application email" />
          <Input label="Phone" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="Mobile number" />
          <Input label="Password *" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required placeholder="Choose a strong password" />
          <Button type="submit" loading={loading} style={{ width:'100%', marginTop:'0.5rem' }}>Create Account</Button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1.2rem', color:'var(--text2)', fontSize:'0.9rem' }}>
          Already registered? <Link to="/customer/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
