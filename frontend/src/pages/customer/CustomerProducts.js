import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [info, setInfo]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [buying, setBuying]     = useState(null);
  const [error, setError]       = useState('');
  const [receipt, setReceipt]   = useState(null);

  const loadData = () =>
    Promise.all([api.get('/customer/products'), api.get('/customer/dashboard')])
      .then(([p, d]) => { setProducts(p.data); setInfo(d.data); })
      .finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const buy = async (product) => {
    setBuying(product._id); setError('');
    try {
      const { data } = await api.post('/customer/purchase', { product_id: product._id });
      const d = await api.get('/customer/dashboard');
      setInfo(d.data);
      setReceipt({
        product_name: data.product.product_name,
        amount:       data.product.price,
        merchant:     data.product.merchant_id?.businessname || 'Merchant',
        date:         new Date().toLocaleString('en-IN'),
        available:    d.data.available_credit,
        outstanding:  d.data.outstanding,
        credit_limit: d.data.credit_limit,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      setTimeout(() => setError(''), 5000);
    } finally { setBuying(null); }
  };

  const fmt = n => 'Rs.' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const pct = info?.credit_limit > 0
    ? Math.min(100, Math.round((info.outstanding / info.credit_limit) * 100))
    : 0;

  const downloadReceipt = () => {
    if (!receipt) return;
    const lines = [
      '============================================',
      '         IOB BANK - PURCHASE RECEIPT        ',
      '============================================',
      '',
      'Product       : ' + receipt.product_name,
      'Merchant      : ' + receipt.merchant,
      'Amount        : ' + fmt(receipt.amount),
      'Date & Time   : ' + receipt.date,
      'Status        : Payment Successful',
      '',
      '--------------------------------------------',
      '             CREDIT CARD SUMMARY            ',
      '--------------------------------------------',
      'Credit Limit  : ' + fmt(receipt.credit_limit),
      'Outstanding   : ' + fmt(receipt.outstanding),
      'Available     : ' + fmt(receipt.available),
      '',
      '============================================',
      '  Thank you for using IOB Credit Card!      ',
      '============================================',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Purchase_Receipt_' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      {/* Receipt Modal */}
      {receipt && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', color:'#000', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'440px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            {/* Header */}
            <div style={{ textAlign:'center', borderBottom:'2px dashed #ddd', paddingBottom:'1rem', marginBottom:'1.2rem' }}>
              <div style={{ fontSize:'2.5rem' }}>🧾</div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:800, color:'#6c63ff', margin:'0.3rem 0 0.2rem' }}>Purchase Receipt</h2>
              <p style={{ color:'#888', fontSize:'0.82rem' }}>IOB Bank Credit Card</p>
            </div>
            {/* Details */}
            {[
              ['Product',        receipt.product_name],
              ['Merchant',       receipt.merchant],
              ['Amount Charged', fmt(receipt.amount)],
              ['Date & Time',    receipt.date],
              ['Status',         'Payment Successful'],
            ].map(([label, value]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.55rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <span style={{ color:'#666', fontSize:'0.88rem' }}>{label}</span>
                <span style={{ fontWeight:700, fontSize:'0.88rem', color: label === 'Status' ? 'green' : label === 'Amount Charged' ? '#e74c3c' : '#000' }}>{value}</span>
              </div>
            ))}
            {/* Credit Summary */}
            <div style={{ background:'#f8f8ff', borderRadius:'8px', padding:'0.8rem', margin:'1rem 0' }}>
              <div style={{ fontWeight:700, marginBottom:'0.5rem', color:'#6c63ff', fontSize:'0.85rem' }}>CREDIT CARD SUMMARY</div>
              {[
                ['Credit Limit',  fmt(receipt.credit_limit)],
                ['Outstanding',   fmt(receipt.outstanding)],
                ['Available',     fmt(receipt.available)],
              ].map(([label, value]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', padding:'0.2rem 0' }}>
                  <span style={{ color:'#666' }}>{label}</span>
                  <span style={{ fontWeight:700 }}>{value}</span>
                </div>
              ))}
            </div>
            {/* Success */}
            <div style={{ textAlign:'center', marginBottom:'1.2rem' }}>
              <div style={{ color:'green', fontWeight:700, fontSize:'1rem' }}>✅ Payment Successful!</div>
              <div style={{ color:'#888', fontSize:'0.8rem', marginTop:'0.2rem' }}>Thank you for using IOB Credit Card</div>
            </div>
            {/* Buttons */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
              <button onClick={downloadReceipt} style={{ background:'#6c63ff', color:'#fff', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                ⬇️ Download
              </button>
              <button onClick={() => window.print()} style={{ background:'#00d4a8', color:'#000', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                🖨️ Print
              </button>
              <button onClick={() => setReceipt(null)} style={{ gridColumn:'1/-1', background:'#f0f0f0', color:'#333', border:'none', borderRadius:'8px', padding:'0.7rem', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Browse & Buy</h1>
          <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Shop with your credit card</p>
        </div>
        {info?.approved && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'0.8rem 1.2rem' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:'0.3rem' }}>Available Credit</div>
            <div style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--success)' }}>{fmt(info.available_credit)}</div>
          </div>
        )}
      </div>

      {/* Credit Usage Bar */}
      {info?.approved && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.2rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'0.85rem' }}>
            <span style={{ color:'var(--text2)' }}>Credit Usage</span>
            <span style={{ fontWeight:700, color: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)' }}>{pct}% used</span>
          </div>
          <div style={{ background:'var(--surface2)', borderRadius:'8px', height:'10px', overflow:'hidden' }}>
            <div style={{ width: pct + '%', height:'100%', background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)', borderRadius:'8px', transition:'width 0.5s' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.5rem', fontSize:'0.8rem', color:'var(--text2)' }}>
            <span>Used: {fmt(info.outstanding)}</span>
            <span>Limit: {fmt(info.credit_limit)}</span>
          </div>
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}

      {loading ? <p style={{ color:'var(--text2)' }}>Loading products...</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.2rem' }}>
          {products.length === 0 ? (
            <p style={{ color:'var(--text2)', gridColumn:'1/-1' }}>No products available yet.</p>
          ) : products.map(p => (
            <div key={p._id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', transition:'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              {p.image_url
                ? <img src={p.image_url} alt={p.product_name} style={{ width:'100%', height:'160px', objectFit:'cover' }} onError={e => e.target.style.display = 'none'} />
                : <div style={{ width:'100%', height:'120px', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>📦</div>
              }
              <div style={{ padding:'1.2rem' }}>
                <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.3rem' }}>{p.product_name}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.82rem', marginBottom:'0.5rem' }}>by {p.merchant_id?.businessname || 'Merchant'}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.85rem', marginBottom:'1rem', lineHeight:1.4 }}>{p.description}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:800, color:'var(--success)' }}>{fmt(p.price)}</div>
                  <Button variant="primary" style={{ padding:'0.5rem 1.2rem', fontSize:'0.85rem' }}
                    loading={buying === p._id}
                    disabled={!info?.approved || p.price > (info?.available_credit || 0)}
                    onClick={() => buy(p)}>
                    {!info?.approved ? 'Not Approved' : p.price > (info?.available_credit || 0) ? 'Low Credit' : 'Buy Now'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}