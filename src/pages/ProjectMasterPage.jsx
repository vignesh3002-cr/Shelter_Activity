import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { STATUS_STYLES } from '../data/projects.js';
import ResetPasswordModal from './RestPassword.jsx';

export default function ProjectMasterPage({
  onLogout,
  onViewReport,
  onViewTime,
  LoginValue
}) {

  const [projects, setProjects] = useState([]);
  const [projectListed, setProjectListed] = useState(false);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const UserId = localStorage.getItem("usermail");
  const initials = username?.substring(0, 2).toUpperCase();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Total');
  const [viewDetails,setViewDetails]=useState(null);
  const [showProfileMenu, setShowProfileMenu]=useState(false);
  const [showResetModal, setShowResetModal] =useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const fetchProjects = async () => {

  try {

    const userRecId =
      localStorage.getItem("userRecId");

    console.log(
      "Logged User RecId:",
      userRecId
    );

    const res = await axios.get(
      `${API}/api/projects/my-projects`
    );

    const projectData =
      Array.isArray(res.data)
        ? res.data
        : res.data.value || [];

    console.log(
      "Total Projects:",
      projectData.length
    );

    const filteredProjects =
      projectData.filter(
        project =>
          String(project.WorkerResponsible) ===
          String(userRecId)
      );

    console.log(
      "Filtered Projects:",
      filteredProjects
    );

    setProjects(filteredProjects);

  } catch (error) {

    console.error(
      "Error fetching projects:",
      error
    );

    setProjects([]);

  } finally {

    setLoading(false);
    setProjectListed(true);

  }
};

    fetchProjects();
      const handleClickOutside = (
    event
  ) => {

    if (
      profileRef.current &&
      !profileRef.current.contains(
        event.target
      )
    ) {

      setShowProfileMenu(false);

    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

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
  /*
  const statuses = [
    'All',
    'Created',
    'Estimated',
    'Scheduled',
    'InProcess',
    'Finished'
  ];*/
  const profileRef = useRef(null);
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
          filter === 'Total' ||
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
  const handleResetPassword = async (data) => {
    try {
      // Make API call to reset password
      axios.post(`${API}/api/auth/ResetPassword`, { UserId, newPassword: data.newPassword })
        .then((response) => {
          console.log(response.data);
        });
        onLogout();
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">

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

              <div ref={profileRef} className="relative">
                 <button
    onClick={() =>
      setShowProfileMenu(
        !showProfileMenu
      )
    }
    className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white transition rounded-full bg-gradient-to-r from-slate-800 to-black hover:scale-105"
  >
    {initials}
  </button>

  {showProfileMenu && (

    <div className="absolute right-0 z-50 mt-3 overflow-hidden bg-white border border-gray-200 shadow-2xl w-72 rounded-2xl">

      {/* HEADER */}
      <div className="p-5 text-center bg-gradient-to-r from-slate-900 to-black">

        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 text-xl font-bold text-black bg-white rounded-full">

          {initials}

        </div>

        <h3 className="font-semibold text-white">
          {}
        </h3>

        <p className="mt-1 text-xs text-gray-300">
        {UserId}
        </p>

      </div>

      {/* MENU ITEMS */}

      <button
        className="flex items-center w-full gap-3 px-5 py-4 text-sm hover:bg-gray-100"
        onClick={() =>
          alert(
            "View Profile Clicked"
          )
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#434343"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
         View Profile

      </button>

      <button
        className="flex items-center w-full gap-3 px-5 py-4 text-sm hover:bg-gray-100"
        onClick={() => setShowResetModal(true)}
      >

        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#434343"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480h80q0 66 25 124.5t68.5 102q43.5 43.5 102 69T480-159q134 0 227-93t93-227q0-134-93-227t-227-93q-89 0-161.5 43.5T204-640h116v80H80v-240h80v80q55-73 138-116.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-80-240q-17 0-28.5-11.5T360-360v-120q0-17 11.5-28.5T400-520v-40q0-33 23.5-56.5T480-640q33 0 56.5 23.5T560-560v40q17 0 28.5 11.5T600-480v120q0 17-11.5 28.5T560-320H400Zm40-200h80v-40q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560v40Z"/></svg>
         Reset Password

      </button>

      <div className="border-t" />

      <button
        onClick={onLogout}
        className="flex items-center w-full gap-3 px-5 py-4 text-sm text-red-600 hover:bg-red-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#434343"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
        Sign Out

      </button>

    </div>

  )}
  </div>
  </div>

                {/*<div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gray-950">
                  {initials}
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg hover:bg-gray-100 inline-flex justify-center items-center gap-2"
                >
                  Sign Out
                  <span><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#434343"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></span>
                </button>

              </div>*/}

            

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
                  className="p-4 bg-white border border-gray-200 cursor-pointer rounded-xl hover:bg-gray-50"
                  onClick={() => setFilter(key)}
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


            {/* TABLE */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">

              {/* HEADER */}
              <div className="grid justify-between grid-cols-2 px-5 py-4 text-xs font-bold tracking-widest text-gray-700 uppercase border-b border-gray-200 md:grid-cols-3 bg-gray-50">
 
                <span>Project ID</span>
                <span className="hidden md:block">Project Name</span>
                <span className="text-right">Status</span>

              </div>

              {/* ROWS */}
              {filtered.length === 0 ? (

                <div className="py-16 text-center text-gray-400">
                  No projects found
                </div>

              ) : (

                filtered.map((project, index) => (
  <React.Fragment key={project.ProjectID}>

    {/* ROW */}
    <div
      className="grid grid-cols-2 px-5 py-4 border-b border-gray-100 cursor-pointer md:grid-cols-3 hover:bg-gray-50"
      onClick={() =>
        setViewDetails(
          viewDetails?.ProjectID === project.ProjectID
            ? null
            : project
        )
      }
    >
      <div className="font-mono text-[12px] text-gray-700">
        {project.ProjectID}
      </div>

      <div className="hidden text-[12px] font-semibold text-gray-900 md:block">
        {project.ProjectName}
      </div>

      <div className="flex items-end justify-end">
        <StatusBadge status={project.ProjectStage} />
      </div>

    </div>

    {/* DETAILS PANEL */}
    {viewDetails?.ProjectID === project.ProjectID && (
      <div className="relative px-6 py-5 border-b bg-slate-50 animate-fade-down">
        <svg className='absolute cursor-pointer top-1 right-2 md:right-12' onClick={() =>
        setViewDetails(
          viewDetails?.ProjectID === project.ProjectID
            ? null
            : project
        )} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="m256-424-56-56 280-280 280 280-56 56-224-223-224 223Z"/></svg>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs text-gray-500">
              Project Manager
            </p>
            <p className="text-xs font-semibold">
              xxxx
            </p>
          </div>

            <div className='md:hidden'>
            <p className="text-xs text-gray-500">
              Project Name
            </p>
            <p className="text-xs font-semibold">
              {project.ProjectName}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Job Identification
            </p>
            <p className="text-xs font-semibold">
              {project.JobIdentification}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Contract ID
            </p>
            <p className="text-xs font-semibold">
              {project.ProjectContractID}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Project Group
            </p>
            <p className="text-xs font-semibold">
              {project.ProjectGroup}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Project Type
            </p>
            <p className="text-xs font-semibold">
              {project.ProjectType}
            </p>
          </div>

        </div>

        <div className="flex gap-3 mt-5">

          <button
          onClick={()=>onViewTime(project.ProjectID)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-black bg-white border border-gray-400 rounded-lg hover:bg-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
            View Time
          </button>

          <button
            onClick={()=>onViewReport(project)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-black border border-gray-200 rounded-lg hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
            View Report
          </button>

        </div>

      </div>
    )}

  </React.Fragment>
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
      <ResetPasswordModal
  isOpen={showResetModal}
  onClose={() => setShowResetModal(false)}
  onSubmit={(data) => {
    handleResetPassword(data); 
  }}
/>

    </div>
  );
}