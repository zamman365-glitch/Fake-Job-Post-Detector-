import React from 'react';
import { IconBadge } from './IconBadge';

/**
 * Reusable KPI Card
 * Displays metrics with sharp geometry, technical labels, and shaped icon badges.
 */
export function KpiCard({
  label,
  value,
  subvalue,
  icon: Icon,
  variant = 'default', // 'default' | 'genuine' | 'fraud'
  className = ''
}) {
  const accentColor = {
    default: 'var(--muted)',
    genuine: 'var(--forest-300)',
    fraud: 'var(--crimson-300)'
  }[variant];

  const borderColor = {
    default: 'var(--charcoal-700)',
    genuine: 'var(--forest-500)',
    fraud: 'var(--crimson-500)'
  }[variant];

  return (
    <div
      className={`sharp-cut ${className}`}
      style={{
        background: 'var(--charcoal-900)',
        border: `1px solid ${borderColor}`,
        padding: '1.25rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '120px',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)'
          }}
        >
          {label}
        </span>
        {Icon && (
          <IconBadge
            icon={Icon}
            shape="sharp"
            size="sm"
            variant={variant}
          />
        )}
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: '700',
            lineHeight: 1,
            color: accentColor !== 'var(--muted)' ? accentColor : 'var(--text)'
          }}
        >
          {value}
        </div>
        {subvalue && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--muted)',
              marginTop: '0.45rem'
            }}
          >
            {subvalue}
          </div>
        )}
      </div>
    </div>
  );
}
