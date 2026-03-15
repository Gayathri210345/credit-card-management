import React from 'react';

export default function Table({ columns, data, emptyMsg='No data found' }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ padding:'0.8rem 1rem', textAlign:'left', borderBottom:'1px solid var(--border)', color:'var(--text2)', fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600, background:'var(--surface)' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding:'2rem', textAlign:'center', color:'var(--text2)' }}>{emptyMsg}</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {columns.map(col => (
                <td key={col.key} style={{ padding:'0.85rem 1rem', verticalAlign:'middle' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
