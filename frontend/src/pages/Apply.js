import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function Apply() {
  const [form, setForm] = useState({
    fullname:'', email:'', phone:'', fathername:'',
    address:'', state:'', city:'', pincode:'',
    occupation:'', annual_income:'', pan_number:''
  });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await api.post('/customer/apply', form);
      setMsg(data.message);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2.5rem', width:'100%', maxWidth:'640px' }}>
        <div style={{ marginBottom:'2rem' }}>
          <Link to="/" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>← Back to Home</Link>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800, marginTop:'1rem' }}>Apply for Credit Card</h2>
          <p style={{ color:'var(--text2)', marginTop:'0.4rem' }}>Submit your details. Admin will review and approve your application.</p>
        </div>

        {msg   && <Alert type="success">{msg}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
            <Input label="Full Name *"         name="fullname"     value={form.fullname}     onChange={handle} required placeholder="e.g. Ravi Kumar" />
            <Input label="Email *"             name="email"        value={form.email}        onChange={handle} required type="email" placeholder="you@example.com" />
            <Input label="Phone *"             name="phone"        value={form.phone}        onChange={handle} required placeholder="10-digit mobile" />
            <Input label="Father's Name"       name="fathername"   value={form.fathername}   onChange={handle} placeholder="Father's full name" />
            <Input label="City *"              name="city"         value={form.city}         onChange={handle} required placeholder="City" />
            <Input label="State *"             name="state"        value={form.state}        onChange={handle} required placeholder="State" />
            <Input label="Pincode *"           name="pincode"      value={form.pincode}      onChange={handle} required placeholder="6-digit pincode" />
            <Input label="Occupation *"        name="occupation"   value={form.occupation}   onChange={handle} required placeholder="e.g. Software Engineer" />
            <Input label="Annual Income (₹) *" name="annual_income" type="number" value={form.annual_income} onChange={handle} required placeholder="e.g. 500000" />
            <Input label="PAN Number *"        name="pan_number"   value={form.pan_number}   onChange={handle} required placeholder="ABCDE1234F" maxLength={10} style={{ textTransform:'uppercase' }} />
          </div>
          <Input label="Address *" name="address" value={form.address} onChange={handle} required placeholder="Full residential address" />
          <Button type="submit" loading={loading} style={{ width:'100%', marginTop:'0.5rem', padding:'0.85rem' }}>
            Submit Application
          </Button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', color:'var(--text2)', fontSize:'0.85rem' }}>
          Already approved? <Link to="/customer/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
