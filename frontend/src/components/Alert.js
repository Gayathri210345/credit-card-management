import React from 'react';

export default function Alert({ type='info', children }) {
  const colors = {
    success: { bg:'rgba(46,213,115,0.1)', border:'var(--success)', color:'var(--success)' },
    error:   { bg:'rgba(255,71,87,0.1)',  border:'var(--danger)',  color:'var(--danger)' },
    warning: { bg:'rgba(255,165,2,0.1)',  border:'var(--warning)', color:'var(--warning)' },
    info:    { bg:'rgba(108,99,255,0.1)', border:'var(--accent)',  color:'var(--accent)' },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.color, borderRadius:'8px', padding:'0.8rem 1rem', marginBottom:'1rem', fontSize:'0.9rem' }}>
      {children}
    </div>
  );
}
