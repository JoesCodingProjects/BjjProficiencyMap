import type { BeltLevel } from './positions'

export type MoveType = 'offensive' | 'defensive'
export type PlayerPosition = 'top' | 'bottom' | 'both'

export type GiType = 'gi' | 'no-gi' | 'both'

export type Category =
  | 'escape'
  | 'guard'
  | 'transition'
  | 'pass'
  | 'sweep'
  | 'submission_choke'
  | 'submission_upper_body'
  | 'submission_lower_body'

export interface Technique {
  id: string
  name: string
  description: string
  positions: string[]
  moveType: MoveType
  playerPosition: PlayerPosition
  category: Category
  beltLevel: BeltLevel
  difficulty: 1 | 2 | 3 | 4 | 5
  giType: GiType
  videoUrl: string
}

export const BELT_ORDER: BeltLevel[] = ['white', 'blue', 'purple', 'brown', 'black']

export const BELT_COLORS: Record<BeltLevel, string> = {
  white: '#d4d4d8',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  brown: '#92400e',
  black: '#18181b',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  escape: 'Escape',
  guard: 'Guard',
  transition: 'Transition',
  pass: 'Pass',
  sweep: 'Sweep',
  submission_choke: 'Submission — Choke',
  submission_upper_body: 'Submission — Upper Body',
  submission_lower_body: 'Submission — Lower Body',
}
