import React from 'react';

export default function Card({ children, style }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1.5rem', ...style }}>
      {children}
    </div>
  );
}
