import React, { useState, useEffect } from 'react';
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
  const [open, setOpen] = useState(window.innerWidth > 768);
  const [mobile, setMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setMobile(isMobile);
      if (!isMobile) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = user?.role === 'admin' ? adminLinks
              : user?.role === 'customer' ? customerLinks
              : merchantLinks;

  const handleLinkClick = () => {
    if (mobile) setOpen(false);
  };

  return (
    <>
      {/* Top Navbar - always visible */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        height: '56px', display: 'flex', alignItems: 'center',
        padding: '0 1rem', justifyContent: 'space-between'
      }}>
        {/* Left: Toggle + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer',
              color: 'var(--text)', fontSize: '1.1rem', lineHeight: 1,
              transition: 'all 0.2s'
            }}>
            {open ? '✕' : '☰'}
          </button>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
            CCAMS
          </span>
        </div>

        {/* Right: Role badge + user name + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{
            background: 'rgba(108,99,255,0.15)', color: 'var(--accent)',
            borderRadius: '20px', padding: '0.2rem 0.7rem',
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {user?.role}
          </span>
          <span style={{ color: 'var(--text2)', fontSize: '0.85rem', display: mobile ? 'none' : 'block' }}>
            {user?.name}
          </span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              background: 'var(--danger)', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '0.35rem 0.9rem',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 149
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: '56px',
        left: 0,
        height: 'calc(100vh - 56px)',
        width: '220px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 150,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto'
      }}>
        {/* User info */}
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '0.2rem' }}>Logged in as</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name}
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0.8rem 0' }}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={handleLinkClick}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: '0.7rem 1.2rem',
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
                borderRight: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                fontSize: '0.9rem', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s'
              })}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              width: '100%', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--text2)',
              borderRadius: '8px', padding: '0.55rem', fontSize: '0.85rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--danger)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--danger)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border)'; }}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}