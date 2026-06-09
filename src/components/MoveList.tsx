import { useRef, useState } from 'react'
import type { BeltLevel } from '../data/positions'
import type { Technique } from '../data/types'
import { BeltIcon } from './BeltIcon'
import { BELT_COLORS, BELT_ORDER } from '../data/types'
import { positions } from '../data/positions'
import { CATEGORY_VISUAL } from '../lib/visuals'
import { TechniqueModal } from './TechniqueModal'

const positionName = (id: string) => positions.find((p) => p.id === id)?.name ?? id

interface Props {
  techniques: Technique[]
  learned: Set<string>
  watchlist: Set<string>
  notes: Record<string, string>
  onToggleLearned: (id: string) => void
  onToggleWatchlist: (id: string) => void
  onSetNote: (id: string, text: string) => void
  onMarkAll: (ids: string[]) => void
  onUnmarkAll: (ids: string[]) => void
  selectedPositionName: string | null
  mapExpanded: boolean
  onShowMap: () => void
  onHideMap: () => void
}

export function MoveList({
  techniques,
  learned,
  watchlist,
  notes,
  onToggleLearned,
  onToggleWatchlist,
  onSetNote,
  onMarkAll,
  onUnmarkAll,
  selectedPositionName,
  mapExpanded,
  onShowMap,
  onHideMap,
}: Props) {
  const [modalTechnique, setModalTechnique] = useState<Technique | null>(null)
  const [modalAutoPlay, setModalAutoPlay] = useState(false)

  return (
    <>
      <div className="move-list">
        <h2 className="move-list-title">
          {selectedPositionName ? `Moves from ${selectedPositionName}` : 'All matching techniques'}
          <span className="count-badge">{techniques.length}</span>
          {mapExpanded && (
            <button className="map-toggle-inline" onClick={onHideMap}>
              ▲ Hide map
            </button>
          )}
        </h2>

        {!mapExpanded && (
          <button className="show-map-nudge" onClick={onShowMap}>
            ▼ Show map to select / switch position
          </button>
        )}

        {techniques.length > 0 && (
          <BulkMarkRow
            techniques={techniques}
            learned={learned}
            onMarkAll={onMarkAll}
            onUnmarkAll={onUnmarkAll}
          />
        )}

        {techniques.length === 0 && (
          <p className="empty">No techniques match these filters. Try widening them.</p>
        )}

        <div className="cards">
          {techniques.map((t) => (
            <TechniqueCard
              key={t.id}
              technique={t}
              isLearned={learned.has(t.id)}
              isWatchlisted={watchlist.has(t.id)}
              note={notes[t.id] ?? ''}
              onToggle={() => onToggleLearned(t.id)}
              onToggleWatchlist={() => onToggleWatchlist(t.id)}
              onSetNote={(text) => onSetNote(t.id, text)}
              onOpenModal={() => { setModalAutoPlay(false); setModalTechnique(t) }}
              onOpenModalWithVideo={() => { setModalAutoPlay(true); setModalTechnique(t) }}
            />
          ))}
        </div>
      </div>

      {modalTechnique && (
        <TechniqueModal
          technique={modalTechnique}
          isLearned={learned.has(modalTechnique.id)}
          isWatchlisted={watchlist.has(modalTechnique.id)}
          note={notes[modalTechnique.id] ?? ''}
          autoPlayVideo={modalAutoPlay}
          onToggleLearned={() => onToggleLearned(modalTechnique.id)}
          onToggleWatchlist={() => onToggleWatchlist(modalTechnique.id)}
          onSetNote={(text) => onSetNote(modalTechnique.id, text)}
          onClose={() => { setModalTechnique(null); setModalAutoPlay(false) }}
        />
      )}
    </>
  )
}

function TechniqueCard({
  technique: t,
  isLearned,
  isWatchlisted,
  note,
  onToggle,
  onToggleWatchlist,
  onSetNote,
  onOpenModal,
  onOpenModalWithVideo,
}: {
  technique: Technique
  isLearned: boolean
  isWatchlisted: boolean
  note: string
  onToggle: () => void
  onToggleWatchlist: () => void
  onSetNote: (text: string) => void
  onOpenModal: () => void
  onOpenModalWithVideo: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const visual = CATEGORY_VISUAL[t.category]

  return (
    <div className={`card ${isLearned ? 'learned' : ''} ${isWatchlisted ? 'watchlisted' : ''}`}>
      {/* Top section — click opens modal */}
      <div
        className="card-visual card-visual-clickable"
        style={{ background: `linear-gradient(135deg, ${visual.color}33, #0b1220)` }}
        onClick={onOpenModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpenModal()}
      >
        <span className="card-visual-glyph">{visual.glyph}</span>
        <span className="card-visual-label" style={{ color: visual.color }}>{visual.label}</span>
        <button
          className="card-visual-play"
          onClick={(e) => { e.stopPropagation(); onOpenModalWithVideo() }}
        >
          ▶ Video
        </button>
      </div>

      <div className="card-body">
        {/* Title/desc/meta — click opens modal */}
        <div className="card-body-top" onClick={onOpenModal} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenModal()}>
          <div className="card-head">
            <BeltIcon belt={t.beltLevel} size={10} />
            <h3 className="card-title">{t.name}</h3>
            <span className={`type-tag ${t.moveType}`}>{t.moveType === 'offensive' ? 'Offense' : 'Defense'}</span>
            {t.giType === 'gi' && <span className="type-tag gi-tag">🥋 Gi</span>}
          </div>

          <p className="card-desc">{t.description}</p>

          <div className="card-meta">
            <span className="meta-pill">{t.positions.map(positionName).join(', ')}</span>
            <span className="meta-pill">difficulty {t.difficulty}/5</span>
          </div>
        </div>

        <div className="card-actions">
          {confirming ? (
            <div className="card-confirm" onClick={(e) => e.stopPropagation()}>
              <button className="card-confirm-yes" onClick={(e) => { e.stopPropagation(); onToggle(); setConfirming(false) }}>
                {isLearned ? 'Mark as not learned' : 'Confirm'}
              </button>
              <button className="card-confirm-no" onClick={(e) => { e.stopPropagation(); setConfirming(false) }}>
                Cancel
              </button>
            </div>
          ) : (
            <label className="learned-toggle" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isLearned}
                onChange={() => setConfirming(true)}
              />
              <span className={isLearned ? 'is-learned' : ''}>
                {isLearned ? 'Learned' : 'Mark as learned'}
              </span>
            </label>
          )}

          <div className="card-action-btns" onClick={(e) => e.stopPropagation()}>
            {!isLearned && (
              <button
                className={`card-icon-btn ${isWatchlisted ? 'watchlisted' : ''}`}
                onClick={onToggleWatchlist}
              >
                {isWatchlisted ? '★ In Progress ×' : '☆ In Progress'}
              </button>
            )}
            <button
              className={`card-icon-btn ${note ? 'has-note' : ''}`}
              onClick={() => setShowNotes((v) => !v)}
            >
              ✎ Notes {showNotes ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {showNotes && (
        <div className="card-notes" onClick={(e) => e.stopPropagation()}>
          <div className="card-notes-wrap">
            <textarea
              ref={noteRef}
              className="card-notes-input"
              placeholder="Add your notes, cues, or reminders…"
              value={note}
              onChange={(e) => onSetNote(e.target.value)}
              rows={3}
            />
            <button className="card-notes-done" onClick={() => setShowNotes(false)}>
              ✓ Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function BulkMarkRow({
  techniques,
  learned,
  onMarkAll,
  onUnmarkAll,
}: {
  techniques: Technique[]
  learned: Set<string>
  onMarkAll: (ids: string[]) => void
  onUnmarkAll: (ids: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  if (techniques.length === 0) return null

  const beltGroups: Partial<Record<BeltLevel, Technique[]>> = {}
  for (const t of techniques) {
    ;(beltGroups[t.beltLevel] ??= []).push(t)
  }

  return (
    <div className="bulk-mark-row bulk-mark-row-full">
      <button className="bulk-mark-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="bulk-mark-toggle-text">Mark all as learned (by belt)</span>
        <span className="bulk-mark-toggle-icon">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="bulk-mark-belts">
          {BELT_ORDER.map((belt) => {
            const group = beltGroups[belt] ?? []
            const total = group.length
            if (total === 0) return null
            const learnedInBelt = group.filter((t) => learned.has(t.id))
            const unlearned = group.filter((t) => !learned.has(t.id))
            const allDone = unlearned.length === 0
            const isBlack = belt === 'black'
            return (
              <div
                key={belt}
                className={`bulk-belt-btn ${allDone ? 'done' : ''}`}
                style={{
                  borderColor: isBlack ? '#64748b' : BELT_COLORS[belt],
                  background: isBlack ? 'rgba(100,116,139,0.1)' : `${BELT_COLORS[belt]}18`,
                }}
              >
                <BeltIcon belt={belt} size={10} />
                <span className="bulk-belt-name" style={{ color: isBlack ? '#e2e8f0' : BELT_COLORS[belt] }}>{belt}</span>
                <span className="bulk-belt-fraction">{learnedInBelt.length}/{total}</span>
                <button
                  className="bulk-belt-action-tag"
                  style={allDone
                    ? { background: 'rgba(100,116,139,0.3)', color: '#94a3b8', borderColor: '#475569' }
                    : { background: isBlack ? 'rgba(100,116,139,0.3)' : `${BELT_COLORS[belt]}33`, color: isBlack ? '#e2e8f0' : BELT_COLORS[belt], borderColor: isBlack ? '#64748b' : `${BELT_COLORS[belt]}88` }
                  }
                  onClick={() => allDone
                    ? onUnmarkAll(learnedInBelt.map((t) => t.id))
                    : onMarkAll(unlearned.map((t) => t.id))
                  }
                >
                  {allDone ? 'Undo' : 'Mark all'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
