import { Router } from 'express';
import Course from '../models/Course.js';

const router = Router();

/**
 * GET /api/v1/courses
 * List all courses with optional search by name, code, or department.
 */
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter).sort({ courseName: 1 });
    res.json(courses);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/courses/:id
 * Get a single course by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/v1/courses
 * Create a new course.
 */
router.post('/', async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/v1/courses/:id
 * Update a course.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/v1/courses/:id
 * Delete a course.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
