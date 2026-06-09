import { useState } from 'react'
import type { Technique } from '../data/types'
import { CATEGORY_VISUAL } from '../lib/visuals'
import { TechniqueModal } from './TechniqueModal'
import { positions } from '../data/positions'

const positionName = (id: string) => positions.find((p) => p.id === id)?.name ?? id

interface Props {
  techniques: Technique[]
  learned: Set<string>
  watchlist: Set<string>
  notes: Record<string, string>
  onToggleLearned: (id: string) => void
  onToggleWatchlist: (id: string) => void
  onSetNote: (id: string, text: string) => void
  onSeeAll: () => void
}

export function TodaysDrills({ techniques, learned, watchlist, notes, onToggleLearned, onToggleWatchlist, onSetNote, onSeeAll }: Props) {
  const [modalTechnique, setModalTechnique] = useState<Technique | null>(null)

  if (techniques.length === 0) return null

  return (
    <>
      <div className="drills-section">
        <div className="drills-header">
          <span className="drills-title">
            <span className="drills-star">★</span>
            In Progress
            <span className="drills-count">{techniques.length}</span>
          </span>
          <button className="drills-see-all" onClick={onSeeAll}>
            See all →
          </button>
        </div>

        <div className="drills-scroll">
          {techniques.map((t) => {
            const visual = CATEGORY_VISUAL[t.category]
            const hasNote = !!notes[t.id]
            return (
              <div
                key={t.id}
                className="drill-pill"
                onClick={() => setModalTechnique(t)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setModalTechnique(t)}
              >
                <div className="drill-pill-top">
                  <span className="drill-pill-glyph">{visual.glyph}</span>
                </div>
                <div className="drill-pill-body">
                  <span className="drill-pill-name">{t.name}</span>
                  <span className="drill-pill-pos">
                    {t.positions.map(positionName).join(', ')}
                  </span>
                  {hasNote && (
                    <span className="drill-pill-note-dot" title="Has notes">✎</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modalTechnique && (
        <TechniqueModal
          technique={modalTechnique}
          isLearned={learned.has(modalTechnique.id)}
          isWatchlisted={watchlist.has(modalTechnique.id)}
          note={notes[modalTechnique.id] ?? ''}
          onToggleLearned={() => onToggleLearned(modalTechnique.id)}
          onToggleWatchlist={() => onToggleWatchlist(modalTechnique.id)}
          onSetNote={(text) => onSetNote(modalTechnique.id, text)}
          onClose={() => setModalTechnique(null)}
        />
      )}
    </>
  )
}
