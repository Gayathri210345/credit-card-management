import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:800 }}>Dashboard</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Credit Card Application Management System — Overview</p>
      </div>
      {loading ? <p style={{ color:'var(--text2)' }}>Loading stats...</p> : stats && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
            <StatCard icon="📝" label="Total Applications" value={stats.total}     color="var(--accent)" />
            <StatCard icon="⏳" label="Pending"            value={stats.pending}   color="var(--warning)" />
            <StatCard icon="✅" label="Approved"           value={stats.approved}  color="var(--success)" />
            <StatCard icon="❌" label="Rejected"           value={stats.rejected}  color="var(--danger)" />
            <StatCard icon="👥" label="Customers"          value={stats.customers} color="var(--accent2)" />
            <StatCard icon="🏪" label="Merchants"          value={stats.merchants} color="var(--accent)" />
          </div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
            <div style={{ color:'var(--text2)', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'0.5rem' }}>Total Platform Revenue</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'2.5rem', fontWeight:800, color:'var(--success)' }}>
              ₹{(stats.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits:2 })}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
