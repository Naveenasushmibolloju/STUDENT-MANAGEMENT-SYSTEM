import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react';
import { studentsAPI, attendanceAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { formatDate } from '../utils/formatDate';
import Loading from '../components/Loading';
import StudentAvatar from '../components/StudentAvatar';
import Page from '../components/Page';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [studentRes, attendanceRes] = await Promise.all([
          studentsAPI.get(id),
          attendanceAPI.studentHistory(id),
        ]);
        setStudent(studentRes.data);
        setAttendance(attendanceRes.data);
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
    if (window.confirm('Delete this student?')) {
      try {
        await studentsAPI.delete(id);
        showToast('Student deleted', 'success');
        navigate('/students');
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  };

  if (loading) return <Loading />;
  if (!student) return <div className="empty">Student not found.</div>;

  const presentCount = attendance.filter(
    (a) => a.status === 'Present'
  ).length;
  const absentCount = attendance.filter(
    (a) => a.status === 'Absent'
  ).length;
  const total = attendance.length;
  const attendanceRate =
    total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <Page
      title={student.fullName}
      subtitle={`Student ID: ${student.studentId}`}
      action={
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to={`/students/${student._id}/edit`}
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
      {/* Student Info */}
      <div className="detail-grid">
        <div className="card">
          <div className="card-header">
            <h3>Personal information</h3>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full name</label>
              <div className="value">{student.fullName}</div>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <div className="value">{student.email}</div>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <div className="value">{student.phone}</div>
            </div>
            <div className="detail-item">
              <label>Gender</label>
              <div className="value">{student.gender}</div>
            </div>
            <div className="detail-item">
              <label>Date of birth</label>
              <div className="value">
                {formatDate(student.dateOfBirth)}
              </div>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <div className="value">{student.address}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Academic information</h3>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Student ID</label>
              <div className="value">{student.studentId}</div>
            </div>
            <div className="detail-item">
              <label>Department</label>
              <div className="value">{student.department}</div>
            </div>
            <div className="detail-item">
              <label>Course</label>
              <div className="value">{student.course}</div>
            </div>
            <div className="detail-item">
              <label>Academic year</label>
              <div className="value">{student.academicYear}</div>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <div className="value">
                <span className="pill">
                  {student.status || 'active'}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <label>GPA</label>
              <div className="value">
                {student.gpa || '0.0'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="section-kicker">ATTENDANCE</span>
            <h3>Attendance history</h3>
            <p>
              {presentCount} present, {absentCount} absent out of{' '}
              {total} records · {attendanceRate}% attendance rate
            </p>
          </div>
        </div>

        {attendance.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Course</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a._id}>
                    <td>{formatDate(a.date)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          a.status === 'Present'
                            ? 'present'
                            : 'absent'
                        }`}
                      >
                        <i />
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.course?.courseName || '—'}
                    </td>
                    <td>{a.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <ClipboardCheck size={32} />
            </div>
            <h3>No attendance records</h3>
            <p>
              No attendance has been recorded for this student yet.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
