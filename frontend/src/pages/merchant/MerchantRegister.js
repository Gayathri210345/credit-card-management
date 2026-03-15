import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function MerchantRegister() {
  const [form, setForm] = useState({ businessname:'', email:'', password:'', address:'' });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await api.post('/auth/merchant/register', form);
      setMsg(data.message);
      setTimeout(() => navigate('/merchant/login'), 2000);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🏪</div>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.7rem', fontWeight:800 }}>Merchant Register</h2>
          <p style={{ color:'var(--text2)', fontSize:'0.85rem', marginTop:'0.3rem' }}>Create your merchant account</p>
        </div>
        {msg   && <Alert type="success">{msg}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={submit}>
          <Input label="Business Name *" value={form.businessname} onChange={e => setForm({...form, businessname:e.target.value})} required placeholder="Your Business Name" />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required placeholder="business@example.com" />
          <Input label="Address" value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Business address" />
          <Input label="Password *" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required placeholder="Choose a strong password" />
          <Button type="submit" loading={loading} style={{ width:'100%', marginTop:'0.5rem' }}>Register</Button>
        </form>
        <p style={{ textAlign:'center', marginTop:'1.2rem', color:'var(--text2)', fontSize:'0.9rem' }}>
          Already registered? <Link to="/merchant/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
