import { BELT_COLORS, BELT_ORDER } from '../data/types'
import { beltBarStyleSingle } from '../lib/beltBarStyle'
import { BeltLabel } from '../lib/beltLabel'
import type { BeltLevel } from '../data/positions'
import type { Category } from '../data/types'
import type { OverallProficiency } from '../lib/proficiency'

interface Props {
  proficiency: OverallProficiency
  realBelt: BeltLevel | null
  learnedCount: number
  totalCount: number
  onSelectPosition: (id: string) => void
  onSelectCategory: (cat: Category) => void
  onReset: () => void
}

function beltIndex(belt: BeltLevel) {
  return BELT_ORDER.indexOf(belt)
}

function isAboveRealBelt(estimated: BeltLevel, real: BeltLevel | null): boolean {
  if (!real) return false
  return beltIndex(estimated) > beltIndex(real)
}

function isBelowRealBelt(estimated: BeltLevel, real: BeltLevel | null): boolean {
  if (!real) return false
  return beltIndex(estimated) < beltIndex(real)
}

export function ProficiencyPanel({ proficiency, realBelt, learnedCount, totalCount, onSelectPosition, onSelectCategory, onReset }: Props) {
  const { belt, isBlack, positions, categories, startedCount } = proficiency

  const sortedPositions = [...positions].sort((a, b) => b.ratio - a.ratio)
  const sortedCategories = [...categories].sort((a, b) => b.ratio - a.ratio)

  const overallAbove = realBelt !== 'black' && realBelt && beltIndex(belt) > beltIndex(realBelt) && startedCount > 0

  return (
    <div className="prof-panel">

      {/* ── Overall estimated belt ── */}
      <div className="prof-overall" data-info="Based on techniques you've marked as learned. Estimates are not your real belt — they show knowledge coverage. Each position and category gets its own estimate, since most grapplers are stronger in some areas than others. You need ~70% of a belt's techniques covered before ranking up — a few advanced moves won't inflate your level.">
        <span className="prof-overall-label">
          Your estimated overall level
          <span className="info-icon" tabIndex={0} aria-label="How estimates work">ⓘ</span>
        </span>
        <div className="prof-overall-belt">
          {learnedCount >= 10 ? (
            <>
              <BeltLabel belt={belt} beltPct={proficiency.beltPct} isBlack={isBlack} fontSize={16} />
              {overallAbove && (
                <span className="above-badge" title={`Estimated above your real ${realBelt} belt!`}>
                  ⬆ above your belt
                </span>
              )}
              <span className="prof-overall-pct">
                {isBlack
                  ? 'All techniques mastered'
                  : `${((proficiency.beltPct ?? 1) * 100).toFixed(1)}%`}
              </span>
            </>
          ) : (
            <span className="prof-overall-pct">
              Mark {Math.max(0, 10 - learnedCount)} more technique{10 - learnedCount === 1 ? '' : 's'} to reveal your estimate
            </span>
          )}
        </div>
        {learnedCount >= 10 && (
          <div className="prof-tier-bar">
            <div
              className="prof-tier-fill"
              style={beltBarStyleSingle(belt, isBlack ? 1 : (proficiency.beltPct ?? 0))}
            />
          </div>
        )}
      </div>


      {/* ── By position ── */}
      <h3 className="prof-section-title">By position</h3>
      <div className="prof-positions">
        {sortedPositions.map((p) => {
          const above = realBelt !== 'black' && isAboveRealBelt(p.belt, realBelt) && p.started
          const below = realBelt !== 'black' && isBelowRealBelt(p.belt, realBelt) && p.started
          return (
            <button
              key={p.positionId}
              className={`prof-row ${above ? 'prof-row-above' : ''} ${below ? 'prof-row-below' : ''}`}
              onClick={() => onSelectPosition(p.positionId)}
              data-tooltip={
                p.started
                  ? `${above ? '↑ Above your belt. ' : below ? '↓ Below your belt. ' : ''}${p.learned} of ${p.total} techniques learned. Click to view.`
                  : `${p.total} techniques — click to start`
              }
            >
              <span className="prof-row-name">
                {above && <span className="row-above-arrow" title="Above your real belt">↑</span>}
                {below && <span className="row-below-arrow" title="Below your real belt">↓</span>}
                {p.positionName}
              </span>
              <div className="prof-row-bar">
                <div
                  className="prof-row-fill"
                  style={p.started ? beltBarStyleSingle(p.belt, p.beltPct ?? 0) : { width: '0%' }}
                />
              </div>
              <div className="prof-row-right">
                <span className="prof-row-belt-name" style={{ color: !p.started ? '#475569' : p.belt === 'black' ? '#94a3b8' : p.belt === 'brown' ? '#c2763a' : BELT_COLORS[p.belt] }}>
                  {p.started ? p.belt : '—'}
                </span>
                <span className="prof-row-pct">{p.started ? (p.belt === 'black' ? '100%' : `${((p.beltPct ?? 0) * 100).toFixed(1)}%`) : ''}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── By technique type ── */}
      <h3 className="prof-section-title">By technique type</h3>
      <div className="prof-positions">
        {sortedCategories.map((c) => {
          const above = realBelt !== 'black' && isAboveRealBelt(c.belt, realBelt) && c.started
          const below = realBelt !== 'black' && isBelowRealBelt(c.belt, realBelt) && c.started
          return (
            <button
              key={c.category}
              className={`prof-row ${above ? 'prof-row-above' : ''} ${below ? 'prof-row-below' : ''}`}
              onClick={() => onSelectCategory(c.category)}
              data-tooltip={
                c.started
                  ? `${above ? '↑ Above your belt. ' : below ? '↓ Below your belt. ' : ''}${c.learned} of ${c.total} techniques learned. Click to filter.`
                  : `${c.total} techniques — click to filter`
              }
            >
              <span className="prof-row-name">
                {above && <span className="row-above-arrow" title="Above your real belt">↑</span>}
                {below && <span className="row-below-arrow" title="Below your real belt">↓</span>}
                {c.categoryLabel}
              </span>
              <div className="prof-row-bar">
                <div
                  className="prof-row-fill"
                  style={c.started ? beltBarStyleSingle(c.belt, c.beltPct ?? 0) : { width: '0%' }}
                />
              </div>
              <div className="prof-row-right">
                <span className="prof-row-belt-name" style={{ color: !c.started ? '#475569' : c.belt === 'black' ? '#94a3b8' : c.belt === 'brown' ? '#c2763a' : BELT_COLORS[c.belt] }}>
                  {c.started ? c.belt : '—'}
                </span>
                <span className="prof-row-pct">{c.started ? (c.belt === 'black' ? '100%' : `${((c.beltPct ?? 0) * 100).toFixed(1)}%`) : ''}</span>
              </div>
            </button>
          )
        })}
      </div>

      <p className="progress-tab-count">{learnedCount}/{totalCount} techniques learned</p>

      {learnedCount > 0 && (
        <button className="prof-reset-btn" onClick={onReset}>
          Reset all progress
        </button>
      )}
    </div>
  )
}

