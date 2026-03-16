import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        padding: '2rem',
        marginTop: '56px',
        overflowY: 'auto',
        transition: 'margin-left 0.25s ease'
      }}>
        {children}
      </main>
    </div>
  );
}