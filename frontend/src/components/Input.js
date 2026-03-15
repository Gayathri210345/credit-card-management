import React from 'react';

export default function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && (
        <label style={{ display:'block', fontSize:'0.82rem', color:'var(--text2)', marginBottom:'0.35rem', fontWeight:500, letterSpacing:'0.3px' }}>
          {label}
        </label>
      )}
      <input
        style={{ width:'100%', background:'var(--surface2)', border:`1px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius:'8px', padding:'0.7rem 1rem', color:'var(--text)', fontSize:'0.95rem', outline:'none', transition:'border 0.2s' }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)'; }}
        {...props}
      />
      {error && <div style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:'0.3rem' }}>{error}</div>}
    </div>
  );
}
