import React from 'react';

/**
 * Page wrapper component with header and action button.
 * @param {string} title - Page title.
 * @param {string} subtitle - Page subtitle.
 * @param {React.ReactNode} action - Action button/element.
 * @param {React.ReactNode} children - Page content.
 */
export default function Page({ title, subtitle, action, children }) {
  return (
    <>
      <div className="page-head">
        <div className="head-text">
          <span className="eyebrow">CAMPUS WORKSPACE</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </>
  );
}
