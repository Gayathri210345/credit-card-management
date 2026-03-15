import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';
import api from '../../api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CustomerDashboard() {
  const [info, setInfo]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/dashboard')
      .then(r => setInfo(r.data))
      .finally(() => setLoading(false));
  }, []);

  const fmt = n => '₹' + (n||0).toLocaleString('en-IN', { minimumFractionDigits:2 });
  const pct = info?.credit_limit > 0 ? Math.round((info.outstanding / info.credit_limit) * 100) : 0;

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:800 }}>My Dashboard</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Your credit overview</p>
      </div>

      {loading ? <p style={{ color:'var(--text2)' }}>Loading...</p> : !info?.approved ? (
        <Alert type="warning">
          Your application is <strong>pending approval</strong>. Once approved you can register and start using your credit card.{' '}
          <Link to="/apply">Submit an application</Link>
        </Alert>
      ) : (
        <>
          <Alert type="success">🎉 Your credit card is active! <Link to="/customer/card" style={{ color:'var(--success)', fontWeight:700 }}>View Card →</Link></Alert>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
            <StatCard icon="💳" label="Credit Limit"    value={fmt(info.credit_limit)}    color="var(--accent)" />
            <StatCard icon="🛍️" label="Total Spent"     value={fmt(info.total_spent)}     color="var(--danger)" />
            <StatCard icon="💰" label="Total Repaid"    value={fmt(info.total_repaid)}    color="var(--success)" />
            <StatCard icon="⚠️" label="Outstanding"     value={fmt(info.outstanding)}     color="var(--warning)" />
            <StatCard icon="✅" label="Available Credit" value={fmt(info.available_credit)} color="var(--accent2)" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
              <div style={{ fontWeight:700, marginBottom:'1rem' }}>Credit Usage</div>
              <div style={{ background:'var(--surface2)', borderRadius:'8px', overflow:'hidden', height:'12px', marginBottom:'0.7rem' }}>
                <div style={{ width:`${Math.min(pct,100)}%`, height:'100%', background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)', borderRadius:'8px', transition:'width 0.5s' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'var(--text2)' }}>
                <span>{pct}% used</span>
                <span>{fmt(info.outstanding)} / {fmt(info.credit_limit)}</span>
              </div>
            </div>

            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
              <div style={{ fontWeight:700, marginBottom:'0.5rem' }}>Credit Breakdown</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={[{ name:'Outstanding', value: info.outstanding||0.01 },{ name:'Available', value: info.available_credit||0.01 }]}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                    <Cell fill="var(--danger)" />
                    <Cell fill="var(--success)" />
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
            {[
              { to:'/customer/card',         icon:'💳', label:'View Card',         desc:'See your virtual credit card' },
              { to:'/customer/products',     icon:'🛍️', label:'Browse & Buy',      desc:'Shop with your credit' },
              { to:'/customer/repay',        icon:'💰', label:'Make Repayment',    desc:'Pay off your balance' },
              { to:'/customer/transactions', icon:'📄', label:'Transactions',      desc:'Full payment history' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.2rem', textDecoration:'none', display:'block', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{item.icon}</div>
                <div style={{ fontWeight:700, color:'var(--text)', marginBottom:'0.2rem' }}>{item.label}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.8rem' }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
