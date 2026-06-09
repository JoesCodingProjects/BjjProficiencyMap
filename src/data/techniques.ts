import type { Technique } from './types'

// Seed dataset — placeholder until the research agent's verified dataset lands.
// The research agent returns a JSON array matching the Technique schema; paste it
// into techniques.json and this file will load from there.
import raw from './techniques.json'

export const techniques: Technique[] = raw as Technique[]
