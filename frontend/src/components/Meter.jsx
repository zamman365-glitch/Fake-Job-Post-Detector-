import React from 'react';

/**
 * Reusable Sharp Segmented Meter
 * Zero border-radius, distinct tick segments, and strict color semantics:
 * Genuine (<= 0.5) is forest, Fraud (> 0.5) is crimson.
 */
export function Meter({
  value = 0,         // 0 to 1 float
  segments = 14,     // Total discrete segments
  height = 14,
  showLabels = true,
  className = ''
}) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const activeCount = Math.round(clamped * segments);
  const isHighRisk = clamped > 0.5;

  const activeColor = isHighRisk ? 'var(--crimson-500)' : 'var(--forest-500)';
  const activeBorder = isHighRisk ? 'var(--crimson-300)' : 'var(--forest-300)';

  return (
    <div className={className} style={{ width: '100%' }}>
      {showLabels && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem'
          }}
        >
          <span style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Risk Meter
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: isHighRisk ? 'var(--crimson-300)' : 'var(--forest-300)'
            }}
          >
            {(clamped * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Segmented meter blocks */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Risk probability segmented meter"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${segments}, 1fr)`,
          gap: '3px',
          width: '100%',
          padding: '2px',
          background: 'var(--charcoal-950)',
          border: '1px solid var(--charcoal-700)'
        }}
      >
        {Array.from({ length: segments }).map((_, index) => {
          const isActive = index < activeCount;
          return (
            <div
              key={index}
              style={{
                height: `${height}px`,
                background: isActive ? activeColor : 'var(--charcoal-900)',
                border: isActive
                  ? `1px solid ${activeBorder}`
                  : '1px solid rgba(255, 255, 255, 0.04)',
                boxShadow: isActive
                  ? isHighRisk
                    ? '0 0 6px rgba(193, 18, 31, 0.4)'
                    : '0 0 6px rgba(31, 122, 77, 0.4)'
                  : 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease'
              }}
            />
          );
        })}
      </div>

      {showLabels && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--subtle)'
          }}
        >
          <span>0.0 SAFE</span>
          <span style={{ color: 'var(--muted)' }}>0.5 THRESHOLD</span>
          <span>1.0 CRITICAL</span>
        </div>
      )}
    </div>
  );
}
