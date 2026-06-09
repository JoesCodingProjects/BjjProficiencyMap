import { useRef, useState } from 'react'
import type { Technique } from '../data/types'
import { CATEGORY_VISUAL } from '../lib/visuals'
import { BeltIcon } from './BeltIcon'
import { positions } from '../data/positions'

const positionName = (id: string) => positions.find((p) => p.id === id)?.name ?? id

interface Props {
  technique: Technique
  isLearned: boolean
  isWatchlisted: boolean
  note: string
  autoPlayVideo?: boolean
  onToggleLearned: () => void
  onToggleWatchlist: () => void
  onSetNote: (text: string) => void
  onClose: () => void
}


export function TechniqueModal({
  technique: t,
  isLearned,
  isWatchlisted,
  note,
  autoPlayVideo = false,
  onToggleLearned,
  onToggleWatchlist,
  onSetNote,
  onClose,
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showVideo, setShowVideo] = useState(autoPlayVideo)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const visual = CATEGORY_VISUAL[t.category]
  const embedUrl = t.videoUrl || null
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(t.name + ' bjj technique')}`

  function handleConfirm() {
    onToggleLearned()
    setConfirming(false)
  }

  return (
    <div className="modal-overlay drill-modal-overlay" onClick={onClose}>
      <div className="modal drill-modal" onClick={(e) => e.stopPropagation()}>

        {showVideo ? (
          <div className="drill-modal-video">
            <iframe
              src={embedUrl ?? ''}
              className="drill-modal-iframe"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={t.name}
            />
            <div className="drill-modal-video-bar">
              <button className="drill-modal-video-close" onClick={() => setShowVideo(false)}>✕ Close</button>
              <a
                className="drill-modal-video-fallback"
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
              >
                Video not working?🚩
              </a>
            </div>
          </div>
        ) : (
          <div
            className="drill-modal-visual"
            style={{ background: `linear-gradient(135deg, ${visual.color}33, #0b1220)` }}
          >
            <span className="drill-modal-glyph">{visual.glyph}</span>
            <span className="drill-modal-visual-label" style={{ color: visual.color }}>{visual.label}</span>
            <button
              className="card-visual-play"
              onClick={(e) => { e.stopPropagation(); setShowVideo(true) }}
            >
              ▶ Video
            </button>
            <button className="drill-modal-close" onClick={onClose}>✕</button>
          </div>
        )}

        <div className="drill-modal-body">
          <div className="card-head" style={{ marginBottom: 8 }}>
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

          <button
            className={`card-icon-btn modal-notes-toggle ${note ? 'has-note' : ''}`}
            style={{ marginBottom: 8, width: '100%', justifyContent: 'center' }}
            onClick={() => {
              setShowNotes((v) => !v)
            }}
          >
            ✎ Notes {showNotes ? '▲' : '▼'}
          </button>

          {showNotes && (
            <div className="card-notes-wrap" style={{ marginBottom: 12 }}>
              <textarea
                ref={noteRef}
                className="card-notes-input"
                placeholder="Add your notes, cues, or reminders…"
                value={note}
                onChange={(e) => onSetNote(e.target.value)}
                rows={3}
              />
              <button className="card-notes-done" onClick={() => { noteRef.current?.blur(); setShowNotes(false) }}>
                ✓ Save
              </button>
            </div>
          )}

          <div className="drill-modal-actions">
            {!isLearned && (
              <button
                className={`card-icon-btn ${isWatchlisted ? 'watchlisted' : ''}`}
                onClick={onToggleWatchlist}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isWatchlisted ? '★ In Progress ×' : '☆ In Progress'}
              </button>
            )}

            {confirming ? (
              <div className="card-confirm" style={{ flex: 1 }}>
                <button
                  className="card-confirm-yes"
                  style={{ flex: 1 }}
                  onClick={handleConfirm}
                >
                  {isLearned ? 'Unmark learned' : 'Confirm learned'}
                </button>
                <button className="card-confirm-no" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <label
                className="learned-toggle"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" checked={isLearned} onChange={() => setConfirming(true)} />
                <span className={isLearned ? 'is-learned' : ''}>
                  {isLearned ? 'Learned' : 'Mark as learned'}
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
