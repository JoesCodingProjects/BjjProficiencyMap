import { BELT_COLORS } from '../data/types'
import type { BeltLevel } from '../data/positions'

interface Props {
  belt: BeltLevel
  size?: number
}

export function BeltIcon({ belt, size = 18 }: Props) {
  const color = BELT_COLORS[belt]
  const w = size * 3.8
  const h = size
  const kw = size * 0.65   // knot width
  const kx = w * 0.72      // knot starts at 72% across (right side)
  const r = h * 0.18

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Belt body — full width coloured bar */}
      <rect x={0} y={h * 0.15} width={w} height={h * 0.7} rx={r} fill={color} />
      {/* Black knot block — sits on top, right side */}
      <rect x={kx} y={0} width={kw} height={h} rx={r} fill="#111" />
      {/* White stripe — vertical, inside the knot, right portion */}
      <rect
        x={kx + kw * 0.55}
        y={h * 0.15}
        width={Math.max(1.5, kw * 0.16)}
        height={h * 0.7}
        rx={1}
        fill="white"
        opacity={0.88}
      />
      {/* White belt outline so it reads on dark bg */}
      {belt === 'white' && (
        <rect x={0} y={h * 0.15} width={w} height={h * 0.7} rx={r} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
      )}
      {/* Black belt — white border so it reads on dark backgrounds */}
      {belt === 'black' && (
        <rect x={0} y={h * 0.15} width={w} height={h * 0.7} rx={r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
      )}
    </svg>
  )
}
