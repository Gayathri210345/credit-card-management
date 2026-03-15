import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [info, setInfo]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying]   = useState(null);
  const [msg, setMsg]   = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/customer/products'), api.get('/customer/dashboard')])
      .then(([p, d]) => { setProducts(p.data); setInfo(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const buy = async (product) => {
    setBuying(product._id); setMsg(''); setError('');
    try {
      const { data } = await api.post('/customer/purchase', { product_id: product._id });
      setMsg(data.message);
      const d = await api.get('/customer/dashboard');
      setInfo(d.data);
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      setTimeout(() => setError(''), 5000);
    } finally { setBuying(null); }
  };

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Browse & Buy</h1>
          <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>Shop with your credit card</p>
        </div>
        {info?.approved && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.6rem 1.2rem', fontSize:'0.9rem' }}>
            Available Credit: <strong style={{ color:'var(--success)' }}>₹{(info.available_credit||0).toLocaleString('en-IN')}</strong>
          </div>
        )}
      </div>

      {msg   && <Alert type="success">{msg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {loading ? <p style={{ color:'var(--text2)' }}>Loading products...</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.2rem' }}>
          {products.length === 0 ? (
            <p style={{ color:'var(--text2)' }}>No products available yet.</p>
          ) : products.map(p => (
            <div key={p._id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', transition:'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.product_name} style={{ width:'100%', height:'160px', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
              ) : (
                <div style={{ width:'100%', height:'120px', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>📦</div>
              )}
              <div style={{ padding:'1.2rem' }}>
                <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.3rem' }}>{p.product_name}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.82rem', marginBottom:'0.5rem' }}>by {p.merchant_id?.businessname || 'Merchant'}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.85rem', marginBottom:'1rem', lineHeight:1.4 }}>{p.description}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:800, color:'var(--success)' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  <Button variant="primary" style={{ padding:'0.5rem 1.2rem', fontSize:'0.85rem' }}
                    loading={buying === p._id}
                    disabled={!info?.approved || p.price > (info?.available_credit || 0)}
                    onClick={() => buy(p)}>
                    {!info?.approved ? 'Not Approved' : p.price > (info?.available_credit||0) ? 'Low Credit' : 'Buy Now'}
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
