import { useState } from 'react'
import { PROJECTS, STATUS_STYLES } from '../data/projects'

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#ABABAB" strokeWidth="1.4"/>
      <path d="M11 11l3 3" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
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

function ProgressBar({ value, status }) {
  const colorMap = {
    'Active': 'bg-emerald-500',
    'Completed': 'bg-gray-700',
    'On Hold': 'bg-amber-500',
    'Planning': 'bg-blue-400',
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-150 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorMap[status] || 'bg-gray-700'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-xs text-gray-600 font-medium w-8 text-right">{value}%</span>
    </div>
  )
}

export default function ProjectMasterPage({ onViewReport, onLogout }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const statuses = ['All', 'Active', 'Completed', 'On Hold', 'Planning']

  const filtered = PROJECTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || p.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    total: PROJECTS.length,
    active: PROJECTS.filter(p => p.status === 'Active').length,
    completed: PROJECTS.filter(p => p.status === 'Completed').length,
    onHold: PROJECTS.filter(p => p.status === 'On Hold').length,
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <img src='/Shelter_logo.png' alt="Shelter Logo" className="w-8 h-8"/>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 tracking-wide">SHELTER GROUP</span>
              <span className="ml-2 text-xs text-gray-300 font-mono">Analytics Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-950 text-white text-xs font-semibold flex items-center justify-center">
              JR
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-mono text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Page heading */}
        <div className="mb-6 animate-fade-up">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">Project Master</h1>
          <p className="text-sm text-gray-400 mt-1">Select a project to view its detailed activity report</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-up delay-1">
          {[
            { label: 'Total Projects', value: counts.total, color: 'text-gray-900' },
            { label: 'Active',         value: counts.active,    color: 'text-emerald-600' },
            { label: 'Completed',      value: counts.completed, color: 'text-gray-600' },
            { label: 'On Hold',        value: counts.onHold,    color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-mono uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="flex items-center gap-3 mb-5 animate-fade-up delay-2">
          <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-xl h-11 px-4 focus-within:border-gray-400 transition-colors">
            <SearchIcon/>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, ID or customer…"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 outline-none font-sans"
            />
          </div>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wide transition-all ${
                  filter === s
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div className="bg-gray-50 border border-gray-200 rounded-t-xl px-5 py-3 animate-fade-up delay-2">
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-1 font-mono text-xs text-gray-400 uppercase tracking-widest">ID</span>
            <span className="col-span-4 font-mono text-xs text-gray-400 uppercase tracking-widest">Project Name</span>
            <span className="col-span-3 font-mono text-xs text-gray-400 uppercase tracking-widest">Customer</span>
            <span className="col-span-2 font-mono text-xs text-gray-400 uppercase tracking-widest">Status</span>
            <span className="col-span-2 font-mono text-xs text-gray-400 uppercase tracking-widest text-right">Action</span>
          </div>
        </div>

        {/* Project rows */}
        <div className="border-x border-b border-gray-200 rounded-b-xl overflow-hidden bg-white">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-300 font-mono text-sm">
              No projects found
            </div>
          ) : (
            filtered.map((project, i) => (
              <div
                key={project.id}
                className={`px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all duration-150 animate-slide-in`}
                style={{ animationDelay: `${0.05 * i + 0.15}s` }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* ID */}
                  <div className="col-span-1">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 rounded-md px-2 py-1">{project.id}</span>
                  </div>

                  {/* Name */}
                  <div className="col-span-4">
                    <div className="font-semibold text-sm text-gray-900">{project.name}</div>
                    <div className="mt-1.5">
                      <ProgressBar value={project.progress} status={project.status}/>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="col-span-3">
                    <div className="text-xs text-gray-500 leading-relaxed">{project.customer}</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={project.status}/>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => onViewReport(project)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-950 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 active:scale-95 transition-all font-mono tracking-wide"
                    >
                      View Report
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6M5.5 2L8 5l-2.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-xs text-gray-300 font-mono mt-6">
          Showing {filtered.length} of {PROJECTS.length} projects
        </p>
      </main>
    </div>
  )
}
