import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Users, BookOpen, Calendar, Clock } from 'lucide-react';
import { coursesAPI, studentsAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { formatDate } from '../utils/formatDate';
import Loading from '../components/Loading';
import StudentAvatar from '../components/StudentAvatar';
import Page from '../components/Page';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, studentsRes] = await Promise.all([
          coursesAPI.get(id),
          studentsAPI.list(),
        ]);
        setCourse(courseRes.data);
        setStudents(studentsRes.data);
      } catch (e) {
        showToast(e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const remove = async () => {
    if (window.confirm('Delete this course?')) {
      try {
        await coursesAPI.delete(id);
        showToast('Course deleted', 'success');
        navigate('/courses');
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  if (loading) return <Loading />;
  if (!course) return <div className="empty">Course not found.</div>;

  const enrolledStudents = students.filter(
    (s) => s.course === course.courseName
  );

  return (
    <Page
      title={course.courseName}
      subtitle={`Course code: ${course.courseCode}`}
      action={
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to={`/courses/${course._id}/edit`}
            className="btn btn-secondary"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button className="btn btn-danger" onClick={remove}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      }
    >
      {/* Course Info */}
      <div className="detail-grid">
        <div className="card">
          <div className="card-header">
            <h3>Course information</h3>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Course name</label>
              <div className="value">{course.courseName}</div>
            </div>
            <div className="detail-item">
              <label>Course code</label>
              <div className="value">{course.courseCode}</div>
            </div>
            <div className="detail-item">
              <label>Department</label>
              <div className="value">{course.department}</div>
            </div>
            <div className="detail-item">
              <label>Semester</label>
              <div className="value">{course.semester}</div>
            </div>
            <div className="detail-item">
              <label>Faculty</label>
              <div className="value">{course.faculty}</div>
            </div>
            <div className="detail-item">
              <label>Credits</label>
              <div className="value">{course.credits}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Schedule & enrollment</h3>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Max capacity</label>
              <div className="value">
                {course.maxCapacity || 50}
              </div>
            </div>
            <div className="detail-item">
              <label>Enrolled</label>
              <div className="value">
                {enrolledStudents.length} student
                {enrolledStudents.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <div className="value">
                <span className="pill">
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <label>Schedule</label>
              <div className="value">
                {course.schedule?.days?.join(', ') || 'Not set'}
              </div>
            </div>
            <div className="detail-item">
              <label>Time</label>
              <div className="value">
                {course.schedule?.startTime && course.schedule?.endTime
                  ? `${course.schedule.startTime} - ${course.schedule.endTime}`
                  : 'Not set'}
              </div>
            </div>
            <div className="detail-item">
              <label>Room</label>
              <div className="value">
                {course.schedule?.room || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="section-kicker">ENROLLED STUDENTS</span>
            <h3>
              {enrolledStudents.length} enrolled student
              {enrolledStudents.length === 1 ? '' : 's'}
            </h3>
            <p>
              Students currently enrolled in this course.
            </p>
          </div>
        </div>

        {enrolledStudents.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Academic year</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="student-cell">
                        <StudentAvatar
                          name={s.fullName}
                          variant="pastel"
                        />
                        <span>
                          <b>{s.fullName}</b>
                          <small>{s.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>{s.studentId}</td>
                    <td>{s.department}</td>
                    <td>{s.academicYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={32} />
            </div>
            <h3>No enrolled students</h3>
            <p>
              No students are currently enrolled in this course.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
