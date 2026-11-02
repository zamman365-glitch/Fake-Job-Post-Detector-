import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Static graphic fallback for mobile screens (<768px),
 * users requesting reduced motion, or devices without WebGL.
 */
export function StaticGraphicFallback({ state = 'neutral' }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isFraud = state === 'fraud';
  const isGenuine = state === 'genuine';

  const strokeColor = isFraud
    ? '#e5484d'
    : isGenuine
    ? (isLight ? '#166940' : '#4fb07f')
    : (isLight ? '#637368' : '#8a968f');

  const glowFilter = isFraud
    ? 'drop-shadow(0 0 10px rgba(193, 18, 31, 0.45))'
    : isGenuine
    ? 'drop-shadow(0 0 10px rgba(31, 122, 77, 0.45))'
    : 'none';

  const ringStroke = isLight ? '#d0d7d2' : '#252a27';
  const docFill = isLight ? '#ffffff' : '#131614';
  const docStroke = isLight ? '#b5c0b8' : '#353c37';
  const docLine = isLight ? '#166940' : '#4a544d';
  const shieldFill = isLight ? '#ffffff' : '#131614';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: isLight
          ? 'radial-gradient(circle at center, rgba(31, 122, 77, 0.05) 0%, transparent 70%)'
          : 'radial-gradient(circle at center, rgba(37, 42, 39, 0.3) 0%, transparent 70%)',
        filter: glowFilter
      }}
    >
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '85%', maxWidth: '320px', height: 'auto' }}
      >
        {/* Background Radar Rings */}
        <circle cx="160" cy="160" r="140" stroke={ringStroke} strokeDasharray="4 6" strokeWidth="1" />
        <circle cx="160" cy="160" r="100" stroke={ringStroke} strokeWidth="1" />
        <circle cx="160" cy="160" r="60" stroke={ringStroke} strokeDasharray="2 4" strokeWidth="1" />

        {/* Wireframe Floating Document */}
        <g opacity="0.75">
          <path
            d="M80 60 L190 60 L230 100 L230 250 L80 250 Z"
            stroke={docStroke}
            strokeWidth="1.5"
            fill={docFill}
          />
          <path d="M190 60 L190 100 L230 100" stroke={docStroke} strokeWidth="1.5" />
          <line x1="100" y1="120" x2="180" y2="120" stroke={docLine} strokeWidth="2" opacity="0.6" />
          <line x1="100" y1="145" x2="210" y2="145" stroke={docLine} strokeWidth="2" opacity="0.6" />
          <line x1="100" y1="170" x2="190" y2="170" stroke={docLine} strokeWidth="2" opacity="0.6" />
          <line x1="100" y1="195" x2="160" y2="195" stroke={docLine} strokeWidth="2" opacity="0.6" />
        </g>

        {/* Floating Defense Shield */}
        <g>
          {isFraud ? (
            // Cracked / Glitched Shield
            <>
              <path
                d="M160 85 L215 110 V175 C215 215 160 245 160 245 C160 245 105 215 105 175 V110 Z"
                stroke={strokeColor}
                strokeWidth="2"
                fill={shieldFill}
              />
              {/* Jagged crack line */}
              <path
                d="M160 95 L150 135 L175 160 L145 195 L160 235"
                stroke="#e5484d"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <circle cx="145" cy="195" r="3" fill="#e5484d" />
            </>
          ) : (
            // Stable Genuine Shield
            <>
              <path
                d="M160 85 L215 110 V175 C215 215 160 245 160 245 C160 245 105 215 105 175 V110 Z"
                stroke={strokeColor}
                strokeWidth="2.5"
                fill={shieldFill}
              />
              <path
                d="M160 105 L195 125 V165 C195 195 160 220 160 220 C160 220 125 195 125 165 V125 Z"
                stroke={strokeColor}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <polyline
                points="140,165 155,180 185,145"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            </>
          )}
        </g>

        {/* Orbiting Geometric Shards */}
        <polygon points="250,110 260,115 255,125 245,120" fill={strokeColor} opacity="0.8" />
        <polygon points="65,180 75,175 80,188 70,192" fill={strokeColor} opacity="0.7" />
        <polygon points="210,260 220,255 225,268 215,272" fill={strokeColor} opacity="0.6" />
      </svg>
    </div>
  );
}
