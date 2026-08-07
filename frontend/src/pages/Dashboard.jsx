import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  ArrowUpRight,
  CalendarDays,
  Plus,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api';
import { useToast } from '../components/ToastContainer';
import { formatDate } from '../utils/formatDate';
import Loading from '../components/Loading';
import StatCard from '../components/StatCard';
import StudentAvatar from '../components/StudentAvatar';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#ea580c', // Burnt Orange
  '#c2410c', // Deep Burnt Orange
  '#db2777', // Deep Pink
  '#be185d', // Deep Ruby
  '#dc2626', // Deep Crimson
  '#991b1b', // Deep Burgundy
  '#d4af37', // Rich Gold
  '#b48a1f', // Dark Gold
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      dashboardAPI.stats().then((res) => setStats(res.data)),
      dashboardAPI.charts().then((res) => setCharts(res.data)),
    ])
      .catch(() => {
        showToast('Failed to load dashboard data', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <Loading />;

  const today = formatDate(new Date(), { weekday: true });

  const departmentData = charts?.departmentDistribution
    ?.map((d) => ({ name: d._id, value: d.count })) || [];

  const statusData = charts?.attendanceByStatus
    ?.map((d) => ({ name: d._id, value: d.count })) || [];

  const trendData = charts?.attendanceTrend
    ?.map((d) => ({
      date: d._id.date.slice(5),
      Present: d.present,
      Absent: d.absent,
    })) || [];

  return (
    <>
      {/* Welcome Hero */}
      <div className="hero">
        <div>
          <span className="eyebrow">{today}</span>
          <h1>
            Campus <span>overview</span>
          </h1>
          <p>
            {stats.totalStudents} students, {stats.totalCourses} courses,
            and {stats.present} students present today.
          </p>
        </div>
        <div className="hero-actions">
          <div className="hero-date">
            <CalendarDays size={18} />
            <span>
              Academic year
              <br />
              <b>2026–27</b>
            </span>
          </div>
          <Link className="btn btn-primary" to="/students">
            <Plus size={18} />
            Add student
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total students"
          value={stats.totalStudents}
          icon={<Users size={22} />}
          color="purple"
          trend="Active learners"
        />
        <StatCard
          label="Total courses"
          value={stats.totalCourses}
          icon={<BookOpen size={22} />}
          color="blue"
          trend="Across departments"
        />
        <StatCard
          label="Attendance records"
          value={stats.totalAttendance}
          icon={<ClipboardCheck size={22} />}
          color="green"
          trend="Recorded to date"
        />
        <StatCard
          label="Present today"
          value={stats.present}
          icon={<ArrowUpRight size={22} />}
          color="orange"
          trend="Campus activity"
        />
      </div>

      {/* Charts */}
      {charts && (
        <div className="chart-grid">
          <div className="chart-container">
            <h3>
              <BarChart3 size={18} /> Department distribution
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {departmentData.map((_, i) => (
                    <Cell
                      key={`bar-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>
              <PieChart size={18} /> Attendance status
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {statusData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="chart-grid">
        {/* Recent Students */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-kicker">STUDENTS</span>
              <h3>Recent enrollments</h3>
              <p>New students added to your campus.</p>
            </div>
            <Link to="/students">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {stats.recentStudents.map((s) => (
            <div className="list-row" key={s._id}>
              <StudentAvatar name={s.fullName} variant="pastel" />
              <div>
                <b>{s.fullName}</b>
                <small>
                  {s.studentId} · {s.department}
                </small>
              </div>
              <span className="pill">{s.academicYear}</span>
            </div>
          ))}
          {!stats.recentStudents.length && (
            <div className="empty">No students yet.</div>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="section-kicker">ATTENDANCE</span>
              <h3>Latest attendance</h3>
              <p>Recent student attendance records.</p>
            </div>
            <Link to="/attendance">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {stats.recentAttendance.map((a) => (
            <div className="list-row" key={a._id}>
              <StudentAvatar
                name={a.student?.fullName}
                variant="teal"
              />
              <div>
                <b>{a.student?.fullName || 'Unknown'}</b>
                <small>{formatDate(a.date)}</small>
              </div>
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
            </div>
          ))}
          {!stats.recentAttendance.length && (
            <div className="empty">No attendance records yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
