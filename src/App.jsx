import { useState } from 'react';

import LoginPage from './pages/LoginPage';

import ProjectMasterPage
from './pages/ProjectMasterPage';

import ProjectReportPage
from './pages/ProjectReportPage';

export default function App() {

  // login | projects | report
  const [page, setPage] =
    useState('login');

  const [selectedProject,
  setSelectedProject] =
    useState(null);

  // LOGIN
  const handleLogin = () => {

    setPage('projects');
  };

  // VIEW REPORT
  const handleViewReport = (
    project
  ) => {

    setSelectedProject(project);

    setPage('report');
  };

  // BACK BUTTON
  const handleBack = () => {

    setSelectedProject(null);

    setPage('projects');
  };

  // LOGOUT
  const handleLogout = () => {

    setSelectedProject(null);

    setPage('login');
  };

  // LOGIN PAGE
  if (page === 'login') {

    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  // PROJECT LIST PAGE
  if (page === 'projects') {

    return (

      <ProjectMasterPage
        onLogout={handleLogout}
        onViewReport={
          handleViewReport
        }
      />

    );
  }

  // REPORT PAGE
  if (page === 'report') {

    return (

      <ProjectReportPage
        selectedProject={
          selectedProject
        }
        onBack={handleBack}
      />

    );
  }

  return null;
}