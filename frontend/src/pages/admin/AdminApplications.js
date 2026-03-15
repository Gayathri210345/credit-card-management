import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function AdminApplications() {
  const [apps, setApps]   = useState([]);
  const [filter, setFilter] = useState('');
  const [msg, setMsg]     = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const url = filter ? `/admin/applications?status=${filter}` : '/admin/applications';
    const { data } = await api.get(url);
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/applications/${id}/status`, { status });
      setMsg(`Application ${status} successfully!`);
      setTimeout(() => setMsg(''), 3000);
      load();
    } catch (e) { console.error(e); }
  };

  const cols = [
    { key:'fullname',     label:'Name' },
    { key:'email',        label:'Email' },
    { key:'phone',        label:'Phone' },
    { key:'city',         label:'City' },
    { key:'occupation',   label:'Occupation' },
    { key:'annual_income',label:'Income', render: v => `₹${(v||0).toLocaleString('en-IN')}` },
    { key:'pan_number',   label:'PAN' },
    { key:'status',       label:'Status', render: v => <Badge label={v} /> },
    { key:'createdAt',    label:'Applied', render: v => new Date(v).toLocaleDateString('en-IN') },
    { key:'_id',          label:'Actions', render: (v, row) => row.status === 'pending' ? (
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <Button variant="success" style={{ padding:'0.3rem 0.8rem', fontSize:'0.8rem' }} onClick={() => updateStatus(v,'approved')}>✔ Approve</Button>
          <Button variant="danger"  style={{ padding:'0.3rem 0.8rem', fontSize:'0.8rem' }} onClick={() => updateStatus(v,'rejected')}>✖ Reject</Button>
        </div>
      ) : <span style={{ color:'var(--text2)', fontSize:'0.85rem' }}>—</span>
    }
  ];

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Applications</h1>
          <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>{apps.length} application(s)</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {['','pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding:'0.4rem 1rem', borderRadius:'20px', border:'1px solid var(--border)', background: filter===s ? 'var(--accent)':'var(--surface2)', color: filter===s ? '#fff':'var(--text2)', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      {msg && <Alert type="success">{msg}</Alert>}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
        {loading ? <p style={{ padding:'2rem', color:'var(--text2)' }}>Loading...</p> : <Table columns={cols} data={apps} emptyMsg="No applications found" />}
      </div>
    </Layout>
  );
}
