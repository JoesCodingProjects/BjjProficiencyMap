import type { Category, Technique } from '../data/types'

export const CATEGORY_VISUAL: Record<Category, { glyph: string; label: string; color: string }> = {
  escape:               { glyph: '🏃', label: 'Escape',              color: '#06b6d4' },
  guard:                { glyph: '🛡️', label: 'Guard',               color: '#64748b' },
  transition:           { glyph: '↔️', label: 'Transition',          color: '#8b5cf6' },
  pass:                 { glyph: '➡️', label: 'Pass',                color: '#0ea5e9' },
  sweep:                { glyph: '🔄', label: 'Sweep',               color: '#22c55e' },
  submission_choke:     { glyph: '🫁', label: 'Submission — Choke',       color: '#ef4444' },
  submission_upper_body:{ glyph: '💪', label: 'Submission — Upper Body',  color: '#2d7dd2' },
  submission_lower_body:{ glyph: '🦵', label: 'Submission — Lower Body',  color: '#a855f7' },
}

export function youtubeSearchUrl(t: Technique): string {
  const query = `${t.name} bjj technique`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

export function watchUrl(t: Technique): string {
  return t.videoUrl && t.videoUrl.trim().length > 0 ? t.videoUrl : youtubeSearchUrl(t)
}

export function hasCuratedVideo(t: Technique): boolean {
  return !!t.videoUrl && t.videoUrl.trim().length > 0
}
