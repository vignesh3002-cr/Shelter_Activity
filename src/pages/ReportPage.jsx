import { useState, useEffect } from 'react'
import { CODES, BAR_COLORS, STATUS_STYLES } from '../data/projects'
import axios from 'axios';
/* ── Helpers ───────────────────────────────────────────
function avg(arr) {
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
}
*/
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-300' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
      {status}
    </span>
  )
}

/* ── Grouped Bar Chart ───────────────────────────────── 
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
        {/* ── Y-axis label (rotated) ── 
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

        {/* ── Y tick marks + grid lines ── 
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

        {/* ── Y axis line ── 
        <line
          x1={Y_AXIS_W} y1={TOP_PAD}
          x2={Y_AXIS_W} y2={TOP_PAD + CHART_H}
          stroke="#C8C8C8" strokeWidth="1"
        />

        {/* ── X axis line (baseline) ──
        <line
          x1={Y_AXIS_W} y1={TOP_PAD + CHART_H}
          x2={totalW - 10} y2={TOP_PAD + CHART_H}
          stroke="#C8C8C8" strokeWidth="1"
        />

        {/* ── Bars (grouped by Code A–E on X-axis, activity per bar in group) ── 
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
                  {/* Bar 
                  <rect
                    x={x}
                    y={mounted ? yTop : yBase}
                    width={BAR_W}
                    height={mounted ? bh : 0}
                    rx="1.5"
                    fill={BAR_COLORS[bi]}
                    style={{ transition: `y 0.65s cubic-bezier(0.4,0,0.2,1) ${bi * 0.04 + gi * 0.08}s, height 0.65s cubic-bezier(0.4,0,0.2,1) ${bi * 0.04 + gi * 0.08}s` }}
                  />
                  {/* Score label above bar 
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

            {/* Code label below X-axis 
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

        {/* ── X axis title ── 
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
export default function ReportPage({project, onBack, toUpload}) {
  const [activities, setActivities] = useState([]);
  const [columns, setColumns] = useState([]);
  const username = localStorage.getItem('username') || 'Unknown User';
  const initials=username?.substring(0,2).toUpperCase();
  //const API = import.meta.env.VITE_API_URL;
  
  {
  if (!project){
    return(<div><h1>Project not found</h1></div>)
  } 
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/project-details/${project.ProjectID}`);
        console.log("Project details response:", response.data);
        setActivities(response.data);
        // Extract column names from the first activity object
        if (response.data.length > 0) {
          setColumns(Object.keys(response.data[0]).slice(1)); // Exclude the 'name' column
        } 
      }
      catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [project.ProjectID]);  

  /*// Average per code
  const codeAvgs = CODES.map(code => ({
    code,
    avg: avg(activities.map(a => a[code]))
  }))
 */}
  // Max score per activity
  const actTotals = activities.map(a => ({
    ...a,
    total: Math.max(a.A, a.B, a.C, a.D, a.E)
  }))

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 max-w-full px-8 mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center transition-colors border border-gray-200 rounded-lg w-9 h-9 bg-gray-50 hover:bg-gray-100"
              title="Back to projects"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#3C3C3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <div className="font-mono text-xs tracking-widest text-gray-400 uppercase">{project.ProjectID} · View Report</div>
              <div className="text-sm font-bold tracking-tight text-gray-900">{project.ProjectName}</div>
              <div className="text-xs text-gray-800 tracking-wide mt-0.5"> {activities[0]?.UpdatedBy}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.ProjectStage}/>
            <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gray-950">{initials}</div>
          </div>
        </div>
      </header>
 
      <main className="px-6 py-8 mx-auto space-y-5">

       {/*Report header card */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl animate-fade-up">
          <div className="mb-2 font-mono text-xs tracking-widest text-gray-300 uppercase">Activity Report</div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-gray-950">{project.ProjectName}</h2>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={project.ProjectStage}/>
            {/*<span className="text-xs text-gray-400">Customer: {project.CustomerName}</span>*/}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 font-mono text-xs text-gray-400 w-28">Overall Progress</span>
            <div className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full">
              <div
                className="h-full transition-all duration-1000 bg-gray-900 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="w-8 font-mono text-xs font-semibold text-right text-gray-700">{project.progress}%</span>
          </div>
        </div>

        {/* Chart card
        <div className="p-6 bg-white border border-gray-200 rounded-2xl animate-fade-up delay-1">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Activity Rating Graph</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Y-axis: Activities &nbsp;·&nbsp; X-axis: Codes A, B, C, D, E
              </p>
            </div>
            <span className="font-mono text-xs tracking-wide text-gray-300">Codes A – E</span>
          </div>

          {/* Axis pills 
          <div className="flex flex-wrap gap-2 my-4">
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-mono px-3 py-1.5 rounded-full border border-gray-200">
              ↑ Y-axis: <strong className="text-gray-800">Activities</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-mono px-3 py-1.5 rounded-full border border-gray-200">
              → X-axis: <strong className="text-gray-800">Code A B C D E</strong>
            </span>
          </div>

          <GroupedBarChart activities={activities}/>

          {/* Legend
          <div className="flex flex-wrap gap-2 mt-5">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: BAR_COLORS[i], border: i === activities.length - 1 ? '1px solid #C8C8C8' : 'none' }}
                />
                <span className="font-mono text-xs text-gray-500">{act.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average score per code 
        <div className="animate-fade-up delay-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-sm font-semibold tracking-widest text-gray-900 uppercase">Average Score per Code</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {codeAvgs.map(({ code, avg: a }, i) => (
              <div key={code} className="p-4 text-center bg-white border border-gray-200 rounded-xl animate-fade-up"
                style={{ animationDelay: `${0.05 * i + 0.25}s` }}>
                <div className="mb-1 font-mono text-xs tracking-widest text-gray-300 uppercase">Code {code}</div>
                <div className="text-2xl font-bold tracking-tight text-gray-950">{a}</div>
                <div className="mt-1 font-mono text-xs text-gray-400">avg rating</div>
              </div>
            ))}
          </div>
        </div> */}

         {/*Activity Score Table */}
        <div className="animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-sm font-semibold tracking-widest text-gray-900 uppercase">Activity Score Table</h3>
            <button className="font-mono text-xs text-gray-300 cursor-pointer" onClick={toUpload}>
              To Upload
            </button>
          </div>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl">
            <table style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                 {columns.map(col => (
                    <th
                      key={col}
                      className="px-5 py-3 font-mono text-xs font-medium tracking-widest text-left text-gray-400 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
               
              </tbody>
            </table>
          </div>
        </div>

        
                  
      </main> 
    </div>
  )
}