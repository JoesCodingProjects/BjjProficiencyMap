import { useState } from 'react'
import type { BeltLevel } from '../data/positions'
import { positions } from '../data/positions'
import { BELT_COLORS, BELT_ORDER } from '../data/types'
import { BeltIcon } from './BeltIcon'
import { BeltCardSVG } from './BeltCardSVG'

const BELT_DESCRIPTIONS: Record<BeltLevel, string> = {
  white: 'Learning survival, basic escapes, and fundamental positions. The journey starts here.',
  blue: 'Building a core game. Guards, passes, and submissions start to connect into a real system.',
  purple: 'Refined technique and timing. Beginning to teach others and developing a personal style.',
  brown: 'Near-complete understanding of the art. Polishing details and eliminating holes in the game.',
  black: 'Mastery of fundamentals with deep positional knowledge. The learning never stops.',
}

interface Props {
  onComplete: (belt: BeltLevel, startPosition: string | null) => void
  onDismiss?: () => void
  initialBelt?: BeltLevel
}

const ALL_POSITIONS = positions.filter((p) => p.id !== 'standing')

export function OnboardingModal({ onComplete, onDismiss, initialBelt }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedBelt, setSelectedBelt] = useState<BeltLevel | null>(initialBelt ?? null)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const isChanging = !!onDismiss

  function handleStart() {
    if (!selectedBelt) return
    onComplete(selectedBelt, selectedPosition)
  }

  const beltColor = selectedBelt ? BELT_COLORS[selectedBelt] : '#2d7dd2'
  const beltTextColor = selectedBelt === 'white' ? '#111' : '#fff'
  const beltBorder = selectedBelt === 'black' ? '2px solid #e2e8f0' : undefined

  return (
    <div className="modal-overlay onboarding-overlay">
      <div className="modal onboarding-modal" role="dialog" aria-modal="true">

        <div className="onboarding-brand">
          <img src="/logo.png" alt="" className="onboarding-brand-logo" />
          <div className="onboarding-brand-text">
            <span className="onboarding-brand-title">BJJ PROFICIENCY TRACKER</span>
          </div>
        </div>

        {/* ── Step 1: Belt selection ── */}
        {step === 1 && (
          <>
            <div className="onboarding-header">
              {isChanging ? (
                <p className="onboarding-subtitle">Select your current real rank.</p>
              ) : (
                <p className="onboarding-subtitle">Your personal BJJ progress and technique tracker</p>
              )}
            </div>

            <div className="onboarding-section">
              <h3 className="onboarding-section-label">
                {isChanging ? 'Change your belt' : "What's your current belt?"}
              </h3>
              <p className="onboarding-hint">Select your real rank — the app uses this to show how your knowledge compares to your estimated level.</p>
              <div className="onboarding-belt-carousel-wrap">
              <div className="onboarding-belt-carousel">
                {BELT_ORDER.map((belt) => {
                  const desc = BELT_DESCRIPTIONS[belt]
                  const isSelected = selectedBelt === belt
                  const color = belt === 'black' ? '#94a3b8' : belt === 'brown' ? '#c2763a' : BELT_COLORS[belt]
                  return (
                    <button
                      key={belt}
                      className={`onboarding-belt-card ${isSelected ? 'selected' : ''}`}
                      style={{
                        '--belt-color': color,
                        borderColor: isSelected ? color : 'transparent',
                        boxShadow: isSelected ? `0 0 0 2px ${color}55, 0 4px 20px ${color}22` : undefined,
                      } as React.CSSProperties}
                      onClick={() => setSelectedBelt(belt)}
                    >
                      <div
                        className="onboarding-belt-card-visual"
                        style={{
                          background: belt === 'white'
                            ? 'linear-gradient(160deg, #2a3444 0%, #1a2232 100%)'
                            : belt === 'black'
                            ? 'linear-gradient(160deg, #2a2a2a 0%, #111 100%)'
                            : `linear-gradient(160deg, ${color}33 0%, ${color}0d 100%)`,
                        }}
                      >
                        <BeltCardSVG belt={belt} />
                      </div>
                      <div className="onboarding-belt-card-info">
                        <span className="onboarding-belt-card-name" style={{ color }}>
                          {belt.charAt(0).toUpperCase() + belt.slice(1)} belt
                        </span>
                        <span className="onboarding-belt-card-desc">{desc}</span>
                      </div>
                      {isSelected && <span className="onboarding-belt-card-check">✓</span>}
                    </button>
                  )
                })}
              </div>
              <p className="onboarding-belt-scroll-hint">← Scroll to see all belts →</p>
              </div>
            </div>

            <div className={`modal-actions onboarding-actions ${isChanging ? 'onboarding-step2-actions' : ''}`}>
              {isChanging && (
                <button className="modal-btn cancel onboarding-back-btn" onClick={onDismiss}>
                  ✕ Cancel
                </button>
              )}
              <button
                className="modal-btn onboarding-next-btn"
                disabled={selectedBelt === null}
                onClick={() => isChanging ? handleStart() : setStep(2)}
                style={selectedBelt ? { background: beltColor, color: beltTextColor, border: beltBorder } : undefined}
              >
                {selectedBelt
                  ? isChanging ? 'Save' : 'Continue →'
                  : 'Select your belt to continue'}
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Techniques showcase ── */}
        {step === 2 && (
          <>
            <div className="onboarding-header">
              <h2 className="modal-title onboarding-title">Techniques</h2>
              <p className="onboarding-subtitle">Browse every BJJ position, filter techniques, and track what you know.</p>
            </div>

            <div className="onboarding-preview">
              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">🗺️ The position map</div>
                <div className="onboarding-preview-map">
                  {[
                    { name: 'Standing',     belt: 'white'  as BeltLevel },
                    { name: 'Open Guard',   belt: 'blue'   as BeltLevel },
                    { name: 'Closed Guard', belt: 'blue'   as BeltLevel },
                    { name: 'Half Guard',   belt: 'white'  as BeltLevel },
                    { name: 'North-South',  belt: 'white'  as BeltLevel },
                    { name: 'Side Control', belt: 'purple' as BeltLevel },
                    { name: 'Turtle',       belt: 'white'  as BeltLevel },
                    { name: 'Mount',        belt: 'white'  as BeltLevel },
                    { name: 'Back Control', belt: 'blue'   as BeltLevel },
                  ].map(({ name, belt }) => (
                    <div
                      key={name}
                      className="onboarding-preview-map-node"
                      style={{ borderColor: BELT_COLORS[belt], boxShadow: `0 0 6px ${BELT_COLORS[belt]}44` }}
                    >
                      <span className="onboarding-preview-map-node-name">{name}</span>
                      <span className="onboarding-preview-map-node-count" style={{ color: BELT_COLORS[belt] }}>x techniques</span>
                      {name !== 'Standing' && (
                        <div className="onboarding-preview-map-subnodes">
                          <span className="onboarding-preview-map-subnode">↑ Top</span>
                          <span className="onboarding-preview-map-subnode">↓ Bottom</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="onboarding-preview-hint">Tap a <strong>Position</strong> and choose <strong>Top</strong> or <strong>Bottom</strong> to view techniques from that position. <strong>Position</strong> colour shows your estimated belt level for that position.</p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">🔍 Filtering</div>
                <div className="onboarding-preview-filter-accordion">
                  {[
                    { label: 'Belt', chips: [{ text: 'All', active: false }, { text: 'Blue', active: true, color: BELT_COLORS.blue }, { text: 'Purple', active: true, color: BELT_COLORS.purple }] },
                    { label: 'Perspective', chips: [{ text: 'All', active: false }, { text: '↑ Top', active: false }, { text: '↓ Bottom', active: true }] },
                    { label: 'Type', chips: [{ text: 'All', active: false }, { text: 'Offense', active: false }, { text: 'Defense', active: true }] },
                    { label: 'Category', chips: [{ text: 'All', active: false }, { text: 'Escape', active: false }, { text: 'Sweep', active: true }] },
                  ].map(({ label, chips }) => (
                    <div key={label} className="onboarding-filter-accordion-row">
                      <div className="onboarding-filter-accordion-header">
                        <span>{label}</span>
                        <span className="onboarding-filter-accordion-chevron">▼</span>
                      </div>
                      <div className="onboarding-filter-accordion-chips">
                        {chips.map(({ text, active, color }) => (
                          <span
                            key={text}
                            className={`onboarding-filter-chip ${active ? 'active' : ''}`}
                            style={color ? { borderColor: color, color, background: active ? `${color}22` : undefined } : undefined}
                          >{text}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="onboarding-preview-hint">Filter by belt level, perspective, Gi/No-Gi, Offense/Defense, and category. Mix and match — select multiple at once.</p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">📋 Technique cards</div>
                <div className="onboarding-preview-technique">
                  <div className="onboarding-preview-tech-head">
                    <BeltIcon belt="white" size={9} />
                    <span style={{ fontWeight: 600, fontSize: 11, flex: 1, color: '#f1f5f9' }}>Armbar from Closed Guard</span>
                    <span className="type-tag offensive" style={{ fontSize: 8 }}>Offense</span>
                  </div>
                  <p style={{ fontSize: 9, color: '#64748b', margin: '3px 0 4px', lineHeight: 1.4 }}>
                    A classic submission — control the posture, hip out, and extend the arm.
                  </p>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    <span className="onboarding-tech-meta-pill">Closed Guard</span>
                    <span className="onboarding-tech-meta-pill">difficulty 2/5</span>
                  </div>
                  <div className="onboarding-preview-tech-actions">
                    <label className="onboarding-tech-checkbox">
                      <input type="checkbox" readOnly /> Mark as learned
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 9, color: '#64748b' }}>☆ In Progress</span>
                      <span style={{ fontSize: 9, color: '#64748b' }}>✎ Notes</span>
                      <span style={{ fontSize: 9, color: '#2d7dd2' }}>▶ Video</span>
                    </div>
                  </div>
                </div>
                <p className="onboarding-preview-hint">
                  Mark as <span className="onboarding-strong">learned</span> to grow your estimate. <span className="onboarding-strong">In Progress</span> tracks what you're actively drilling. Add <span className="onboarding-strong">notes</span> for coach cues. Tap <span className="onboarding-strong">▶ Video</span> to find a YouTube tutorial for the technique.
                </p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">⚡ Mark all by belt level</div>
                <div className="onboarding-preview-bulk">
                  {(['white', 'blue', 'purple'] as BeltLevel[]).map((b) => (
                    <div key={b} className="onboarding-preview-bulk-row" style={{ borderColor: BELT_COLORS[b], background: `${BELT_COLORS[b]}14` }}>
                      <BeltIcon belt={b} size={9} />
                      <span style={{ color: BELT_COLORS[b], fontSize: 11, fontWeight: 600, textTransform: 'capitalize', flex: 1 }}>{b}</span>
                      <span style={{ fontSize: 10, color: '#475569' }}>12/44</span>
                      <span className="onboarding-preview-bulk-action" style={{ background: `${BELT_COLORS[b]}28`, color: BELT_COLORS[b] }}>Mark all</span>
                    </div>
                  ))}
                </div>
                <p className="onboarding-preview-hint">Use <span className="onboarding-strong">Mark all</span> to mark all currently visible techniques as <span className="onboarding-strong">learned</span> at once — select a position (or <span className="onboarding-strong">filter</span> by category) first to narrow down exactly what gets marked.</p>
              </div>
            </div>

            <div className="modal-actions onboarding-actions onboarding-step2-actions">
              <button className="modal-btn cancel onboarding-back-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="modal-btn onboarding-next-btn" style={{ background: beltColor, color: beltTextColor, border: beltBorder }} onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Progress tab showcase ── */}
        {step === 3 && (
          <>
            <div className="onboarding-header">
              <h2 className="modal-title onboarding-title">My Progress</h2>
              <p className="onboarding-subtitle">The <span className="onboarding-strong">My Progress</span> tab estimates your BJJ level based on what you've learned — broken down by position and technique type.</p>
            </div>

            <div className="onboarding-preview">
              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">⏳ In Progress</div>
                <div className="onboarding-inprogress-mock">
                  {[
                    { name: 'Armbar from Guard', pos: 'Closed Guard', glyph: '💪' },
                    { name: 'Single Leg X Sweep', pos: 'Open Guard', glyph: '🔄' },
                    { name: 'Rear Naked Choke', pos: 'Back Control', glyph: '🫁' },
                  ].map(({ name, pos, glyph }) => (
                    <div key={name} className="onboarding-inprogress-mock-tile">
                      <div className="onboarding-inprogress-mock-top">{glyph}</div>
                      <div className="onboarding-inprogress-mock-body">
                        <span className="onboarding-inprogress-mock-name">{name}</span>
                        <span className="onboarding-inprogress-mock-pos">{pos}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="onboarding-preview-hint" style={{ marginTop: 6 }}>
                  Track techniques you're actively working on. Any technique marked as <span className="onboarding-strong">In Progress</span> shows here — so you always know what to drill at your next session.
                </p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">⬆ Strongest &amp; ⬇ Weakest areas</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div className="onboarding-insight-mock onboarding-insight-best">
                    <span className="onboarding-insight-mock-label">Strongest</span>
                    <span className="onboarding-insight-mock-value">Closed Guard</span>
                    <span className="onboarding-insight-mock-belt" style={{ color: BELT_COLORS.brown }}>brown</span>
                  </div>
                  <div className="onboarding-insight-mock onboarding-insight-gap">
                    <span className="onboarding-insight-mock-label">Weakest</span>
                    <span className="onboarding-insight-mock-value">Turtle</span>
                    <span className="onboarding-insight-mock-belt" style={{ color: BELT_COLORS.blue }}>blue</span>
                  </div>
                </div>
                <p className="onboarding-preview-hint" style={{ marginTop: 6 }}>
                  Shows your most developed and most neglected areas at a glance — useful for deciding what to focus on next in training.
                </p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">Your estimated overall level</div>
                <div className="onboarding-preview-belt-row">
                  <BeltIcon belt={selectedBelt ?? 'blue'} size={16} />
                  <span style={{ color: BELT_COLORS[selectedBelt ?? 'blue'], fontWeight: 700, fontSize: 16, textTransform: 'capitalize' }}>{selectedBelt ?? 'blue'}</span>
                  <span style={{ color: '#475569', fontSize: 12 }}>· 62.4%</span>
                </div>
                <div className="onboarding-preview-bar-wrap">
                  <div className="onboarding-preview-bar-fill" style={{ width: '62%', background: BELT_COLORS[selectedBelt ?? 'blue'] }} />
                </div>
                <p className="onboarding-preview-hint" style={{ marginTop: 6 }}>
                  Your estimate updates instantly as you mark techniques learned. The more you log, the more accurate it becomes.
                </p>
              </div>

              <div className="onboarding-preview-card">
                <div className="onboarding-preview-label">Estimated level by position &amp; technique type</div>
                {[
                  { name: 'Closed Guard', belt: 'blue' as BeltLevel, pct: 78 },
                  { name: 'Mount', belt: 'white' as BeltLevel, pct: 45 },
                  { name: 'Back Control', belt: 'purple' as BeltLevel, pct: 55 },
                ].map((row) => (
                  <div key={row.name} className="onboarding-preview-row">
                    <span className="onboarding-preview-row-name">{row.name}</span>
                    <div className="onboarding-preview-bar-wrap" style={{ flex: 1 }}>
                      <div className="onboarding-preview-bar-fill" style={{ width: `${row.pct}%`, background: BELT_COLORS[row.belt] }} />
                    </div>
                    <span style={{ color: BELT_COLORS[row.belt], fontSize: 10, fontWeight: 600, minWidth: 36, textAlign: 'right', textTransform: 'capitalize' }}>{row.belt}</span>
                  </div>
                ))}
                <p className="onboarding-preview-hint" style={{ marginTop: 6 }}>
                  Estimates broken down by position and technique type — so you can see where your strengths and weaknesses lie. Great for identifying specific areas to focus on next.
                </p>
              </div>
            </div>

            <div className="modal-actions onboarding-actions onboarding-step2-actions">
              <button className="modal-btn cancel onboarding-back-btn" onClick={() => setStep(2)}>← Back</button>
              <button className="modal-btn onboarding-next-btn" style={{ background: beltColor, color: beltTextColor, border: beltBorder }} onClick={() => setStep(4)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* ── Step 4: Pick a starting position ── */}
        {step === 4 && (
          <>
            <div className="onboarding-header">
              <h2 className="modal-title onboarding-title">Let's get started!</h2>
              <p className="onboarding-subtitle">
                Pick a position to open first. Use the map to find techniques to learn, or mark off what you already know.
              </p>
            </div>

            <div className="onboarding-positions">
              {ALL_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  className={`onboarding-pos-btn ${selectedPosition === pos.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPosition((cur) => cur === pos.id ? null : pos.id)}
                >
                  <span className="onboarding-pos-name">{pos.name}</span>
                </button>
              ))}
            </div>

            <div className="modal-actions onboarding-actions onboarding-step2-actions">
              <button className="modal-btn cancel onboarding-back-btn" onClick={() => setStep(3)}>← Back</button>
              <button
                className="modal-btn onboarding-start-btn"
                onClick={handleStart}
                style={selectedBelt ? { background: beltColor, color: beltTextColor, border: beltBorder } : undefined}
              >
                {selectedPosition
                  ? `Start at ${ALL_POSITIONS.find((p) => p.id === selectedPosition)?.name} →`
                  : 'Skip'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
