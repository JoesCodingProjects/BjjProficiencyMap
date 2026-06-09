import { BELT_COLORS } from '../data/types'
import type { BeltLevel } from '../data/positions'

interface Props {
  belt: BeltLevel
}

export function BeltCardSVG({ belt }: Props) {
  const color = BELT_COLORS[belt]
  const id = `belt-${belt}`

  // Canvas
  const w = 220
  const h = 52

  // Belt body — occupies middle 58% vertically (thinner), rounded ends only
  const by = h * 0.21
  const bh = h * 0.58
  const r = bh * 0.18   // only left/right ends rounded

  // Knot — same vertical bounds, square edges, sits at right side
  const kw = bh * 1.05
  const kx = w * 0.78
  const ky = by
  const kh = bh

  // White stripe inside knot — nudged further right
  const sw = Math.max(3, kw * 0.14)
  const sx = kx + kw * 0.66

  // Stitch lines: horizontal rows across belt body
  const stitchCount = 7
  const stitchGap = bh / (stitchCount + 1)

  const noiseSeed = belt === 'white' ? 2 : belt === 'blue' ? 5 : belt === 'purple' ? 8 : belt === 'brown' ? 11 : 14

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-noise`} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.15" numOctaves="3" seed={noiseSeed} result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="greyNoise" />
          <feBlend in="SourceGraphic" in2="greyNoise" mode="overlay" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>

        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="22%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="78%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </linearGradient>

        <linearGradient id={`${id}-knot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </linearGradient>

        <clipPath id={`${id}-clip`}>
          <rect x={0} y={by} width={w} height={bh} rx={r} />
        </clipPath>

        <clipPath id={`${id}-knotclip`}>
          <rect x={kx} y={ky} width={kw} height={kh} />
        </clipPath>
      </defs>

      {/* Belt body base colour */}
      <rect x={0} y={by} width={w} height={bh} rx={r} fill={color} />

      {/* Stitch lines */}
      <g clipPath={`url(#${id}-clip)`} opacity={belt === 'white' ? 0.18 : 0.13}>
        {Array.from({ length: stitchCount }).map((_, i) => {
          const y = by + stitchGap * (i + 1)
          return (
            <line key={i} x1={0} y1={y} x2={w} y2={y}
              stroke={belt === 'white' ? '#555' : belt === 'black' ? '#666' : 'rgba(0,0,0,0.6)'}
              strokeWidth={0.6} strokeDasharray="3 3" />
          )
        })}
      </g>

      {/* Fabric noise */}
      <rect x={0} y={by} width={w} height={bh} rx={r} fill={color} filter={`url(#${id}-noise)`} opacity={0.22} />

      {/* Centre-highlight + edge-dark shading */}
      <rect x={0} y={by} width={w} height={bh} rx={r} fill={`url(#${id}-body)`} />

      {/* Top & bottom edge shadow lines */}
      <rect x={r} y={by} width={w - r * 2} height={1.2} rx={0.6}
        fill={belt === 'white' ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.45)'} />
      <rect x={r} y={by + bh - 1.2} width={w - r * 2} height={1.2} rx={0.6}
        fill={belt === 'white' ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.55)'} />

      {/* Knot — sharp rectangle */}
      <rect x={kx} y={ky} width={kw} height={kh} fill="#0d0d0d" />

      {/* Knot stitching rows */}
      <g clipPath={`url(#${id}-knotclip)`} opacity={0.35}>
        {Array.from({ length: 5 }).map((_, i) => {
          const y = ky + (kh / 6) * (i + 1)
          return (
            <line key={i} x1={kx} y1={y} x2={kx + kw} y2={y}
              stroke="#888" strokeWidth={0.5} strokeDasharray="2 2" />
          )
        })}
      </g>

      {/* Knot shading gradient */}
      <rect x={kx} y={ky} width={kw} height={kh} fill={`url(#${id}-knot)`} />

      {/* Knot left edge fold shadow */}
      <rect x={kx} y={ky} width={3} height={kh} fill="rgba(0,0,0,0.4)" />
      {/* Knot right edge highlight */}
      <rect x={kx + kw - 2} y={ky} width={2} height={kh} fill="rgba(255,255,255,0.05)" />

      {/* White stripe inside knot */}
      <rect x={sx} y={ky + kh * 0.1} width={sw} height={kh * 0.8} rx={1} fill="white" opacity={0.9} />
      {/* Stripe inner shading */}
      <rect x={sx + sw * 0.5} y={ky + kh * 0.1} width={sw * 0.5} height={kh * 0.8} rx={1} fill="rgba(0,0,0,0.15)" />

      {belt === 'white' && (
        <rect x={0.5} y={by + 0.5} width={w - 1} height={bh - 1} rx={r}
          fill="none" stroke="rgba(100,100,100,0.4)" strokeWidth={1} />
      )}
      {belt === 'black' && (
        <rect x={0.5} y={by + 0.5} width={w - 1} height={bh - 1} rx={r}
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      )}
    </svg>
  )
}
