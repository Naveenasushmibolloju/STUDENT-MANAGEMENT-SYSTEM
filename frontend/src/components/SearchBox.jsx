import React from 'react';
import { Search } from 'lucide-react';

/**
 * Search input component.
 * @param {string} value - Current search value.
 * @param {function} onChange - Change handler.
 * @param {string} placeholder - Placeholder text.
 */
export default function SearchBox({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-box">
      <Search size={19} />
      <input
        className="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
