import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import api from '../../api';

export default function AddProduct() {
  const [form, setForm] = useState({ product_name:'', price:'', description:'', image_url:'' });
  const [msg, setMsg]   = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await api.post('/merchant/products', form);
      setMsg(data.message);
      setTimeout(() => navigate('/merchant/products'), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Failed to add product'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800 }}>Add Product</h1>
        <p style={{ color:'var(--text2)', marginTop:'0.3rem' }}>List a new product for customers to buy</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', maxWidth:'900px' }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
          {msg   && <Alert type="success">{msg}</Alert>}
          {error && <Alert type="error">{error}</Alert>}
          <form onSubmit={submit}>
            <Input label="Product Name *"    name="product_name" value={form.product_name} onChange={handle} required placeholder="e.g. iPhone 15 Pro" />
            <Input label="Price (₹) *"       name="price"        value={form.price}        onChange={handle} required type="number" step="0.01" min="1" placeholder="e.g. 89999" />
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'0.82rem', color:'var(--text2)', marginBottom:'0.35rem', fontWeight:500 }}>Description</label>
              <textarea name="description" value={form.description} onChange={handle} placeholder="Describe your product..." rows={4}
                style={{ width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.7rem 1rem', color:'var(--text)', fontSize:'0.95rem', outline:'none', resize:'vertical', transition:'border 0.2s' }}
                onFocus={e => e.target.style.borderColor='var(--accent)'}
                onBlur={e => e.target.style.borderColor='var(--border)'} />
            </div>
            <Input label="Image URL" name="image_url" value={form.image_url} onChange={handle} placeholder="https://example.com/image.jpg" />
            <Button type="submit" loading={loading} style={{ width:'100%' }}>Add Product</Button>
          </form>
        </div>

        {/* Preview */}
        <div>
          <div style={{ color:'var(--text2)', fontSize:'0.85rem', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'1px' }}>Preview</div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
            {form.image_url ? (
              <img src={form.image_url} alt="preview" style={{ width:'100%', height:'160px', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
            ) : (
              <div style={{ width:'100%', height:'140px', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>📦</div>
            )}
            <div style={{ padding:'1.2rem' }}>
              <div style={{ fontWeight:700, fontSize:'1rem' }}>{form.product_name || 'Product Name'}</div>
              <div style={{ color:'var(--text2)', fontSize:'0.85rem', margin:'0.4rem 0' }}>{form.description || 'Product description will appear here'}</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:800, color:'var(--success)' }}>
                {form.price ? `₹${parseFloat(form.price).toLocaleString('en-IN')}` : '₹0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
