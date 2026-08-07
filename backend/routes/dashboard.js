import { Router } from 'express';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';

const router = Router();

/**
 * Helper: build a UTC day range for a given YYYY-MM-DD string.
 */
function dayRange(value) {
  const start = new Date(`${value}T00:00:00.000Z`);
  return { start, end: new Date(start.getTime() + 86400000) };
}

/**
 * GET /api/v1/dashboard/
 * GET /api/v1/dashboard/stats
 * Returns dashboard summary statistics.
 */
async function getStats(req, res, next) {
  try {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 86400000);
    const today = { date: { $gte: start, $lt: end } };

    const [
      totalStudents,
      totalCourses,
      totalAttendance,
      present,
      absent,
      presentToday,
      absentToday,
      recentStudents,
      recentAttendance,
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Attendance.countDocuments(),
      Attendance.countDocuments({ status: 'Present' }),
      Attendance.countDocuments({ status: 'Absent' }),
      Attendance.countDocuments({ ...today, status: 'Present' }),
      Attendance.countDocuments({ ...today, status: 'Absent' }),
      Student.find().sort({ createdAt: -1 }).limit(5),
      Attendance.find()
        .populate('student', 'studentId fullName')
        .sort({ date: -1 })
        .limit(5),
    ]);

    res.json({
      totalStudents,
      totalCourses,
      totalAttendance,
      present,
      absent,
      presentToday,
      absentToday,
      recentStudents,
      recentAttendance,
    });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/v1/dashboard/recent
 * Returns the most recently added students and attendance records.
 */
async function getRecent(req, res, next) {
  try {
    const [recentStudents, recentAttendance] = await Promise.all([
      Student.find().sort({ createdAt: -1 }).limit(5),
      Attendance.find()
        .populate('student', 'studentId fullName')
        .sort({ date: -1 })
        .limit(5),
    ]);

    res.json({ recentStudents, recentAttendance });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/v1/dashboard/charts
 * Returns data for dashboard charts (department distribution, attendance trend).
 */
async function getCharts(req, res, next) {
  try {
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const courseStats = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const statusStats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Attendance trend for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const attendanceTrend = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    res.json({
      departmentDistribution: departmentStats,
      courseEnrollment: courseStats,
      attendanceByStatus: statusStats,
      attendanceTrend,
    });
  } catch (e) {
    next(e);
  }
}

router.get('/', getStats);
router.get('/stats', getStats);
router.get('/recent', getRecent);
router.get('/charts', getCharts);

export default router;
