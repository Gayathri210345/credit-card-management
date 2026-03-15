import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 50% -10%, rgba(108,99,255,0.2) 0%, var(--bg) 60%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' }}>
      <div style={{ fontSize:'0.8rem', letterSpacing:'3px', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1rem', fontWeight:600 }}>CCMS BANK</div>
      <h1 style={{ fontFamily:'var(--font-head)', fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:800, lineHeight:1.05, marginBottom:'1.2rem' }}>
        Credit Card<br /><span style={{ color:'var(--accent)' }}>Management</span> System
      </h1>
      <p style={{ color:'var(--text2)', fontSize:'1.1rem', maxWidth:'520px', lineHeight:1.7, marginBottom:'3rem' }}>
        Apply for a credit card, shop with merchants, track your spending, and manage repayments — all in one platform.
      </p>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'4rem' }}>
        <Link to="/apply" style={{ background:'var(--accent)', color:'#fff', padding:'0.9rem 2.2rem', borderRadius:'10px', fontWeight:700, fontSize:'1rem', transition:'opacity 0.2s' }}>
          Apply for Card
        </Link>
        <Link to="/customer/login" style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', padding:'0.9rem 2.2rem', borderRadius:'10px', fontWeight:600, fontSize:'1rem' }}>
          Customer Login
        </Link>
        <Link to="/merchant/login" style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', padding:'0.9rem 2.2rem', borderRadius:'10px', fontWeight:600, fontSize:'1rem' }}>
          Merchant Login
        </Link>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', maxWidth:'900px', width:'100%', marginBottom:'3rem' }}>
        {[['💳','Apply','Fill the form and submit your credit card application'],
          ['✅','Get Approved','Admin reviews and approves your application'],
          ['🛍️','Shop','Browse products from merchants and pay with credit'],
          ['💰','Repay','Easily repay your outstanding credit balance']
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'12px', padding:'1.5rem', textAlign:'left' }}>
            <div style={{ fontSize:'1.8rem', marginBottom:'0.6rem' }}>{icon}</div>
            <div style={{ fontWeight:700, marginBottom:'0.4rem', fontFamily:'var(--font-head)' }}>{title}</div>
            <div style={{ color:'var(--text2)', fontSize:'0.85rem', lineHeight:1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
      <Link to="/admin/login" style={{ color:'var(--text2)', fontSize:'0.85rem', borderBottom:'1px solid var(--border)', paddingBottom:'2px' }}>Admin Login →</Link>
    </div>
  );
}
