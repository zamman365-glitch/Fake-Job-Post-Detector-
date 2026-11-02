import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * High-Definition Engineered IconBadge
 * Uses SVG vector geometry so angled cuts, chamfers, and borders
 * are razor-sharp with 100% vector clarity in both Dark and Light modes.
 */
export function IconBadge({
  icon: Icon,
  shape = 'octagonal', // 'octagonal' | 'sharp' | 'hex'
  size = 'md',         // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant = 'default',  // 'default' | 'genuine' | 'fraud' | 'neutral'
  color,
  style = {},
  className = '',
  title,
  ...props
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const config = {
    xs: { dim: 22, iconSize: 11, cut: 5, stroke: 1.5 },
    sm: { dim: 30, iconSize: 15, cut: 7, stroke: 1.5 },
    md: { dim: 40, iconSize: 19, cut: 9, stroke: 1.5 },
    lg: { dim: 50, iconSize: 24, cut: 12, stroke: 1.8 },
    xl: { dim: 62, iconSize: 30, cut: 15, stroke: 2 }
  }[size] || { dim: 40, iconSize: 19, cut: 9, stroke: 1.5 };

  const { dim, iconSize, cut, stroke } = config;

  // Generate SVG polygon coordinates with stroke inset padding
  const p = stroke / 2;
  const max = dim - p;
  const c = cut;

  let points = '';
  if (shape === 'octagonal') {
    // 8-sided symmetrical chamfered octagon
    points = `${c},${p} ${max - c},${p} ${max},${c} ${max},${max - c} ${max - c},${max} ${c},${max} ${p},${max - c} ${p},${c}`;
  } else if (shape === 'hex') {
    // 6-sided technical hexagon
    points = `${dim / 2},${p} ${max},${dim * 0.25} ${max},${dim * 0.75} ${dim / 2},${max} ${p},${dim * 0.75} ${p},${dim * 0.25}`;
  } else {
    // 'sharp': cut top-right and bottom-left
    points = `${p},${p} ${max - c},${p} ${max},${c} ${max},${max} ${c},${max} ${p},${max - c}`;
  }

  // Color schemes tailored for high contrast in Dark and Light modes
  const themeColors = {
    dark: {
      default: {
        fill: '#151916',
        stroke: '#2e3731',
        icon: color || '#e9efeb'
      },
      genuine: {
        fill: 'rgba(31, 122, 77, 0.2)',
        stroke: '#1f7a4d',
        icon: color || '#4fb07f'
      },
      fraud: {
        fill: 'rgba(193, 18, 31, 0.2)',
        stroke: '#c1121f',
        icon: color || '#e5484d'
      },
      neutral: {
        fill: '#111412',
        stroke: '#252a27',
        icon: color || '#8a968f'
      }
    },
    light: {
      default: {
        fill: '#eef3ef',
        stroke: '#b4c4b8',
        icon: color || '#0a110d'
      },
      genuine: {
        fill: '#ecfdf3',
        stroke: '#16a34a',
        icon: color || '#15803d'
      },
      fraud: {
        fill: '#fef2f2',
        stroke: '#dc2626',
        icon: color || '#b91c1c'
      },
      neutral: {
        fill: '#f0f4f1',
        stroke: '#c2cec5',
        icon: color || '#3f5045'
      }
    }
  };

  const activeColors = themeColors[isLight ? 'light' : 'dark'][variant] || themeColors.dark.default;

  return (
    <div
      className={`icon-badge-wrap ${className}`}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        ...style
      }}
      title={title}
      {...props}
    >
      {/* Precision Vector Frame */}
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <polygon
          points={points}
          fill={activeColors.fill}
          stroke={activeColors.stroke}
          strokeWidth={stroke}
          strokeLinejoin="miter"
          strokeMiterlimit={3}
        />
      </svg>

      {/* Centered Icon Vector */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: activeColors.icon
        }}
      >
        {Icon && <Icon size={iconSize} color={activeColors.icon} strokeWidth={2.2} />}
      </div>
    </div>
  );
}
