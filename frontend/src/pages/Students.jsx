import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentsAPI, coursesAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import Page from '../components/Page';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import StudentAvatar from '../components/StudentAvatar';
import Loading from '../components/Loading';
import { DEPARTMENTS, ACADEMIC_YEARS, GENDERS } from '../utils/constants';

const emptyStudent = {
  studentId: '',
  fullName: '',
  email: '',
  phone: '',
  gender: 'Male',
  dateOfBirth: '',
  address: '',
  department: '',
  course: '',
  academicYear: '2026-2027',
};

export default function Students() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyStudent);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        studentsAPI.list({ search }),
        coursesAPI.list(),
      ]);
      setItems(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await studentsAPI.create(form);
      showToast('Student added successfully', 'success');
      setForm(emptyStudent);
      setShowModal(false);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const remove = async (id) => {
    if (window.confirm('Delete this student?')) {
      try {
        await studentsAPI.delete(id);
        showToast('Student deleted', 'success');
        load();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <Page
      title="Students"
      subtitle="Manage enrollment records and student profiles."
      action={
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add student
        </button>
      }
    >
      <SearchBox
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, ID, course or department…"
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Department</th>
              <th>Course</th>
              <th>Academic year</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="student-cell">
                    <StudentAvatar name={s.fullName} variant="pastel" />
                    <span>
                      <b>{s.fullName}</b>
                      <small>{s.email}</small>
                    </span>
                  </div>
                </td>
                <td>{s.studentId}</td>
                <td>{s.department}</td>
                <td>{s.course}</td>
                <td>
                  <span className="pill">{s.academicYear}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Link
                      to={`/students/${s._id}`}
                      title="View details"
                    >
                      <Eye size={16} style={{ color: '#64748b' }} />
                    </Link>
                    <Link
                      to={`/students/${s._id}/edit`}
                      title="Edit"
                    >
                      <Edit size={16} style={{ color: '#64748b' }} />
                    </Link>
                    <button
                      className="danger-link"
                      onClick={() => remove(s._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={32} />
            </div>
            <h3>No students found</h3>
            <p>Try adjusting your search or add a new student.</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Add student"
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <form className="form-grid" onSubmit={save}>
            <label>
              Student ID
              <input
                required
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
              />
            </label>
            <label>
              Full name
              <input
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </label>
            <label>
              Gender
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date of birth
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
              />
            </label>
            <label className="full-width">
              Address
              <input
                required
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </label>
            <label>
              Department
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Course
              <select
                value={form.course}
                onChange={(e) =>
                  setForm({ ...form, course: e.target.value })
                }
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c.courseName}>
                    {c.courseName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Academic year
              <select
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary full-width">
              Save student
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
