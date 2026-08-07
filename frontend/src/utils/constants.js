/**
 * Application constants.
 */

export const DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Business Administration',
  'Electronics',
  'Humanities',
  'Commerce',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

export const ACADEMIC_YEARS = [
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
  '2028-2029',
];

export const GENDERS = ['Male', 'Female', 'Other'];

export const ATTENDANCE_STATUS = ['Present', 'Absent', 'Late', 'Excused'];

export const STATUS_COLORS = {
  Present: 'present',
  Absent: 'absent',
  Late: 'late',
  Excused: 'excused',
};

export const STATUS_BG = {
  present: 'bg-success-100 text-success-700',
  absent: 'bg-accent-100 text-accent-700',
  late: 'bg-amber-100 text-amber-700',
  excused: 'bg-secondary-100 text-secondary-700',
};

export const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: 'LayoutDashboard' },
  { to: '/students', label: 'Students', icon: 'Users' },
  { to: '/courses', label: 'Courses', icon: 'BookOpen' },
  { to: '/attendance', label: 'Attendance', icon: 'ClipboardCheck' },
  { to: '/profile', label: 'Profile', icon: 'User' },
];
