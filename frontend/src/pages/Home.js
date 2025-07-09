// src/pages/Home.js
import React from 'react';
import ReportList from '../components/ReportList';
import ReportForm from '../components/ReportForm';
import AlertLogo from '../components/AlertLogo';

export default function Home() {
  return (
    <div className="main-layout">
      <div className="left-column">
        <h2>Crime Reports</h2>
        <ReportList />
      </div>
      <div className="right-column">
        <h2>Create New Report</h2>
        <ReportForm />
      </div>
      <AlertLogo />
    </div>
  );
}