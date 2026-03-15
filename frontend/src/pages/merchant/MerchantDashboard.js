import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import api from '../../api';

export default function MerchantDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/merchant/dashboard')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key:'createdAt',   label:'Date', render: v => new Date(v).toLocaleDateString('en-IN') },
    { key:'product_id',  label:'Product', render: v => v?.product_name || '—' },
    { key:'customer_id', label:'Customer', render: v => v?.fullname || '—' },
    { key:'amount',      label:'Amount', render: v => <strong style={{ color:'var(--success)' }}>₹{(v||0).toLocaleString('en-IN', {minimumFractionDigits:2})}</strong> },
  ];

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:800 }}>Merchant Dashboard</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Your sales overview</p>
      </div>

      {loading ? <p style={{ color:'var(--text2)' }}>Loading...</p> : data && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
            <StatCard icon="📦" label="Total Products" value={data.totalProducts} color="var(--accent)" />
            <StatCard icon="🛍️" label="Total Sales"    value={data.totalSales}    color="var(--accent2)" />
            <StatCard icon="💰" label="Total Revenue"  value={`₹${(data.totalRevenue||0).toLocaleString('en-IN')}`} color="var(--success)" />
          </div>

          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
            <div style={{ padding:'1.2rem 1.5rem', borderBottom:'1px solid var(--border)', fontWeight:700 }}>Recent Sales</div>
            <Table columns={cols} data={data.recentSales} emptyMsg="No sales yet" />
          </div>
        </>
      )}
    </Layout>
  );
}
