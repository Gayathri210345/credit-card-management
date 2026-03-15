import React from 'react';

export default function StatCard({ label, value, color='var(--accent)', icon, sub }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem 1.8rem', flex:1, minWidth:'160px' }}>
      <div style={{ fontSize:'2rem', marginBottom:'0.6rem' }}>{icon}</div>
      <div style={{ color:'var(--text2)', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'0.4rem', fontWeight:500 }}>{label}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:800, color, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ color:'var(--text2)', fontSize:'0.8rem', marginTop:'0.4rem' }}>{sub}</div>}
    </div>
  );
}
