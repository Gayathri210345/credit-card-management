import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import api from '../../api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers')
      .then(r => setCustomers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key:'fullname',  label:'Name' },
    { key:'email',     label:'Email' },
    { key:'phone',     label:'Phone' },
    { key:'createdAt', label:'Registered', render: v => new Date(v).toLocaleDateString('en-IN') }
  ];

  return (
    <Layout>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Customers</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>{customers.length} registered customer(s)</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
        {loading ? <p style={{ padding:'2rem', color:'var(--text2)' }}>Loading...</p> : <Table columns={cols} data={customers} emptyMsg="No customers registered yet" />}
      </div>
    </Layout>
  );
}
