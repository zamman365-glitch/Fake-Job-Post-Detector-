import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Reusable Sharp Button
 * Features 14px angular cut-corners, 1px hard borders, and strict semantic coloring
 * with theme-aware states.
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  id,
  ariaLabel,
  style = {},
  ...props
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sizeStyles = {
    sm: { padding: '0.45rem 0.95rem', fontSize: '0.78rem' },
    md: { padding: '0.75rem 1.4rem', fontSize: '0.85rem' },
    lg: { padding: '0.95rem 1.85rem', fontSize: '0.95rem' }
  }[size] || { padding: '0.75rem 1.4rem', fontSize: '0.85rem' };

  const variantStyles = {
    primary: {
      background: 'var(--forest-500)',
      color: '#ffffff',
      border: `1px solid ${isLight ? '#15803d' : 'var(--forest-300)'}`,
      boxShadow: isLight ? '0 2px 8px rgba(21, 128, 61, 0.25)' : '0 0 12px rgba(31, 122, 77, 0.3)'
    },
    secondary: {
      background: 'var(--charcoal-900)',
      color: 'var(--text)',
      border: '1px solid var(--charcoal-700)',
      boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
    },
    danger: {
      background: 'var(--crimson-500)',
      color: '#ffffff',
      border: `1px solid ${isLight ? '#dc2626' : 'var(--crimson-300)'}`,
      boxShadow: isLight ? '0 2px 8px rgba(220, 38, 38, 0.25)' : '0 0 12px rgba(193, 18, 31, 0.3)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--muted)',
      border: '1px solid transparent'
    }
  }[variant] || {};

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`sharp-cut ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease-in-out',
        outline: 'none',
        userSelect: 'none',
        textDecoration: 'none',
        ...sizeStyles,
        ...variantStyles,
        ...style
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === 'primary') {
          e.currentTarget.style.filter = 'brightness(1.12)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'var(--charcoal-800)';
          e.currentTarget.style.borderColor = 'var(--charcoal-600)';
        } else if (variant === 'danger') {
          e.currentTarget.style.filter = 'brightness(1.12)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'var(--charcoal-800)';
          e.currentTarget.style.color = 'var(--text)';
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.filter = 'none';
        e.currentTarget.style.background = variantStyles.background;
        e.currentTarget.style.borderColor = variantStyles.border.split(' ')[2];
        e.currentTarget.style.color = variantStyles.color;
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#ffffff',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      ) : Icon ? (
        <Icon size={16} strokeWidth={2.4} />
      ) : null}
      <span>{children}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
