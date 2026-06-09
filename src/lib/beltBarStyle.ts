import { BELT_COLORS } from '../data/types'
import type { BeltLevel } from '../data/positions'
import type { CSSProperties } from 'react'

// Tiling belt pattern for position/category progress bars — repeating knots across the fill.
export function beltBarStyle(belt: BeltLevel, pct: number): CSSProperties {
  const color = BELT_COLORS[belt]
  const h = 10
  const w = 28  // tile width — knot repeats every 28px

  const kw = 7
  const kx = 18

  const sx = kx + kw * 0.55
  const sw = Math.max(1, kw * 0.18)

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<rect x="0" y="1.5" width="${w}" height="${h - 3}" fill="${color}"/>`,
    `<rect x="${kx}" y="0" width="${kw}" height="${h}" rx="1.5" fill="#111"/>`,
    `<rect x="${sx}" y="${h * 0.18}" width="${sw}" height="${h * 0.64}" rx="0.5" fill="white" opacity="0.85"/>`,
    `</svg>`,
  ].join('')

  return {
    width: belt === 'black' ? '100%' : `${pct * 100}%`,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `${w}px ${h}px`,
    backgroundColor: 'transparent',
    transition: 'width 0.3s ease',
    ...(belt === 'black' ? { boxShadow: 'inset 0 0 0 2px #cbd5e1' } : {}),
  }
}

// Single-knot belt bar for the overall progress bar — solid fill, one knot at the right edge.
export function beltBarStyleSingle(belt: BeltLevel, pct: number): CSSProperties {
  const color = BELT_COLORS[belt]
  const h = 10
  // Use a wide canvas so the knot sits at the right end — 200px wide, knot near right
  const w = 200
  const kw = 16
  const kx = w - kw - 10

  const sx = kx + kw * 0.55
  const sw = Math.max(1.5, kw * 0.18)

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<rect x="0" y="1.5" width="${w}" height="${h - 3}" fill="${color}"/>`,
    `<rect x="${kx}" y="0" width="${kw}" height="${h}" rx="1.5" fill="#111"/>`,
    `<rect x="${sx}" y="${h * 0.15}" width="${sw}" height="${h * 0.7}" rx="0.5" fill="white" opacity="0.85"/>`,
    `</svg>`,
  ].join('')

  return {
    width: belt === 'black' ? '100%' : `${pct * 100}%`,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundColor: 'transparent',
    transition: 'width 0.3s ease',
    ...(belt === 'black' ? { boxShadow: 'inset 0 0 0 1.5px #8d97a3c8' } : {}),
  }
}
