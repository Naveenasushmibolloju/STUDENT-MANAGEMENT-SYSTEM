import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';
import Loading from '../components/Loading';
import Page from '../components/Page';

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await coursesAPI.get(id);
        setForm(res.data);
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
      await coursesAPI.update(id, form);
      showToast('Course updated successfully', 'success');
      navigate(`/courses/${id}`);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <Loading />;
  if (!form) return <div className="empty">Course not found.</div>;

  return (
    <Page
      title="Edit course"
      subtitle={`Updating ${form.courseName}`}
    >
      <div className="card">
        <form className="form-grid" onSubmit={save}>
          <label>
            Course name
            <input
              required
              value={form.courseName || ''}
              onChange={(e) =>
                setForm({ ...form, courseName: e.target.value })
              }
            />
          </label>
          <label>
            Course code
            <input
              required
              value={form.courseCode || ''}
              onChange={(e) =>
                setForm({ ...form, courseCode: e.target.value })
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
            Semester
            <select
              value={form.semester || 'Semester 1'}
              onChange={(e) =>
                setForm({ ...form, semester: e.target.value })
              }
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Faculty
            <input
              required
              value={form.faculty || ''}
              onChange={(e) =>
                setForm({ ...form, faculty: e.target.value })
              }
            />
          </label>
          <label>
            Credits
            <input
              type="number"
              min="1"
              max="6"
              required
              value={form.credits || 3}
              onChange={(e) =>
                setForm({ ...form, credits: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Max capacity
            <input
              type="number"
              min="1"
              value={form.maxCapacity || 50}
              onChange={(e) =>
                setForm({ ...form, maxCapacity: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Status
            <select
              value={form.isActive ? 'true' : 'false'}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === 'true' })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
          <label className="full-width">
            Description
            <textarea
              value={form.description || ''}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional course description..."
            />
          </label>
          <button className="btn btn-primary full-width">
            Save changes
          </button>
        </form>
      </div>
    </Page>
  );
}
