import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Scan, LayoutDashboard, Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { checkHealth } from '../api/client';
import { useTheme } from '../hooks/useTheme';
import { IconBadge } from './IconBadge';

export function Navbar() {
  const [apiOnline, setApiOnline] = useState(null);
  const [latency, setLatency] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    let isMounted = true;
    async function ping() {
      const res = await checkHealth();
      if (isMounted) {
        setApiOnline(res.ok);
        setLatency(res.latencyMs);
      }
    }
    ping();
    const interval = setInterval(ping, 25000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.85rem',
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: isActive ? 'var(--text)' : 'var(--muted)',
    borderBottom: isActive ? `2px solid ${isLight ? 'var(--forest-500)' : 'var(--forest-300)'}` : '2px solid transparent',
    background: isActive ? (isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)') : 'transparent',
    transition: 'all 0.15s ease'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--header-bg)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--charcoal-700)',
        height: 'var(--header-height)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo with High-Contrast Precision Emblem */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none'
          }}
          aria-label="JobGuard Home"
        >
          {/* Custom High-Definition Logo Insignia */}
          <div
            style={{
              width: '38px',
              height: '38px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <polygon
                points="10,1 28,1 37,10 37,28 28,37 10,37 1,28 1,10"
                fill={isLight ? '#0d130f' : '#111713'}
                stroke={isLight ? '#16a34a' : '#22c55e'}
                strokeWidth="2"
                strokeLinejoin="miter"
              />
            </svg>
            <Shield
              size={18}
              color={isLight ? '#4ade80' : '#4fb07f'}
              style={{ position: 'relative', zIndex: 1 }}
              strokeWidth={2.4}
            />
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: '1.2rem',
                letterSpacing: '0.06em',
                color: 'var(--text)',
                lineHeight: 1
              }}
            >
              JOBGUARD
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                fontWeight: '700',
                color: isLight ? '#166534' : '#4fb07f',
                letterSpacing: '0.12em',
                marginTop: '3px'
              }}
            >
              ANTI-GRAVITY FRAUD DEFENSE
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>
            Overview
          </NavLink>
          <NavLink to="/scan" style={navLinkStyle}>
            <Scan size={15} />
            Scanner
          </NavLink>
          <NavLink to="/dashboard" style={navLinkStyle}>
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
        </nav>

        {/* Controls: Theme Toggle + API Health + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
          className="desktop-status"
        >
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            className="sharp-cut-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.8rem',
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'all 0.15s ease'
            }}
          >
            {isLight ? (
              <>
                <Moon size={14} color="#4338ca" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun size={14} color="#f59e0b" />
                <span>Light</span>
              </>
            )}
          </button>

          {/* API Health Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                background: apiOnline === true ? (isLight ? '#16a34a' : 'var(--forest-300)') : apiOnline === false ? 'var(--crimson-500)' : 'var(--muted)',
                display: 'inline-block',
                boxShadow: apiOnline ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none'
              }}
            />
            <span style={{ color: 'var(--muted)', fontWeight: '500' }}>
              API: {apiOnline === true ? `ONLINE (${latency}ms)` : apiOnline === false ? 'OFFLINE' : 'CHECKING'}
            </span>
          </div>

          {/* Scan CTA */}
          <NavLink
            to="/scan"
            className="sharp-cut"
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--forest-500)',
              color: '#ffffff',
              border: `1px solid ${isLight ? '#15803d' : 'var(--forest-300)'}`,
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: isLight ? '0 2px 6px rgba(21, 128, 61, 0.25)' : 'none'
            }}
          >
            Scan Post
          </NavLink>
        </div>

        {/* Mobile Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="mobile-actions">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              color: 'var(--text)',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {isLight ? <Moon size={18} color="#4338ca" /> : <Sun size={18} color="#f59e0b" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              color: 'var(--text)',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            background: 'var(--charcoal-900)',
            borderBottom: '1px solid var(--charcoal-700)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}
        >
          <NavLink to="/" style={navLinkStyle}>
            Overview
          </NavLink>
          <NavLink to="/scan" style={navLinkStyle}>
            Scanner
          </NavLink>
          <NavLink to="/dashboard" style={navLinkStyle}>
            Dashboard
          </NavLink>
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--charcoal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--muted)'
            }}
          >
            <span>API Status:</span>
            <span style={{ color: apiOnline ? 'var(--forest-500)' : 'var(--crimson-500)', fontWeight: '600' }}>
              {apiOnline ? `ONLINE (${latency}ms)` : 'OFFLINE'}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-status {
            display: none !important;
          }
          .mobile-actions {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
