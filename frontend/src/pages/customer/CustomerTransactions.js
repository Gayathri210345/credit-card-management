import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import api from '../../api';

export default function CustomerTransactions() {
  const [txns, setTxns]   = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/transactions')
      .then(r => setTxns(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? txns.filter(t => t.type === filter) : txns;
  const totalSpent   = txns.filter(t=>t.type==='purchase').reduce((s,t)=>s+t.amount,0);
  const totalRepaid  = txns.filter(t=>t.type==='repayment').reduce((s,t)=>s+t.amount,0);

  const cols = [
    { key:'createdAt',   label:'Date', render: v => new Date(v).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) },
    { key:'type',        label:'Type', render: v => <Badge label={v} /> },
    { key:'product_id',  label:'Product', render: (v,r) => r.type==='purchase' ? (v?.product_name || '—') : '—' },
    { key:'merchant_id', label:'Merchant', render: (v,r) => r.type==='purchase' ? (v?.businessname || '—') : '—' },
    { key:'amount',      label:'Amount', render: v => <span style={{ fontWeight:700 }}>₹{v.toLocaleString('en-IN', { minimumFractionDigits:2 })}</span> },
    { key:'status',      label:'Status', render: v => <Badge label={v} /> },
  ];

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Transactions</h1>
          <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>{filtered.length} transaction(s)</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {['','purchase','repayment'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'0.4rem 1rem', borderRadius:'20px', border:'1px solid var(--border)', background: filter===f ? 'var(--accent)':'var(--surface2)', color: filter===f ? '#fff':'var(--text2)', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 }}>
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem 1.5rem' }}>
          <div style={{ color:'var(--text2)', fontSize:'0.75rem', marginBottom:'0.3rem' }}>Total Spent</div>
          <div style={{ fontWeight:700, color:'var(--danger)' }}>₹{totalSpent.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1rem 1.5rem' }}>
          <div style={{ color:'var(--text2)', fontSize:'0.75rem', marginBottom:'0.3rem' }}>Total Repaid</div>
          <div style={{ fontWeight:700, color:'var(--success)' }}>₹{totalRepaid.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
        </div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
        {loading ? <p style={{ padding:'2rem', color:'var(--text2)' }}>Loading...</p> : <Table columns={cols} data={filtered} emptyMsg="No transactions found" />}
      </div>
    </Layout>
  );
}
