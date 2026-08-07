import React from 'react';

/**
 * Loading spinner component.
 * @param {string} message - Optional message to display.
 */
export default function Loading({ message = 'Loading your workspace…' }) {
  return (
    <div className="loading">
      <div className="loader" />
      <span>{message}</span>
    </div>
  );
}
