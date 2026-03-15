import React from 'react';

const variants = {
  primary: { background:'var(--accent)',  color:'#fff',      border:'none' },
  success: { background:'var(--success)', color:'#080810',   border:'none' },
  danger:  { background:'var(--danger)',  color:'#fff',      border:'none' },
  warning: { background:'var(--warning)', color:'#080810',   border:'none' },
  outline: { background:'transparent',    color:'var(--accent)', border:'1px solid var(--accent)' },
  ghost:   { background:'var(--surface2)',color:'var(--text)',   border:'1px solid var(--border)' },
};

export default function Button({ children, variant='primary', loading=false, style, ...props }) {
  return (
    <button
      style={{ ...variants[variant], borderRadius:'8px', padding:'0.7rem 1.5rem', fontSize:'0.95rem', fontWeight:600, transition:'opacity 0.2s, transform 0.1s', opacity: loading || props.disabled ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', ...style }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? '⏳ Loading...' : children}
    </button>
  );
}
