import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function CustomerRepay() {
  const [amount, setAmount]     = useState('');
  const [info, setInfo]         = useState(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [receipt, setReceipt]   = useState(null);

  const loadInfo = () => api.get('/customer/dashboard').then(r => setInfo(r.data));
  useEffect(() => { loadInfo(); }, []);

  const fmt = n => 'Rs.' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/customer/repay', { amount: parseFloat(amount) });
      await loadInfo();
      const d = await api.get('/customer/dashboard');
      setInfo(d.data);
      setReceipt({
        amount:      parseFloat(amount),
        date:        new Date().toLocaleString('en-IN'),
        outstanding: d.data.outstanding,
        available:   d.data.available_credit,
        credit_limit: d.data.credit_limit,
      });
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Repayment failed');
    } finally { setLoading(false); }
  };

  const downloadReceipt = () => {
    if (!receipt) return;
    const lines = [
      '============================================',
      '        IOB BANK - REPAYMENT RECEIPT        ',
      '============================================',
      '',
      'Amount Paid   : ' + fmt(receipt.amount),
      'Date & Time   : ' + receipt.date,
      'Status        : Repayment Successful',
      '',
      '--------------------------------------------',
      '             CREDIT CARD SUMMARY            ',
      '--------------------------------------------',
      'Credit Limit  : ' + fmt(receipt.credit_limit),
      'Outstanding   : ' + fmt(receipt.outstanding),
      'Available     : ' + fmt(receipt.available),
      '',
      '============================================',
      '  Thank you for your timely repayment!      ',
      '============================================',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Repayment_Receipt_' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct = info?.credit_limit > 0
    ? Math.min(100, Math.round((info.outstanding / info.credit_limit) * 100))
    : 0;

  return (
    <Layout>
      {/* Repayment Receipt Modal */}
      {receipt && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', color:'#000', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'440px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            {/* Header */}
            <div style={{ textAlign:'center', borderBottom:'2px dashed #ddd', paddingBottom:'1rem', marginBottom:'1.2rem' }}>
              <div style={{ fontSize:'2.5rem' }}>💰</div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:800, color:'#2ed573', margin:'0.3rem 0 0.2rem' }}>Repayment Receipt</h2>
              <p style={{ color:'#888', fontSize:'0.82rem' }}>IOB Bank Credit Card</p>
            </div>
            {/* Details */}
            {[
              ['Amount Paid',  fmt(receipt.amount)],
              ['Date & Time',  receipt.date],
              ['Status',       'Repayment Successful'],
            ].map(([label, value]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.55rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <span style={{ color:'#666', fontSize:'0.88rem' }}>{label}</span>
                <span style={{ fontWeight:700, fontSize:'0.88rem', color: label === 'Status' ? 'green' : label === 'Amount Paid' ? '#2ed573' : '#000' }}>{value}</span>
              </div>
            ))}
            {/* Credit Summary */}
            <div style={{ background:'#f0fff8', borderRadius:'8px', padding:'0.8rem', margin:'1rem 0' }}>
              <div style={{ fontWeight:700, marginBottom:'0.5rem', color:'#2ed573', fontSize:'0.85rem' }}>UPDATED CREDIT SUMMARY</div>
              {[
                ['Credit Limit',  fmt(receipt.credit_limit)],
                ['Outstanding',   fmt(receipt.outstanding)],
                ['Available',     fmt(receipt.available)],
              ].map(([label, value]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', padding:'0.2rem 0' }}>
                  <span style={{ color:'#666' }}>{label}</span>
                  <span style={{ fontWeight:700 }}>{value}</span>
                </div>
              ))}
            </div>
            {/* Success */}
            <div style={{ textAlign:'center', marginBottom:'1.2rem' }}>
              <div style={{ color:'green', fontWeight:700, fontSize:'1rem' }}>✅ Repayment Successful!</div>
              <div style={{ color:'#888', fontSize:'0.8rem', marginTop:'0.2rem' }}>Thank you for your timely payment</div>
            </div>
            {/* Buttons */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
              <button onClick={downloadReceipt} style={{ background:'#2ed573', color:'#000', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                ⬇️ Download
              </button>
              <button onClick={() => window.print()} style={{ background:'#6c63ff', color:'#fff', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                🖨️ Print
              </button>
              <button onClick={() => setReceipt(null)} style={{ gridColumn:'1/-1', background:'#f0f0f0', color:'#333', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Make Repayment</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Pay off your outstanding credit balance</p>
      </div>

      {/* Credit Usage Bar */}
      {info?.approved && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.2rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'0.85rem' }}>
            <span style={{ color:'var(--text2)' }}>Credit Usage</span>
            <span style={{ fontWeight:700, color: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)' }}>{pct}% used</span>
          </div>
          <div style={{ background:'var(--surface2)', borderRadius:'8px', height:'12px', overflow:'hidden' }}>
            <div style={{ width: pct + '%', height:'100%', background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)', borderRadius:'8px', transition:'width 0.5s' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.5rem', fontSize:'0.8rem', color:'var(--text2)' }}>
            <span>Outstanding: {fmt(info.outstanding)}</span>
            <span>Limit: {fmt(info.credit_limit)}</span>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', maxWidth:'700px' }}>
        {/* Balance Info */}
        <div>
          {info?.approved && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
              <div style={{ color:'var(--text2)', fontSize:'0.8rem', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'1px' }}>Current Balance</div>
              {[
                ['Credit Limit',   fmt(info.credit_limit),   'var(--accent)'],
                ['Total Spent',    fmt(info.total_spent),    'var(--danger)'],
                ['Total Repaid',   fmt(info.total_repaid),   'var(--success)'],
                ['Outstanding',    fmt(info.outstanding),    'var(--warning)'],
                ['Available',      fmt(info.available_credit),'var(--accent2)'],
              ].map(([l, v, c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--text2)', fontSize:'0.9rem' }}>{l}</span>
                  <span style={{ fontWeight:700, color: c }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repayment Form */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-head)', marginBottom:'1.5rem' }}>Enter Amount</h3>
          {error && <Alert type="error">{error}</Alert>}
          <form onSubmit={submit}>
            <Input label="Repayment Amount (Rs.)" type="number" min="1" step="0.01"
              value={amount} onChange={e => setAmount(e.target.value)}
              required placeholder="e.g. 5000" />
            {info?.outstanding > 0 && (
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                {[
                  ['25%',  info.outstanding * 0.25],
                  ['50%',  info.outstanding * 0.50],
                  ['Full', info.outstanding],
                ].map(([label, val]) => (
                  <button key={label} type="button"
                    onClick={() => setAmount(val.toFixed(2))}
                    style={{ background:'var(--surface2)', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:'20px', padding:'0.3rem 0.8rem', fontSize:'0.8rem', cursor:'pointer' }}>
                    {label}
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