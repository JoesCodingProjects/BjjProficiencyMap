// BJJ position hierarchy: nodes for the map + transitions (edges) between them.

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black'

export interface Position {
  id: string
  name: string
  description: string
  x: number
  y: number
  tier: 'neutral' | 'advantage' | 'disadvantage'
}

export interface Transition {
  from: string
  to: string
}

export const positions: Position[] = [
  {
    id: 'standing',
    name: 'Standing',
    description: 'Neutral starting position. Takedowns, guard pulls, and throws originate here.',
    x: 200,
    y: 10,
    tier: 'neutral',
  },
  {
    id: 'open_guard',
    name: 'Open Guard',
    description: 'On your back/seated with legs free to control distance. Spider, de la Riva, butterfly and more.',
    x: 10,
    y: 100,
    tier: 'advantage',
  },
  {
    id: 'closed_guard',
    name: 'Closed Guard',
    description: 'On your back with legs locked around the opponent. A versatile attacking guard.',
    x: 200,
    y: 100,
    tier: 'advantage',
  },
  {
    id: 'half_guard',
    name: 'Half Guard',
    description: 'You trap one of the opponent legs between yours. Sweeps and back-takes live here.',
    x: 390,
    y: 100,
    tier: 'advantage',
  },
  {
    id: 'north_south',
    name: 'North-South',
    description: 'Opponent lies chest-to-chest perpendicular across your head. A transitional control position used to set up kimuras, chokes, and positional advances.',
    x: 10,
    y: 210,
    tier: 'advantage',
  },
  {
    id: 'side_control',
    name: 'Side Control',
    description: 'Perpendicular chest-to-chest control. Strong pin with many submissions from the top; escapes and guard recovery from the bottom.',
    x: 200,
    y: 210,
    tier: 'advantage',
  },
  {
    id: 'turtle',
    name: 'Turtle',
    description: 'Defensive ball position on knees and elbows. Defend the back, look to recover.',
    x: 390,
    y: 210,
    tier: 'neutral',
  },
  {
    id: 'mount',
    name: 'Mount',
    description: 'Sitting on the opponent torso. One of the most dominant top positions.',
    x: 105,
    y: 320,
    tier: 'advantage',
  },
  {
    id: 'back_control',
    name: 'Back Control',
    description: 'Behind the opponent with hooks in. The highest-scoring, most dominant position.',
    x: 295,
    y: 320,
    tier: 'advantage',
  },
]

export const transitions: Transition[] = [
  // From standing
  { from: 'standing', to: 'closed_guard' },
  { from: 'standing', to: 'open_guard' },
  { from: 'standing', to: 'half_guard' },
  { from: 'standing', to: 'side_control' },
  // Back to standing
  { from: 'closed_guard', to: 'standing' },
  { from: 'open_guard', to: 'standing' },
  { from: 'half_guard', to: 'standing' },
  { from: 'turtle', to: 'standing' },
  // Guard transitions
  { from: 'closed_guard', to: 'open_guard' },
  { from: 'open_guard', to: 'closed_guard' },
  { from: 'open_guard', to: 'half_guard' },
  { from: 'half_guard', to: 'open_guard' },
  { from: 'closed_guard', to: 'half_guard' },
  { from: 'half_guard', to: 'closed_guard' },
  // Guard to top positions
  { from: 'closed_guard', to: 'mount' },
  { from: 'closed_guard', to: 'side_control' },
  { from: 'open_guard', to: 'side_control' },
  { from: 'half_guard', to: 'side_control' },
  // Top position transitions
  { from: 'side_control', to: 'mount' },
  { from: 'side_control', to: 'north_south' },
  { from: 'side_control', to: 'half_guard' },
  { from: 'side_control', to: 'back_control' },
  { from: 'north_south', to: 'side_control' },
  { from: 'north_south', to: 'mount' },
  { from: 'mount', to: 'side_control' },
  { from: 'mount', to: 'back_control' },
  // Back control
  { from: 'back_control', to: 'side_control' },
  { from: 'back_control', to: 'turtle' },
  { from: 'half_guard', to: 'back_control' },
  // Turtle
  { from: 'turtle', to: 'back_control' },
  { from: 'turtle', to: 'half_guard' },
  { from: 'half_guard', to: 'turtle' },
  { from: 'turtle', to: 'open_guard' },
  { from: 'side_control', to: 'turtle' },
]
