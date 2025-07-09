// src/components/ReportList.js
import React from 'react';
import ReportCard from './ReportCard';

const reports = [
  // Mock data, reemplaza por datos reales
  { id: 1, status: 'Active', title: 'Report on Vandalism', date: '2024-01-15', image: '/img1.jpg' },
  { id: 2, status: 'Pending', title: 'Report on Theft', date: '2024-02-20', image: '/img2.jpg' },
  { id: 3, status: 'Completed', title: 'Report on Assault', date: '2024-03-10', image: '/img3.jpg' },
];

export default function ReportList() {
  return (
    <div>
      {reports.map(report => (
        <ReportCard key={report.id} {...report} />
      ))}
    </div>
  );
}