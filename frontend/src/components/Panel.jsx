import React from 'react';

/**
 * Reusable Sharp Panel container
 * Provides hard 1px border, 14px angular corner cut, and optional technical header.
 */
export function Panel({
  children,
  title,
  subtitle,
  tag,
  headerAction,
  variant = 'default', // 'default' | 'genuine' | 'fraud'
  className = '',
  cutCorner = true,
  style = {},
  ...props
}) {
  const borderColor = {
    default: 'var(--charcoal-700)',
    genuine: 'var(--forest-500)',
    fraud: 'var(--crimson-500)'
  }[variant];

  return (
    <div
      className={`${cutCorner ? 'sharp-cut' : ''} ${className}`}
      style={{
        position: 'relative',
        background: 'var(--charcoal-900)',
        border: `1px solid ${borderColor}`,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        ...style
      }}
      {...props}
    >
      {(title || tag || headerAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--charcoal-700)',
            background: 'var(--panel-tint)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {tag && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  padding: '2px 8px',
                  background: 'var(--charcoal-800)',
                  border: '1px solid var(--charcoal-700)',
                  color: 'var(--muted)',
                  textTransform: 'uppercase'
                }}
              >
                {tag}
              </span>
            )}
            {title && (
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                  color: 'var(--text)',
                  margin: 0
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500'
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  );
}
