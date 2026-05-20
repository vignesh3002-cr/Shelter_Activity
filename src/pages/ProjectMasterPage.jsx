import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';


export default function ProjectMasterPage({ onLogout, onViewReport }) {

  const [projects, setProjects] = useState([]);
  const [projectListed, setProjectListed] = useState(false);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {

    const fetchProjects = async () => {

      try {
        
        const res = await axios.get(
          `${API}/api/projects/my-projects`
        );

        console.log('Fetched projects:', res.data);

        setProjects(res.data);
        setLoading(false);
        setProjectListed(true);
      } catch (error) {

        console.error(
          'Error fetching projects:',
          error
        );

      }
    };

    fetchProjects();

  }, []);

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#ABABAB" strokeWidth="1.4"/>
      <path d="M11 11l3 3" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function StatusBadge({ status }) {
  const s = projects[status] || projects['Planning']
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-emerald-50 text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
      {status}
    </span>
  )
}


function ProgressBar({status}) {
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
          className="h-full transition-all duration-700 rounded-full bg-emerald-500 w-[60%]"
          //style={{ width: status === 'Active' ? '60%' : status === 'Completed' ? '100%' : status === 'On Hold' ? '30%' : '10%' }}
        />
      </div>
     {/* <span className="w-8 font-mono text-xs font-medium text-right text-gray-600">{value}%</span>*/}
    </div>
  )
}

 
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const statuses = ['All', 'Created', 'Estimated', 'Scheduled', 'InProcess', 'Finished']

  const filtered = projects.filter(p => {
    const matchSearch = p.ProjectName.toLowerCase().includes(search.toLowerCase()) ||
      p.ProjectID.toLowerCase().includes(search.toLowerCase())// ||
      //p.customer.toLowerCase().includes(search.toLowerCase()) 
    const matchFilter = filter === 'All' || p.ProjectStage === filter
    return matchSearch && matchFilter
  })

  const counts = {
    Total: projects.length,
    Created: projects.filter(p => p.ProjectStage.toLowerCase() === 'created').length,
    Completed: projects.filter(p => p.ProjectStage.toLowerCase() === 'completed').length,
    Estimated: projects.filter(p => p.ProjectStage.toLowerCase() === 'estimated').length,
    Scheduled: projects.filter(p => p.ProjectStage.toLowerCase() === 'scheduled').length,
    InProcess: projects.filter(p => p.ProjectStage.toLowerCase() === 'inprocess').length,
    Finished: projects.filter(p => p.ProjectStage.toLowerCase() === 'finished').length,
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {loading && (<div className='flex items-center justify-center h-screen bg-white'><motion.img
        className="w-32 h-32 mx-auto"
        src="/Shelter_logo.png"
           animate={{
             scale: [1, 1.2, 1],
             rotate: [0, 5, -5, 0],
        }}
        transition={{
           duration: 1.5,
          repeat: Infinity,
       }}
   ></motion.img></div>)}
      {/* Top Nav */}

   {projectListed && (<div><header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 max-w-6xl px-2 mx-auto md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
              <img src='/Shelter_logo.png' alt="Shelter Logo" className="w-8 h-8"/>
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide text-gray-900">SHELTER GROUP</span>
              <span className="hidden ml-2 font-mono text-xs text-gray-300 md:inline">Analytics Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gray-950">
              JR
            </div>
    
            <button onClick={onLogout}
              className="text-xs font-mono text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-gray-200 hover:border-gray-200"
            >
              Sign out
            </button>
          
          </div>
        </div>
      </header>

      <main className="max-w-5xl px-6 py-8 mx-auto">

        {/* Page heading */}
        <div className="mb-6 animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">Project Master</h1>
          <p className="mt-1 text-sm text-gray-400">Select a project to view its detailed activity report</p>
        </div>

        {/* Stats row*/}
        <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 animate-fade-up delay-1">
          {Object.entries(counts).map(([key, value]) => (
            <div key={key} className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className={"text-2xl font-bold tracking-tight text-slate-600" }>{value}</div>
              <div className="text-sm text-gray-400 mt-0.5 font-mono tracking-wide">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            </div>
          ))}
        </div>

        {/* Search + filter bar*/}
        <div className="flex flex-col items-center gap-1 md:flex-row animate-fade-up delay-2">
          <div className="flex items-center flex-1 gap-3 px-4 py-1.5 transition-colors bg-white border border-gray-200 rounded-xl focus-within:border-gray-400">
            <SearchIcon/>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, ID or customer…"
              className="flex-1 font-sans text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
            />
          </div>
          <div className="gap-1 p-1 bg-white border border-gray-200 md:flex rounded-xl">
            {statuses.map((s, id) => (
              <button
                key={id}
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
        <div className="px-5 py-3 border border-gray-200 bg-gray-50 rounded-t-xl animate-fade-up delay-2">
          <div className="grid justify-between grid-cols-2 md:grid-cols-3">
            <span className="font-mono text-xs tracking-widest text-gray-400 ">Project Name</span>
            <span className="hidden font-mono text-xs tracking-widest text-gray-400">Customer</span>
            <span className="hidden font-mono text-xs tracking-widest text-gray-400 md:inline-block">Status</span>
            <span className="font-mono text-xs tracking-widest text-right text-gray-400 ">Action</span>
          </div>
        </div>

        {/* Project rows */}
        <div className="overflow-hidden bg-white border-b border-gray-200 border-x rounded-b-xl">
          {filtered.length === 0 ? (
            <div className="py-16 font-mono text-sm text-center text-gray-300">
              No projects found
            </div>
          ) : (
            filtered.map((project, id) => (
              <div
                key={id}
                className={`px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all duration-150 animate-slide-in`}
                style={{ animationDelay: `${0.05 * id + 0.15}s` }}
              >
                <div className="grid justify-between grid-cols-2 gap-4 md:items-center md:grid-cols-3">    
                  {/* Name */}
                  <div className="row-span-2">
                    <span className="py-1 font-mono text-xs text-gray-400 rounded-md ">{project.ProjectID}</span>
                    <div className="text-sm font-semibold text-gray-900">{project.ProjectName}</div>
                    <div className="mt-1.5">
                      <ProgressBar /*value={project.progress}*/ status={project.Status}/>
                    </div>
                      {/*<div className="text-xs leading-relaxed text-gray-500">{project.customer}</div>*/}
                  </div>

                  {/* Customer 
                  <div className="hidden md:col-span-3 md:inline-block">
                    <div className="text-xs leading-relaxed text-gray-500">{project.customer}</div>
                  </div>*/}

                  {/* Status */}
                  <div className="hidden md:inline-block">
                    <StatusBadge status={project.ProjectStage}/>
                  </div>

                
                  <div className="flex justify-end col-span-1">
                    <button
                      onClick={() => onViewReport(project)}
                      className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-white transition-all rounded-lg bg-gray-950 hover:bg-gray-700 active:scale-95"
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

        <p className="mt-6 font-mono text-xs text-center text-gray-300">
          Showing {filtered.length} of {projects.length} projects
        </p>
      </main>
      </div>)}
    </div>
  )
 
}
