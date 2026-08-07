import React from 'react';
import { X } from 'lucide-react';

/**
 * Modal dialog component.
 * @param {string} title - Modal title.
 * @param {function} onClose - Close handler.
 * @param {React.ReactNode} children - Modal content.
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function Modal({ title, onClose, children, size = 'md' }) {
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }[size];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span className="section-kicker">NEW RECORD</span>
            <h3>{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
