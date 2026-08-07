import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentsAPI, coursesAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { DEPARTMENTS, ACADEMIC_YEARS, GENDERS } from '../utils/constants';
import Loading from '../components/Loading';
import Page from '../components/Page';

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [studentRes, coursesRes] = await Promise.all([
          studentsAPI.get(id),
          coursesAPI.list(),
        ]);
        setForm({
          ...studentRes.data,
          dateOfBirth: studentRes.data.dateOfBirth
            ? new Date(studentRes.data.dateOfBirth)
                .toISOString()
                .slice(0, 10)
            : '',
        });
        setCourses(coursesRes.data);
      } catch (e) {
        showToast(e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await studentsAPI.update(id, form);
      showToast('Student updated successfully', 'success');
      navigate(`/students/${id}`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <Loading />;
  if (!form) return <div className="empty">Student not found.</div>;

  return (
    <Page
      title="Edit student"
      subtitle={`Updating ${form.fullName}`}
    >
      <div className="card">
        <form className="form-grid" onSubmit={save}>
          <label>
            Student ID
            <input
              required
              value={form.studentId || ''}
              onChange={(e) =>
                setForm({ ...form, studentId: e.target.value })
              }
            />
          </label>
          <label>
            Full name
            <input
              required
              value={form.fullName || ''}
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
              value={form.email || ''}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </label>
          <label>
            Phone
            <input
              required
              value={form.phone || ''}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </label>
          <label>
            Gender
            <select
              value={form.gender || 'Male'}
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
              value={form.dateOfBirth || ''}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </label>
          <label className="full-width">
            Address
            <input
              required
              value={form.address || ''}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </label>
          <label>
            Department
            <select
              value={form.department || ''}
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
              value={form.course || ''}
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
              value={form.academicYear || ''}
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
          <label>
            GPA
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={form.gpa || ''}
              onChange={(e) =>
                setForm({ ...form, gpa: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Status
            <select
              value={form.status || 'active'}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <button className="btn btn-primary full-width">
            Save changes
          </button>
        </form>
      </div>
    </Page>
  );
}
