import React from 'react';

/**
 * Statistics card component.
 * @param {string} label - Card label.
 * @param {string|number} value - Card value.
 * @param {React.ReactNode} icon - Icon element.
 * @param {string} color - 'purple' | 'blue' | 'green' | 'orange'
 * @param {string} trend - Optional trend text.
 */
export default function StatCard({ label, value, icon, color = 'purple', trend }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-content">
        <small>{label}</small>
        <strong>{value}</strong>
        {trend && <span>{trend}</span>}
      </div>
    </div>
  );
}
