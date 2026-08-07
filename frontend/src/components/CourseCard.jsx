import React from 'react';
import { BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Course card component for displaying course information.
 * @param {object} course - Course object.
 * @param {number} index - Index for color variant.
 * @param {number} enrolledCount - Number of enrolled students.
 * @param {function} onDelete - Delete handler.
 */
export default function CourseCard({ course, index, enrolledCount, onDelete }) {
  const colorVariant = `course-${(index % 3) + 1}`;

  return (
    <div className={`course-card ${colorVariant}`}>
      <div className="course-top">
        <span className="course-code">{course.courseCode}</span>
        <button
          className="danger-link"
          onClick={() => onDelete(course._id)}
          title="Delete course"
        >
          Delete
        </button>
      </div>

      <div className="course-icon">
        <BookOpen size={20} />
      </div>

      <Link to={`/courses/${course._id}`}>
        <h3>{course.courseName}</h3>
      </Link>

      <p>{course.department} · {course.semester}</p>

      <div className="course-enrollment">
        <Users size={15} />
        <span>{enrolledCount} enrolled student{enrolledCount === 1 ? '' : 's'}</span>
      </div>

      <div className="course-meta">
        <span>{course.faculty}</span>
        <b>{course.credits} credits</b>
      </div>
    </div>
  );
}
