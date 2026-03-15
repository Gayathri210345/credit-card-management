import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/',                   icon: '🏠', label: 'Home' },
  { to: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
  { to: '/admin/applications', icon: '📝', label: 'Applications' },
  { to: '/admin/customers',    icon: '👥', label: 'Customers' },
  { to: '/admin/merchants',    icon: '🏪', label: 'Merchants' },
];
const customerLinks = [
  { to: '/',                      icon: '🏠', label: 'Home' },
  { to: '/customer/dashboard',    icon: '📊', label: 'Dashboard' },
  { to: '/customer/card',         icon: '💳', label: 'My Card' },
  { to: '/customer/products',     icon: '🛍️', label: 'Browse & Buy' },
  { to: '/customer/repay',        icon: '💰', label: 'Repay' },
  { to: '/customer/transactions', icon: '📄', label: 'Transactions' },
];
const merchantLinks = [
  { to: '/',                     icon: '🏠', label: 'Home' },
  { to: '/merchant/dashboard',   icon: '📊', label: 'Dashboard' },
  { to: '/merchant/products',    icon: '📦', label: 'My Products' },
  { to: '/merchant/add-product', icon: '➕', label: 'Add Product' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks
              : user?.role === 'customer' ? customerLinks
              : merchantLinks;

  return (
    <aside style={{ width:'240px', background:'var(--surface)', borderRight:'1px solid var(--border)', minHeight:'100vh', display:'flex', flexDirection:'column', flexShrink:0 }}>
      <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'1.4rem', fontWeight:800, color:'var(--accent)' }}>CCAMS</div>
        <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:'4px', textTransform:'uppercase', letterSpacing:'1px' }}>{user?.role} Panel</div>
      </div>
      <nav style={{ flex:1, padding:'1rem 0' }}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'0.7rem',
            padding:'0.75rem 1.5rem', color: isActive ? 'var(--accent)' : 'var(--text2)',
            background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
            borderRight: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            fontSize:'0.9rem', fontWeight:500, textDecoration:'none', transition:'all 0.15s'
          })}>
            <span>{l.icon}</span>{l.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid var(--border)' }}>
        <div style={{ fontSize:'0.85rem', color:'var(--text2)', marginBottom:'0.6rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
        <button onClick={() => { logout(); navigate('/'); }} style={{ width:'100%', background:'transparent', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:'8px', padding:'0.55rem', fontSize:'0.85rem', transition:'all 0.2s' }}
          onMouseEnter={e => { e.target.style.background='var(--danger)'; e.target.style.color='#fff'; e.target.style.borderColor='var(--danger)'; }}
          onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--text2)'; e.target.style.borderColor='var(--border)'; }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
