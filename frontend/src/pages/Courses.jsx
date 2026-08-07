import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coursesAPI, studentsAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import Page from '../components/Page';
import SearchBox from '../components/SearchBox';
import Modal from '../components/Modal';
import CourseCard from '../components/CourseCard';
import Loading from '../components/Loading';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';

const emptyCourse = {
  courseName: '',
  courseCode: '',
  department: '',
  semester: 'Semester 1',
  faculty: '',
  credits: 3,
  description: '',
};

export default function Courses() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyCourse);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        coursesAPI.list({ search }),
        studentsAPI.list(),
      ]);
      setItems(coursesRes.data);
      setStudents(studentsRes.data);
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
      await coursesAPI.create(form);
      showToast('Course added successfully', 'success');
      setForm(emptyCourse);
      setShowModal(false);
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const remove = async (id) => {
    if (window.confirm('Delete this course?')) {
      try {
        await coursesAPI.delete(id);
        showToast('Course deleted', 'success');
        load();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <Page
      title="Courses"
      subtitle={`${items.length} courses across your academic departments.`}
      action={
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add course
        </button>
      }
    >
      <SearchBox
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses by name, code, or department…"
      />

      <div className="course-grid">
        {items.map((c, index) => {
          const enrolled = students.filter(
            (s) => s.course === c.courseName
          ).length;
          return (
            <CourseCard
              key={c._id}
              course={c}
              index={index}
              enrolledCount={enrolled}
              onDelete={remove}
            />
          );
        })}
        {!items.length && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={32} />
            </div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or add a new course.</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Add course"
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <form className="form-grid" onSubmit={save}>
            <label>
              Course name
              <input
                required
                value={form.courseName}
                onChange={(e) =>
                  setForm({ ...form, courseName: e.target.value })
                }
              />
            </label>
            <label>
              Course code
              <input
                required
                value={form.courseCode}
                onChange={(e) =>
                  setForm({ ...form, courseCode: e.target.value })
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
              Semester
              <select
                value={form.semester}
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
                value={form.faculty}
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
                value={form.credits}
                onChange={(e) =>
                  setForm({ ...form, credits: Number(e.target.value) })
                }
              />
            </label>
            <label className="full-width">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional course description..."
              />
            </label>
            <button className="btn btn-primary full-width">
              Save course
            </button>
          </form>
        </Modal>
      )}
    </Page>
  );
}
