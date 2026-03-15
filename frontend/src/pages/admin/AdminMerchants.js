import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import api from '../../api';

export default function AdminMerchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/merchants')
      .then(r => setMerchants(r.data))
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key:'businessname', label:'Business Name' },
    { key:'email',        label:'Email' },
    { key:'address',      label:'Address' },
    { key:'createdAt',    label:'Registered', render: v => new Date(v).toLocaleDateString('en-IN') }
  ];

  return (
    <Layout>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Merchants</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>{merchants.length} registered merchant(s)</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
        {loading ? <p style={{ padding:'2rem', color:'var(--text2)' }}>Loading...</p> : <Table columns={cols} data={merchants} emptyMsg="No merchants registered yet" />}
      </div>
    </Layout>
  );
}
