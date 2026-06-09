import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { BeltLevel } from '../data/positions'
import { BELT_COLORS } from '../data/types'
import { BeltCardSVG } from './BeltCardSVG'

interface Props {
  belt: BeltLevel
  onClose: () => void
}

const BELT_MESSAGES: Record<BeltLevel, string> = {
  white:  'Welcome to your journey.',
  blue:   "Blue belt — you've built your foundation. Keep rolling!",
  purple: "Purple belt — you're a serious grappler now.",
  brown:  "Brown belt — you're elite. Black is within reach.",
  black:  'Black belt. A lifetime of dedication. Oss.',
}

export function BeltPromotion({ belt, onClose }: Props) {
  useEffect(() => {
    const color = belt === 'white' ? '#d4d4d8' : BELT_COLORS[belt]

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: [color, '#2d7dd2', '#ffffff'],
      startVelocity: 45,
      gravity: 0.9,
    })

    const t1 = setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: [color, '#2d7dd2'] })
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: [color, '#2d7dd2'] })
    }, 250)

    const t2 = setTimeout(() => {
      confetti({ particleCount: 40, spread: 100, origin: { y: 0.4 }, colors: [color, '#ffffff'], startVelocity: 30 })
    }, 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [belt])

  const beltColor = BELT_COLORS[belt]
  const textColor = belt === 'white' ? '#111' : '#fff'

  return (
    <div className="modal-overlay promo-overlay" onClick={onClose}>
      <div
        className="modal promo-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="promo-belt-visual"
          style={{
            background: belt === 'white'
              ? 'linear-gradient(160deg, #2a3444 0%, #1a2232 100%)'
              : belt === 'black'
              ? 'linear-gradient(160deg, #2a2a2a 0%, #111 100%)'
              : `linear-gradient(160deg, ${beltColor}33 0%, ${beltColor}0d 100%)`,
          }}
        >
          <BeltCardSVG belt={belt} />
        </div>

        <div className="promo-body">
          <p className="promo-eyebrow">Congratulations!</p>
          <h2 className="promo-title">
            <span
              className="promo-belt-pill"
              style={{ background: beltColor, color: textColor, border: belt === 'black' ? '2px solid #64748b' : undefined }}
            >
              {belt}
            </span>
            Belt
          </h2>
          <p className="promo-message">{BELT_MESSAGES[belt]}</p>
          <p className="promo-sub">Your new belt has been saved. Now go update your estimated levels to match!</p>
        </div>

        <button className="promo-close" onClick={onClose}>
          OSS!
        </button>
      </div>
    </div>
  )
}
