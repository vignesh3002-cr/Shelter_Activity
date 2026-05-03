import { useState, useEffect } from 'react'
import { CODES, BAR_COLORS, STATUS_STYLES } from '../data/projects'

/* ── Helpers ─────────────────────────────────────────── */
function avg(arr) {
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Planning']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
      {status}
    </span>
  )
}

/* ── Grouped Bar Chart ───────────────────────────────── */
function GroupedBarChart({ activities }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  const CHART_H   = 220   // px — total drawable height
  const MAX_VAL   = 100
  const BAR_W     = 7     // px per bar
  const BAR_GAP   = 2     // px between bars in a group
  const GROUP_GAP = 14    // px between groups
  const Y_AXIS_W  = 72    // px reserved for y labels
  const TOP_PAD   = 28    // px above tallest bar (for score labels)
  const BOTTOM_PAD = 28   // px below baseline (for code labels)

  const numGroups = CODES.length          // 5
  const barsPerGroup = activities.length  // 6
  const groupW = barsPerGroup * BAR_W + (barsPerGroup - 1) * BAR_GAP
  const totalW = Y_AXIS_W + numGroups * groupW + (numGroups - 1) * GROUP_GAP + 20

  // Y scale: maps value 0–100 to pixel height (bottom up)
  const scale = (v) => (v / MAX_VAL) * CHART_H

  // Group x offset (left edge of group), 0-indexed
  const groupX = (gi) => Y_AXIS_W + gi * (groupW + GROUP_GAP)

  // Bar x within group
  const barX = (gi, bi) => groupX(gi) + bi * (BAR_W + BAR_GAP)

  // Y ticks: 0, 20, 40, 60, 80, 100
  const yTicks = [0, 20, 40, 60, 80, 100]
  const baseline = CHART_H // svg y coord of the baseline

  const SVG_H = CHART_H + TOP_PAD + BOTTOM_PAD

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalW} ${SVG_H}`}
        width="100%"
        style={{ minWidth: 320, height: SVG_H }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Y-axis label (rotated) ── */}
        <text
          x="10"
          y={TOP_PAD + CHART_H / 2}
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          fill="#C8C8C8"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${TOP_PAD + CHART_H / 2})`}
          letterSpacing="1"
        >
          ACTIVITIES
        </text>

        {/* ── Y tick marks + grid lines ── */}
        {yTicks.map(v => {
          const y = TOP_PAD + CHART_H - scale(v)
          return (
            <g key={v}>
              <line
                x1={Y_AXIS_W - 4} y1={y}
                x2={Y_AXIS_W}     y2={y}
                stroke="#C8C8C8" strokeWidth="1"
              />
              <line
                x1={Y_AXIS_W} y1={y}
                x2={totalW - 10} y2={y}
                stroke="#EBEBEB" strokeWidth={v === 0 ? 1 : 0.6}
                strokeDasharray={v === 0 ? 'none' : '3 3'}
              />
              <text
                x={Y_AXIS_W - 7}
                y={y + 3}
                fontFamily="JetBrains Mono, monospace"
                fontSize="7.5"
                fill="#ABABAB"
                textAnchor="end"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* ── Y axis line ── */}
        <line
          x1={Y_AXIS_W} y1={TOP_PAD}
          x2={Y_AXIS_W} y2={TOP_PAD + CHART_H}
          stroke="#C8C8C8" strokeWidth="1"
        />

        {/* ── X axis line (baseline) ── */}
        <line
          x1={Y_AXIS_W} y1={TOP_PAD + CHART_H}
          x2={totalW - 10} y2={TOP_PAD + CHART_H}
          stroke="#C8C8C8" strokeWidth="1"
        />

        {/* ── Bars (grouped by Code A–E on X-axis, activity per bar in group) ── */}
        {CODES.map((code, gi) => (
          <g key={code}>
            {activities.map((act, bi) => {
              const val   = act[code]
              const bh    = scale(val)
              const x     = barX(gi, bi)
              const yBase = TOP_PAD + CHART_H
              const yTop  = yBase - bh

              return (
                <g key={bi}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={mounted ? yTop : yBase}
                    width={BAR_W}
                    height={mounted ? bh : 0}
                    rx="1.5"
                    fill={BAR_COLORS[bi]}
                    style={{ transition: `y 0.65s cubic-bezier(0.4,0,0.2,1) ${bi * 0.04 + gi * 0.08}s, height 0.65s cubic-bezier(0.4,0,0.2,1) ${bi * 0.04 + gi * 0.08}s` }}
                  />
                  {/* Score label above bar */}
                  <text
                    x={x + BAR_W / 2}
                    y={mounted ? yTop - 2 : yBase - 2}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="5.5"
                    fill="#888"
                    textAnchor="middle"
                    style={{ transition: `y 0.65s cubic-bezier(0.4,0,0.2,1) ${bi * 0.04 + gi * 0.08}s`, opacity: mounted ? 1 : 0 }}
                  >
                    {val}
                  </text>
                </g>
              )
            })}

            {/* Code label below X-axis */}
            <text
              x={groupX(gi) + groupW / 2}
              y={TOP_PAD + CHART_H + 16}
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              fontWeight="600"
              fill="#1A1A1A"
              textAnchor="middle"
            >
              {code}
            </text>
          </g>
        ))}

        {/* ── X axis title ── */}
        <text
          x={Y_AXIS_W + (totalW - Y_AXIS_W) / 2}
          y={SVG_H - 2}
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          fill="#C8C8C8"
          textAnchor="middle"
          letterSpacing="1"
        >
          RATING CODES
        </text>
      </svg>
    </div>
  )
}

/* ── Main Report Page ────────────────────────────────── */
export default function ReportPage({ project, onBack }) {
  if (!project) return null

  const { activities } = project

  // Average per code
  const codeAvgs = CODES.map(code => ({
    code,
    avg: avg(activities.map(a => a[code]))
  }))

  // Max score per activity
  const actTotals = activities.map(a => ({
    ...a,
    total: Math.max(a.A, a.B, a.C, a.D, a.E)
  }))

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="Back to projects"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#3C3C3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <div className="font-mono text-xs text-gray-400 tracking-widest uppercase">{project.id} · View Report</div>
              <div className="font-bold text-sm text-gray-900 tracking-tight">{project.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status}/>
            <div className="w-8 h-8 rounded-full bg-gray-950 text-white text-xs font-semibold flex items-center justify-center">JR</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-5">

        {/* Report header card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-up">
          <div className="font-mono text-xs text-gray-300 tracking-widest uppercase mb-2">Activity Report</div>
          <h2 className="text-xl font-bold text-gray-950 tracking-tight mb-1">{project.name}</h2>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={project.status}/>
            <span className="text-xs text-gray-400">Customer: {project.customer}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono w-28 flex-shrink-0">Overall Progress</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-1000"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-gray-700 w-8 text-right">{project.progress}%</span>
          </div>
        </div>

        {/* Chart card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-up delay-1">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Activity Rating Graph</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Y-axis: Activities &nbsp;·&nbsp; X-axis: Codes A, B, C, D, E
              </p>
            </div>
            <span className="font-mono text-xs text-gray-300 tracking-wide">Codes A – E</span>
          </div>

          {/* Axis pills */}
          <div className="flex gap-2 my-4 flex-wrap">
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-mono px-3 py-1.5 rounded-full border border-gray-200">
              ↑ Y-axis: <strong className="text-gray-800">Activities</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-mono px-3 py-1.5 rounded-full border border-gray-200">
              → X-axis: <strong className="text-gray-800">Code A B C D E</strong>
            </span>
          </div>

          <GroupedBarChart activities={activities}/>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-5">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: BAR_COLORS[i], border: i === activities.length - 1 ? '1px solid #C8C8C8' : 'none' }}
                />
                <span className="text-xs text-gray-500 font-mono">{act.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average score per code */}
        <div className="animate-fade-up delay-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-widest font-mono">Average Score per Code</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {codeAvgs.map(({ code, avg: a }, i) => (
              <div key={code} className="bg-white border border-gray-200 rounded-xl p-4 text-center animate-fade-up"
                style={{ animationDelay: `${0.05 * i + 0.25}s` }}>
                <div className="font-mono text-xs text-gray-300 uppercase tracking-widest mb-1">Code {code}</div>
                <div className="text-2xl font-bold text-gray-950 tracking-tight">{a}</div>
                <div className="text-xs text-gray-400 font-mono mt-1">avg rating</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Score Table */}
        <div className="animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-widest font-mono">Activity Score Table</h3>
            <span className="font-mono text-xs text-gray-300">Codes A – E</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <colgroup>
                <col style={{ width: 'auto' }}/>
                {CODES.map(c => <col key={c} style={{ width: '52px' }}/>)}
                <col style={{ width: '56px' }}/>
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-mono text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Activity
                  </th>
                  {CODES.map(c => (
                    <th key={c} className="text-center py-3 font-mono text-xs text-gray-400 uppercase tracking-widest font-medium">
                      {c}
                    </th>
                  ))}
                  <th className="text-center pr-5 py-3 font-mono text-xs text-gray-600 uppercase tracking-widest font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {actTotals.map((act, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                      {act.name}
                    </td>
                    {CODES.map(c => (
                      <td key={c} className="text-center py-3 font-mono text-xs font-medium text-gray-800">
                        {act[c]}
                      </td>
                    ))}
                    <td className="text-center pr-5 py-3 font-mono text-xs font-bold text-gray-950">
                      {act.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}