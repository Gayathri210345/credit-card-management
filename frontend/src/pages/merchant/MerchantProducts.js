import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function MerchantProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  const load = () => api.get('/merchant/products').then(r => setProducts(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/merchant/products/${id}`);
    setMsg('Product deleted.');
    setTimeout(() => setMsg(''), 3000);
    load();
  };

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>My Products</h1>
          <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>{products.length} product(s)</p>
        </div>
        <Link to="/merchant/add-product">
          <Button>➕ Add Product</Button>
        </Link>
      </div>

      {msg && <Alert type="success">{msg}</Alert>}

      {loading ? <p style={{ color:'var(--text2)' }}>Loading...</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.2rem' }}>
          {products.length === 0 ? (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'var(--text2)' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📦</div>
              <p>No products yet. <Link to="/merchant/add-product">Add your first product</Link></p>
            </div>
          ) : products.map(p => (
            <div key={p._id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.product_name} style={{ width:'100%', height:'150px', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
              ) : (
                <div style={{ width:'100%', height:'110px', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>📦</div>
              )}
              <div style={{ padding:'1.2rem' }}>
                <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.3rem' }}>{p.product_name}</div>
                <div style={{ color:'var(--text2)', fontSize:'0.85rem', marginBottom:'0.8rem', lineHeight:1.4 }}>{p.description}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'1.25rem', fontWeight:800, color:'var(--success)' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  <Button variant="danger" style={{ padding:'0.4rem 0.9rem', fontSize:'0.8rem' }} onClick={() => deleteProduct(p._id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
