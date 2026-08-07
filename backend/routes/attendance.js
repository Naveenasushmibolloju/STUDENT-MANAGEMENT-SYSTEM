import { Router } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const router = Router();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function dayRange(value) {
  if (!datePattern.test(value)) {
    throw Object.assign(new Error('Date must use YYYY-MM-DD format'), { status: 400 });
  }
  const start = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== value) {
    throw Object.assign(new Error('Date is invalid'), { status: 400 });
  }
  return { start, end: new Date(start.getTime() + 86400000) };
}

// GET /api/v1/attendance
// List attendance records with optional filters (date, student, course, status)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.date) {
      const { start, end } = dayRange(req.query.date);
      filter.date = { $gte: start, $lt: end };
    }

    if (req.query.student) {
      if (!mongoose.isValidObjectId(req.query.student)) {
        return res.status(400).json({ message: 'Invalid student id' });
      }
      filter.student = req.query.student;
    }

    if (req.query.course) {
      if (!mongoose.isValidObjectId(req.query.course)) {
        return res.status(400).json({ message: 'Invalid course id' });
      }
      filter.course = req.query.course;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const records = await Attendance.find(filter)
      .populate('student', 'studentId fullName course')
      .populate('course', 'courseName courseCode')
      .sort({ date: -1 });

    res.json(records);
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/attendance/:id
// Get a single attendance record by ID
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid attendance id' });
    }

    const record = await Attendance.findById(req.params.id)
      .populate('student', 'studentId fullName course')
      .populate('course', 'courseName courseCode');

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(record);
  } catch (e) {
    next(e);
  }
});

// POST /api/v1/attendance
// Create or update attendance for a student on a given date
router.post('/', async (req, res, next) => {
  try {
    const { student, date, status, course, remarks } = req.body;

    if (
      !mongoose.isValidObjectId(student) ||
      !['Present', 'Absent', 'Late', 'Excused'].includes(status) ||
      typeof date !== 'string'
    ) {
      return res.status(400).json({
        message: 'Student, valid date, and attendance status are required',
      });
    }

    const { start } = dayRange(date);

    if (!(await Student.exists({ _id: student }))) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updateData = { student, date: start, status };
    if (course && mongoose.isValidObjectId(course)) {
      updateData.course = course;
    }
    if (remarks) {
      updateData.remarks = remarks;
    }

    const record = await Attendance.findOneAndUpdate(
      { student, date: start },
      updateData,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    )
      .populate('student', 'studentId fullName course')
      .populate('course', 'courseName courseCode');

    res.status(201).json(record);
  } catch (e) {
    next(e);
  }
});

// PUT /api/v1/attendance/:id
// Update an existing attendance record
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid attendance id' });
    }

    const { status, course, remarks } = req.body;

    const updateData = {};
    if (status) {
      if (!['Present', 'Absent', 'Late', 'Excused'].includes(status)) {
        return res.status(400).json({ message: 'Invalid attendance status' });
      }
      updateData.status = status;
    }
    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        return res.status(400).json({ message: 'Invalid course id' });
      }
      updateData.course = course;
    }
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('student', 'studentId fullName course')
      .populate('course', 'courseName courseCode');

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(record);
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/attendance/student/:studentId
// Get attendance history for a specific student
router.get('/student/:studentId', async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid student id' });
    }

    if (!(await Student.exists({ _id: studentId }))) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const records = await Attendance.find({ student: studentId })
      .populate('course', 'courseName courseCode')
      .sort({ date: -1 });

    res.json(records);
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/attendance/course/:courseId
// Get attendance report for a specific course
router.get('/course/:courseId', async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const records = await Attendance.find({ course: courseId })
      .populate('student', 'studentId fullName')
      .sort({ date: -1 });

    res.json(records);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/v1/attendance/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid attendance id' });
    }

    if (!(await Attendance.findByIdAndDelete(req.params.id))) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
