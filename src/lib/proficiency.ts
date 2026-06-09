import type { BeltLevel } from '../data/positions'
import { positions } from '../data/positions'
import { techniques } from '../data/techniques'
import { BELT_ORDER, CATEGORY_LABELS } from '../data/types'
import type { Category, Technique } from '../data/types'

export interface PositionProficiency {
  positionId: string
  positionName: string
  ratio: number
  belt: BeltLevel
  beltPct: number | null // % through current belt based on that belt's techniques, null if black
  learned: number
  total: number
  started: boolean
}

export interface CategoryProficiency {
  category: Category
  categoryLabel: string
  ratio: number
  belt: BeltLevel
  beltPct: number | null
  learned: number
  total: number
  started: boolean
}

export interface OverallProficiency {
  ratio: number
  belt: BeltLevel
  beltPct: number | null
  isBlack: boolean
  positions: PositionProficiency[]
  categories: CategoryProficiency[]
  startedCount: number
}

// Thresholds set so that completing all techniques up to each belt lands you
// at ~95% through that belt, leaving the last 5% to cross into the next.
// Natural ratios: white=0.209, blue=0.540, purple=0.920, brown=0.940
// Thresholds are set slightly below those natural values so 100% of a belt
// puts you at ~95% rather than rolling over into the next belt at 0%.
// Natural ratios when all techniques up to each belt are learned:
// white=0.209, blue=0.540, purple=0.920, brown=0.940
// Each threshold is set so that completing a full belt lands at ~90-95%,
// and only the first technique of the next belt tips you over.
// Thresholds calibrated to the actual ratio values the algorithm produces.
// Each belt tip-point is set just below the natural boundary so completing
// all techniques in a belt lands at ~90-95% of that belt.
// Natural ratios: white=0.209, blue=0.540, purple=0.920, brown=0.940
const BELT_THRESHOLDS: Record<Exclude<BeltLevel, 'black'>, [number, number]> = {
  white:  [0,     0.25],
  blue:   [0.25,  0.57],
  purple: [0.57,  0.935],
  brown:  [0.935, 1.0],
}

export function ratioToBelt(ratio: number, isBlack = false): BeltLevel {
  if (isBlack) return 'black'
  if (ratio >= 0.935) return 'brown'
  if (ratio >= 0.57)  return 'purple'
  if (ratio >= 0.22)  return 'blue'
  return 'white'
}

// Returns 0..1 progress through the current belt based on position within
// that belt's ratio range. Returns null at black belt.
export function progressWithinBelt(ratio: number, isBlack = false): number | null {
  if (isBlack) return null
  const belt = ratioToBelt(ratio)
  const [floor, ceiling] = BELT_THRESHOLDS[belt as Exclude<BeltLevel, 'black'>]
  return Math.max(0, Math.min((ratio - floor) / (ceiling - floor), 1.0))
}

// Core algorithm: flat technique count with a foundation cap.
//
// Every technique counts equally — learned / total gives the raw score.
// A foundation cap prevents cherry-picking advanced techniques from pushing
// the estimate too high without solid white belt coverage:
//   cap = min(1.0, whiteFill + 0.4)
//   0% white → max 0.4 (blue ceiling)
//   50% white → max 0.9
//   100% white → no cap
//
// The cap is a ceiling only, so learning any technique always raises the score.
// Learning all techniques always gives 1.0.
function calcBeltPct(ratio: number, isBlack: boolean): number | null {
  return progressWithinBelt(ratio, isBlack)
}

function tieredRatio(techs: Technique[], learned: Set<string>): {
  ratio: number
  isBlack: boolean
  beltPct: number | null
  learnedCount: number
  total: number
} {
  const learnedTechs = techs.filter((t) => learned.has(t.id))
  if (techs.length === 0) return { ratio: 0, isBlack: false, beltPct: 0, learnedCount: 0, total: 0 }
  if (learnedTechs.length === 0) return { ratio: 0, isBlack: false, beltPct: 0, learnedCount: 0, total: techs.length }

  if (learnedTechs.length === techs.length) {
    return { ratio: 1.0, isBlack: true, beltPct: null, learnedCount: learnedTechs.length, total: techs.length }
  }


  const tierFill: Partial<Record<BeltLevel, number>> = {}
  for (const belt of BELT_ORDER) {
    const tierTechs = techs.filter((t) => t.beltLevel === belt)
    if (tierTechs.length === 0) continue
    tierFill[belt] = tierTechs.filter((t) => learned.has(t.id)).length / tierTechs.length
  }
  const presentTiers = BELT_ORDER.filter((b) => tierFill[b] !== undefined)

  const tierScale: Partial<Record<BeltLevel, number>> = {}
  for (let i = 0; i < presentTiers.length; i++) {
    if (i === 0) {
      tierScale[presentTiers[i]] = 1.0
    } else {
      const prevFill = tierFill[presentTiers[i - 1]]!
      tierScale[presentTiers[i]] = 0.4 + 0.6 * prevFill
    }
  }

  const weightedLearned = learnedTechs.reduce((s, t) => s + (tierScale[t.beltLevel] ?? 1.0), 0)
  const weightedTotal = techs.reduce((s, t) => s + (tierScale[t.beltLevel] ?? 1.0), 0)
  const ratio = weightedLearned / weightedTotal

  return {
    ratio,
    isBlack: false,
    beltPct: calcBeltPct(ratio, false),
    learnedCount: learnedTechs.length,
    total: techs.length,
  }
}

const techsByPosition = (() => {
  const map: Record<string, Technique[]> = {}
  for (const t of techniques) {
    for (const p of t.positions) {
      ;(map[p] ??= []).push(t)
    }
  }
  return map
})()

const techsByCategory = (() => {
  const map: Record<string, Technique[]> = {}
  for (const t of techniques) {
    ;(map[t.category] ??= []).push(t)
  }
  return map
})()

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export function computeProficiency(learned: Set<string>): OverallProficiency {
  const positionResults: PositionProficiency[] = positions.map((pos) => {
    const { ratio, isBlack, beltPct, learnedCount, total } = tieredRatio(techsByPosition[pos.id] ?? [], learned)
    const belt = ratioToBelt(ratio, isBlack)
    return {
      positionId: pos.id,
      positionName: pos.name,
      ratio,
      belt,
      beltPct,
      learned: learnedCount,
      total,
      started: learnedCount > 0,
    }
  })

  const categoryResults: CategoryProficiency[] = ALL_CATEGORIES.map((cat) => {
    const { ratio, isBlack, beltPct, learnedCount, total } = tieredRatio(techsByCategory[cat] ?? [], learned)
    const belt = ratioToBelt(ratio, isBlack)
    return {
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat],
      ratio,
      belt,
      beltPct,
      learned: learnedCount,
      total,
      started: learnedCount > 0,
    }
  })

  const started = positionResults.filter((p) => p.started)
  const { ratio: overallRatio, isBlack: overallIsBlack, beltPct: overallBeltPct } = tieredRatio(techniques, learned)

  return {
    ratio: overallRatio,
    belt: ratioToBelt(overallRatio, overallIsBlack),
    beltPct: overallBeltPct,
    isBlack: overallIsBlack,
    positions: positionResults,
    categories: categoryResults,
    startedCount: started.length,
  }
}

export { BELT_ORDER }
