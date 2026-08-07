import React from 'react';

/**
 * Filter bar component with dropdowns and inputs.
 * @param {object} filters - Current filter values.
 * @param {function} onChange - Change handler for filters.
 * @param {array} options - Array of { key, label, options } for dropdowns.
 */
export default function FilterBar({ filters, onChange, fields }) {
  return (
    <div className="filter-bar">
      {fields.map((field) => (
        <div className="filter-group" key={field.key}>
          <label>{field.label}</label>
          {field.type === 'select' ? (
            <select
              value={filters[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="">All</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={filters[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder || field.label}
            />
          )}
        </div>
      ))}
    </div>
  );
}
