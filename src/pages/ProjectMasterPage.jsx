import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { STATUS_STYLES } from '../data/projects.js';

export default function ProjectMasterPage({
  onLogout,
  onViewReport
}) {

  const [projects, setProjects] = useState([]);
  const [projectListed, setProjectListed] = useState(false);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const initials = username?.substring(0, 2).toUpperCase();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const res = await axios.get(
          `${API}/api/projects/my-projects`
        );

        console.log('Fetched projects:', res.data);

        // IMPORTANT FIX
        const projectData = Array.isArray(res.data)
          ? res.data
          : res.data.value || [];

        console.log('Final Project Array:', projectData);

        setProjects(projectData);

      } catch (error) {

        console.error(
          'Error fetching projects:',
          error
        );

        setProjects([]);

      } finally {

        setLoading(false);
        setProjectListed(true);

      }
    };

    fetchProjects();

  }, [API]);

  function SearchIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="7"
          cy="7"
          r="5"
          stroke="#ABABAB"
          strokeWidth="1.4"
        />
        <path
          d="M11 11l3 3"
          stroke="#ABABAB"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  function StatusBadge({ status }) {

    const s =
      STATUS_STYLES?.[status] || {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        dot: 'bg-gray-500'
      };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase ${s.bg} ${s.text}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
        />
        {status}
      </span>
    );
  }

  const statuses = [
    'All',
    'Created',
    'Estimated',
    'Scheduled',
    'InProcess',
    'Finished'
  ];

  // SAFE FILTER
  const filtered = Array.isArray(projects)
    ? projects.filter((p) => {

        const projectName =
          p.ProjectName || '';

        const projectID =
          p.ProjectID || '';

        const projectStage =
          p.ProjectStage || '';

        const matchSearch =
          projectName
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          projectID
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchFilter =
          filter === 'All' ||
          projectStage === filter;

        return matchSearch && matchFilter;
      })
    : [];

  // COUNTS
  const counts = {
    Total: projects.length,

    Created: projects.filter(
      (p) => p.ProjectStage === 'Created'
    ).length,

    Estimated: projects.filter(
      (p) => p.ProjectStage === 'Estimated'
    ).length,

    Scheduled: projects.filter(
      (p) => p.ProjectStage === 'Scheduled'
    ).length,

    InProcess: projects.filter(
      (p) => p.ProjectStage === 'InProcess'
    ).length,

    Finished: projects.filter(
      (p) => p.ProjectStage === 'Finished'
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center h-screen bg-gray-100">

          <motion.img
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
          />

        </div>
      )}

      {/* MAIN */}
      {!loading && projectListed && (

        <div>

          {/* HEADER */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200">

            <div className="flex items-center justify-between h-16 max-w-6xl px-4 mx-auto">

              <div className="flex items-center gap-3">

                <img
                  src="/Shelter_logo.png"
                  alt="logo"
                  className="w-8 h-8"
                />

                <div>

                  <span className="text-sm font-semibold tracking-wide text-gray-900">
                    SHELTER GROUP
                  </span>

                  <span className="hidden ml-2 font-mono text-xs text-gray-300 md:inline">
                    Analytics Platform
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gray-950">
                  {initials}
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg hover:bg-gray-100 inline-flex justify-center items-center gap-2"
                >
                  Sign Out
                  <span><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#434343"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></span>
                </button>

              </div>

            </div>

          </header>

          {/* BODY */}
          <main className="max-w-6xl px-6 py-8 mx-auto">

            {/* TITLE */}
            <div className="mb-6">

              <h1 className="text-3xl font-bold text-gray-900">
                Project Master
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Select a project to view its detailed activity report
              </p>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-6">

              {Object.entries(counts).map(([key, value]) => (

                <div
                  key={key}
                  className="p-4 bg-white border border-gray-200 rounded-xl"
                >

                  <div className={`text-2xl font-bold ${key==="Total"?"text-slate-500":key==="Created"?"text-purple-500":key==="Estimated"?"text-blue-500":key==="Scheduled"?"text-red-500":key==="InProcess"?"text-yellow-500":key==="Finished"?"text-green-500":""}`}>
                    {value}
                  </div>

                  <div className="mt-1 text-sm text-gray-400">
                    {key}
                  </div>

                </div>

              ))}

            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col gap-3 mb-6 md:flex-row">

              <div className="flex items-center flex-1 gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">

                <SearchIcon />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by project name or ID..."
                  className="flex-1 text-sm outline-none"
                />

              </div>

              <div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-200 rounded-xl">

                {statuses.map((s) => (

                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      filter === s
                        ? 'bg-black text-white'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {s}
                  </button>

                ))}

              </div>

            </div>

            {/* TABLE */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">

              {/* HEADER */}
              <div className="grid grid-cols-2 px-5 py-4 text-xs font-bold tracking-widest text-gray-700 uppercase justify-between border-b border-gray-200 md:grid-cols-4 bg-gray-50">
 
                <span>Project ID</span>
                <span className="hidden md:block">Project Name</span>
                <span className="hidden ml-2 md:block">Status</span>
                <span className="text-right">Action</span>

              </div>

              {/* ROWS */}
              {filtered.length === 0 ? (

                <div className="py-16 text-center text-gray-400">
                  No projects found
                </div>

              ) : (

                filtered.map((project, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-2 px-5 py-4 border-b border-gray-100 md:grid-cols-4 hover:bg-gray-50"
                  >

                    <div className="font-mono text-[12px] text-gray-700">
                      {project.ProjectID}
                    </div>

                    <div className="hidden text-[12px] font-semibold text-gray-900 md:block ">
                      {project.ProjectName}
                    </div>

                    <div className="hidden md:block">
                      <StatusBadge
                        status={project.ProjectStage}
                      />
                    </div>

                    <div className="flex justify-end">

                      <button
                        onClick={() =>
                          onViewReport(project)
                        }
                        className="px-4 py-2 text-[12px] font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 flex justify-center items-center gap-2"
                      >
                        <span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg></span>
                        View Report
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

            {/* FOOTER */}
            <p className="mt-6 text-xs text-center text-gray-400">

              Showing {filtered.length} of {projects.length} projects

            </p>

          </main>

        </div>

      )}

    </div>
  );
}