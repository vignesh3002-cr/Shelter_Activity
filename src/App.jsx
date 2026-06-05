import { useState } from 'react';

import LoginPage from './pages/LoginPage';

import ProjectMasterPage
from './pages/ProjectMasterPage';

import ProjectReportPage
from './pages/ProjectReportPage';
import TimeManagementPage from './pages/TimeManagement';

export default function App() {
  const[LoginValue,setLoginValue] = useState(null);
  // login | projects | report
  const [page, setPage] =
    useState('login');
  const[selectedProjectID,
  setSelectedProjectID] =
    useState(null);

  const [selectedProject,
  setSelectedProject] =
    useState(null);

  // LOGIN
  const handleLogin = (value) => {

    setLoginValue(value);
    setPage('projects');
  };

  // VIEW REPORT
  const handleViewReport = (
    project
  ) => {

    setSelectedProject(project);

    setPage('report');
  };
  const handleViewTime = (projectID) => {
    setSelectedProjectID(projectID);
    setPage('time');
  };
  // BACK BUTTON
  const handleBack = () => {

    setSelectedProject(null);
    setSelectedProjectID(null);

    setPage('projects');
  };

  // LOGOUT
  const handleLogout = () => {

    setSelectedProject(null);
    setSelectedProjectID(null);

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
        LoginValue={LoginValue}
        onViewReport={
          handleViewReport
        }
        onViewTime={handleViewTime}
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

  if (page === 'time') {

    return (

      <TimeManagementPage
        selectedProjectID={
          selectedProjectID
        }
        onBack={handleBack}
      />

    );
  }

  return null;
}