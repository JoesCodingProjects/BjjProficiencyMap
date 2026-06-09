import type { BeltLevel } from '../data/positions'
import { BELT_COLORS } from '../data/types'

// Nuanced belt labels:
// White 0–50%        → "White"
// White 50%+         → "White & Blue"   (approaching blue, still white belt)
// Blue 0–33%         → "Blue & White"   (early blue, some white belt habits)
// Blue 33%+          → "Blue"
// All other belts    → just the belt name
// Black              → "black belt"

function C({ belt, children }: { belt: BeltLevel; children: string }) {
  const color = belt === 'black' ? '#94a3b8' : belt === 'brown' ? '#c2763a' : BELT_COLORS[belt]
  return <span style={{ color, fontWeight: 700, textTransform: 'capitalize' }}>{children}</span>
}

export function BeltLabel({
  belt,
  beltPct,
  isBlack,
  fontSize = 16,
}: {
  belt: BeltLevel
  beltPct: number | null
  isBlack: boolean
  fontSize?: number
}) {
  if (isBlack) return <C belt="black">black belt</C>

  const pct = beltPct ?? 0

  if (belt === 'white' && pct >= 2 / 3) {
    return (
      <span style={{ fontSize, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        <C belt="blue">Blue</C>
        <span style={{ color: '#475569', fontWeight: 400 }}>&amp;</span>
        <C belt="white">White</C>
      </span>
    )
  }

  if (belt === 'white' && pct >= 1 / 3) {
    return (
      <span style={{ fontSize, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        <C belt="white">White</C>
        <span style={{ color: '#475569', fontWeight: 400 }}>&amp;</span>
        <C belt="blue">Blue</C>
      </span>
    )
  }

  return <C belt={belt}>{belt}</C>
}
