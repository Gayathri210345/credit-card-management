import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function CustomerRepay() {
  const [amount, setAmount] = useState('');
  const [info, setInfo]     = useState(null);
  const [msg, setMsg]       = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const loadInfo = () => api.get('/customer/dashboard').then(r => setInfo(r.data));
  useEffect(() => { loadInfo(); }, []);

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await api.post('/customer/repay', { amount: parseFloat(amount) });
      setMsg(data.message);
      setAmount('');
      loadInfo();
    } catch (err) { setError(err.response?.data?.message || 'Repayment failed'); }
    finally { setLoading(false); }
  };

  const fmt = n => '₹' + (n||0).toLocaleString('en-IN', { minimumFractionDigits:2 });

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Make Repayment</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Pay off your outstanding credit balance</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', maxWidth:'700px' }}>
        <div>
          {info?.approved && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem', marginBottom:'1.5rem' }}>
              <div style={{ color:'var(--text2)', fontSize:'0.8rem', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'1px' }}>Current Balance</div>
              {[['Outstanding',   fmt(info.outstanding),    'var(--warning)'],
                ['Credit Limit',  fmt(info.credit_limit),   'var(--accent)'],
                ['Total Spent',   fmt(info.total_spent),    'var(--danger)'],
                ['Total Repaid',  fmt(info.total_repaid),   'var(--success)']].map(([l,v,c]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text2)', fontSize:'0.9rem' }}>{l}</span>
                    <span style={{ fontWeight:700, color:c }}>{v}</span>
                  </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-head)', marginBottom:'1.5rem' }}>Enter Repayment Amount</h3>
          {msg   && <Alert type="success">{msg}</Alert>}
          {error && <Alert type="error">{error}</Alert>}
          <form onSubmit={submit}>
            <Input label="Amount (₹)" type="number" min="1" step="0.01"
              value={amount} onChange={e => setAmount(e.target.value)}
              required placeholder="e.g. 5000" />
            {info?.outstanding > 0 && (
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                {[info.outstanding/4, info.outstanding/2, info.outstanding].map((v,i) => (
                  <button key={i} type="button" onClick={() => setAmount(v.toFixed(2))}
                    style={{ background:'var(--surface2)', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:'20px', padding:'0.3rem 0.8rem', fontSize:'0.8rem', cursor:'pointer' }}>
                    {['25%','50%','Full'][i]}
                  </button>
                ))}
              </div>
            )}
            <Button type="submit" loading={loading} variant="success" style={{ width:'100%' }}>
              💰 Submit Repayment
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
