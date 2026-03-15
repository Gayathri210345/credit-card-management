import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

function genCardNumber(id) {
  const seed = (id || '').slice(-8).replace(/[^0-9]/g,'').padStart(8,'1234');
  return `4${seed.slice(0,3)} ${seed.slice(3,5)}** **** ${seed.slice(5,9) || '0000'}`.slice(0,19);
}

export default function CustomerCard() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    api.get('/customer/dashboard').then(r => setInfo(r.data));
  }, []);

  const cardNumber = '4321 56XX XXXX 7890';
  const expiry = '12/30';
  const cvv = '***';

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>My Virtual Card</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Your CCMS Credit Card</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2rem' }}>
        {/* Card */}
        <div onClick={() => setFlipped(!flipped)} style={{ cursor:'pointer', width:'360px', height:'220px', position:'relative', transformStyle:'preserve-3d', transition:'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden', background:'linear-gradient(135deg, #1a1a3e 0%, #6c63ff 100%)', borderRadius:'16px', padding:'1.5rem', color:'#fff', boxShadow:'0 20px 60px rgba(108,99,255,0.4)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.1rem' }}>CCMS BANK</div>
              <div style={{ fontSize:'1.8rem' }}>💎</div>
            </div>
            <div style={{ fontFamily:'monospace', fontSize:'1.35rem', letterSpacing:'3px', textShadow:'0 1px 3px rgba(0,0,0,0.4)' }}>{cardNumber}</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <div style={{ fontSize:'0.65rem', opacity:0.7, letterSpacing:'1px', marginBottom:'0.2rem' }}>CARD HOLDER</div>
                <div style={{ fontWeight:600, textTransform:'uppercase', letterSpacing:'1px' }}>{user?.name || 'CARDHOLDER'}</div>
              </div>
              <div>
                <div style={{ fontSize:'0.65rem', opacity:0.7, letterSpacing:'1px', marginBottom:'0.2rem' }}>EXPIRES</div>
                <div style={{ fontWeight:600 }}>{expiry}</div>
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.3rem', fontStyle:'italic' }}>VISA</div>
            </div>
          </div>
          {/* Back */}
          <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden', background:'linear-gradient(135deg, #2d2d5e 0%, #4a44cc 100%)', borderRadius:'16px', transform:'rotateY(180deg)', overflow:'hidden', color:'#fff', boxShadow:'0 20px 60px rgba(108,99,255,0.4)' }}>
            <div style={{ background:'#1a1a3e', height:'45px', margin:'30px 0 20px' }} />
            <div style={{ padding:'0 1.5rem' }}>
              <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'4px', padding:'0.5rem 1rem', display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
                <span style={{ fontFamily:'monospace', letterSpacing:'2px' }}>{cvv}</span>
              </div>
              <div style={{ fontSize:'0.75rem', opacity:0.7, lineHeight:1.5 }}>
                This card is for authorized use only. If found, please call CCMS Bank helpline.
              </div>
            </div>
          </div>
        </div>
        <p style={{ color:'var(--text2)', fontSize:'0.85rem' }}>Click card to flip</p>

        {/* Credit info */}
        {info?.approved && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem', width:'100%', maxWidth:'400px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {[
                ['Credit Limit', `₹${(info.credit_limit||0).toLocaleString('en-IN')}`],
                ['Available', `₹${(info.available_credit||0).toLocaleString('en-IN')}`],
                ['Outstanding', `₹${(info.outstanding||0).toLocaleString('en-IN')}`],
                ['Utilization', `${info.credit_limit > 0 ? Math.round((info.outstanding/info.credit_limit)*100) : 0}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ textAlign:'center', padding:'0.8rem', background:'var(--surface2)', borderRadius:'8px' }}>
                  <div style={{ color:'var(--text2)', fontSize:'0.75rem', marginBottom:'0.3rem' }}>{label}</div>
                  <div style={{ fontWeight:700, fontSize:'1.1rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => window.print()} style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', padding:'0.7rem 2rem', fontWeight:600, fontSize:'0.95rem' }}>
          🖨️ Print / Download Card
        </button>
      </div>
    </Layout>
  );
}
