import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Trash2 } from 'lucide-react';
import { studentsAPI, attendanceAPI, coursesAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { formatDate } from '../utils/formatDate';
import { ATTENDANCE_STATUS } from '../utils/constants';
import Loading from '../components/Loading';
import StudentAvatar from '../components/StudentAvatar';
import Page from '../components/Page';
import FilterBar from '../components/FilterBar';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    student: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
  });
  const [filters, setFilters] = useState({
    date: '',
    student: '',
    course: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const [studentsRes, coursesRes, attendanceRes] = await Promise.all([
        studentsAPI.list(),
        coursesAPI.list(),
        attendanceAPI.list(filters),
      ]);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setItems(attendanceRes.data);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.create(form);
      showToast('Attendance marked successfully', 'success');
      setForm({
        student: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'Present',
      });
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const remove = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      try {
        await attendanceAPI.delete(id);
        showToast('Attendance record deleted', 'success');
        load();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterFields = [
    { key: 'date', label: 'Date', type: 'date' },
    {
      key: 'student',
      label: 'Student',
      type: 'select',
      options: students.map((s) => ({
        value: s._id,
        label: s.fullName,
      })),
    },
    {
      key: 'course',
      label: 'Course',
      type: 'select',
      options: courses.map((c) => ({
        value: c._id,
        label: c.courseName,
      })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ATTENDANCE_STATUS.map((s) => ({ value: s, label: s })),
    },
  ];

  if (loading) return <Loading />;

  return (
    <Page
      title="Attendance"
      subtitle="Record and review student presence with confidence."
    >
      {/* Attendance Form */}
      <div className="attendance-form">
        <form onSubmit={save}>
          <label>
            Student
            <select
              required
              value={form.student}
              onChange={(e) =>
                setForm({ ...form, student: e.target.value })
              }
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
            {ATTENDANCE_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            </select>
          </label>
          <button className="btn btn-primary">Mark attendance</button>
        </form>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        fields={filterFields}
      />

      {/* Attendance List */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Status</th>
              <th>Course</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id}>
                <td>
                  <div className="student-cell">
                    <StudentAvatar
                      name={a.student?.fullName}
                      variant="teal"
                    />
                    <span>
                      <b>{a.student?.fullName || 'Unknown'}</b>
                      <small>{a.student?.studentId}</small>
                    </span>
                  </div>
                </td>
                <td>{formatDate(a.date)}</td>
                <td>
                  <span
                    className={`status-badge ${
                      a.status === 'Present'
                        ? 'present'
                        : a.status === 'Absent'
                        ? 'absent'
                        : a.status === 'Late'
                        ? 'late'
                        : 'excused'
                    }`}
                  >
                    <i />
                    {a.status}
                  </span>
                </td>
                <td>{a.course?.courseName || '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="danger-link"
                    onClick={() => remove(a._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <div className="empty-state">
            <div className="empty-icon">
              <ClipboardCheck size={32} />
            </div>
            <h3>No attendance records</h3>
            <p>
              No attendance records match your current filters.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
