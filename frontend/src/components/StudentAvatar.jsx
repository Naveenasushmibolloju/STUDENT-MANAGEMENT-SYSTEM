import React from 'react';

/**
 * Avatar component that displays initials from a name.
 * @param {string} name - Full name.
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} variant - 'default' | 'pastel' | 'teal'
 */
export default function StudentAvatar({ name, size = 'md', variant = 'default' }) {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'A';

  const sizeClass = {
    sm: 'sm',
    md: '',
    lg: '',
  }[size];

  const variantClass = {
    default: '',
    pastel: 'pastel',
    teal: 'teal',
  }[variant];

  return (
    <div className={`avatar ${sizeClass} ${variantClass}`.trim()}>
      {initials}
    </div>
  );
}
