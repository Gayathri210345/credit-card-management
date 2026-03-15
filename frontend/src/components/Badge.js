import React from 'react';

const colors = {
  pending:   { bg:'rgba(255,165,2,0.15)',  color:'var(--warning)' },
  approved:  { bg:'rgba(46,213,115,0.15)', color:'var(--success)' },
  rejected:  { bg:'rgba(255,71,87,0.15)',  color:'var(--danger)'  },
  completed: { bg:'rgba(46,213,115,0.15)', color:'var(--success)' },
  purchase:  { bg:'rgba(108,99,255,0.15)', color:'var(--accent)'  },
  repayment: { bg:'rgba(0,212,168,0.15)',  color:'var(--accent2)' },
};

export default function Badge({ label }) {
  const c = colors[label?.toLowerCase()] || { bg:'var(--surface2)', color:'var(--text2)' };
  return (
    <span style={{ ...c, padding:'0.2rem 0.7rem', borderRadius:'20px', fontSize:'0.78rem', fontWeight:600, textTransform:'capitalize' }}>
      {label}
    </span>
  );
}
