import { Router } from 'express';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

const router = Router();

/**
 * GET /api/v1/students
 * List students with optional search and filters.
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, department, course } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) filter.department = department;
    if (course) filter.course = course;

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/students/:id
 * Get a single student by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/v1/students
 * Create a new student.
 */
router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/v1/students/:id
 * Update a student.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/v1/students/:id
 * Delete a student and their attendance records.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await Attendance.deleteMany({ student: student._id });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
