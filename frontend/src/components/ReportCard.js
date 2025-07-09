// src/components/ReportCard.js
import React from 'react';

export default function ReportCard({ status, title, date, image }) {
  return (
    <div className="report-card">
      <div className="report-info">
        <div className="report-status">Status: {status}</div>
        <div className="report-title"><b>{title}</b></div>
        <div className="report-date">Submitted: {date}</div>
        <button className="btn-details">View Details</button>
      </div>
      <div className="report-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
}