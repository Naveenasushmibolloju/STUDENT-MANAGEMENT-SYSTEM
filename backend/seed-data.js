import Student from './models/Student.js';
import Course from './models/Course.js';
import Attendance from './models/Attendance.js';
import User from './models/User.js';

const firstNames = ['Aarav', 'Aanya', 'Arjun', 'Anaya', 'Vihaan', 'Diya', 'Kabir', 'Ishita', 'Reyansh', 'Meera', 'Aditya', 'Riya', 'Vivaan', 'Saanvi', 'Kian', 'Myra', 'Rohan', 'Kiara', 'Dhruv', 'Anika'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Mehta', 'Iyer', 'Das', 'Joshi'];

const courses = [
  { courseName: 'BSc Computer Science', courseCode: 'CS101', department: 'Computer Science', semester: 'Semester 1', faculty: 'Dr. Priya Mehta', credits: 4, description: 'Core computer science fundamentals' },
  { courseName: 'BSc Software Engineering', courseCode: 'SE102', department: 'Computer Science', semester: 'Semester 2', faculty: 'Dr. Arjun Menon', credits: 4, description: 'Software design and development' },
  { courseName: 'BSc Data Structures & Algorithms', courseCode: 'CS201', department: 'Computer Science', semester: 'Semester 2', faculty: 'Prof. Neha Rao', credits: 4, description: 'Advanced data structures' },
  { courseName: 'BSc Database Systems', courseCode: 'CS301', department: 'Computer Science', semester: 'Semester 3', faculty: 'Dr. Kavita Iyer', credits: 3, description: 'Database design and management' },
  { courseName: 'BSc Machine Learning', courseCode: 'CS401', department: 'Computer Science', semester: 'Semester 4', faculty: 'Dr. Vikram Shah', credits: 4, description: 'Introduction to ML and AI' },
  { courseName: 'BSc Web Development', courseCode: 'CS302', department: 'Computer Science', semester: 'Semester 3', faculty: 'Prof. Sandeep Rao', credits: 3, description: 'Full-stack web development' },
  { courseName: 'BSc Operating Systems', courseCode: 'CS202', department: 'Computer Science', semester: 'Semester 2', faculty: 'Dr. Meera Nair', credits: 3, description: 'OS concepts and systems programming' },
  { courseName: 'BSc Computer Networks', courseCode: 'CS303', department: 'Computer Science', semester: 'Semester 3', faculty: 'Prof. Anusha Das', credits: 3, description: 'Network protocols and architecture' },
  { courseName: 'BSc Cybersecurity', courseCode: 'CS402', department: 'Computer Science', semester: 'Semester 4', faculty: 'Dr. Rohan Gupta', credits: 4, description: 'Security principles and practices' },
  { courseName: 'BSc Mobile App Development', courseCode: 'CS403', department: 'Computer Science', semester: 'Semester 4', faculty: 'Prof. Nitin Shah', credits: 3, description: 'Android and iOS development' },
  { courseName: 'BBA Finance', courseCode: 'BA201', department: 'Business Administration', semester: 'Semester 2', faculty: 'Prof. Rahul Verma', credits: 4, description: 'Corporate finance and investment' },
  { courseName: 'BBA Marketing', courseCode: 'BA202', department: 'Business Administration', semester: 'Semester 3', faculty: 'Prof. Anjali Kapoor', credits: 4, description: 'Marketing principles and strategy' },
  { courseName: 'BBA Human Resources', courseCode: 'BA301', department: 'Business Administration', semester: 'Semester 3', faculty: 'Dr. Sunita Rao', credits: 3, description: 'HR management and organizational behavior' },
  { courseName: 'BBA Business Analytics', courseCode: 'BA401', department: 'Business Administration', semester: 'Semester 4', faculty: 'Prof. Manoj Patel', credits: 4, description: 'Data-driven business decision making' },
  { courseName: 'BSc Data Science', courseCode: 'DS301', department: 'Data Science', semester: 'Semester 3', faculty: 'Dr. Neha Rao', credits: 5, description: 'Statistical analysis and data mining' },
  { courseName: 'BSc Artificial Intelligence', courseCode: 'AI302', department: 'Data Science', semester: 'Semester 4', faculty: 'Dr. Kavita Iyer', credits: 5, description: 'AI search and reasoning' },
  { courseName: 'BSc Big Data Analytics', courseCode: 'DS401', department: 'Data Science', semester: 'Semester 4', faculty: 'Prof. Deepak Kumar', credits: 4, description: 'Hadoop, Spark, and big data tools' },
  { courseName: 'BTech Electronics', courseCode: 'EC401', department: 'Electronics', semester: 'Semester 4', faculty: 'Dr. Vikram Shah', credits: 4, description: 'Electronic circuits and devices' },
  { courseName: 'BTech Embedded Systems', courseCode: 'EC402', department: 'Electronics', semester: 'Semester 5', faculty: 'Prof. Sandeep Rao', credits: 4, description: 'Microcontrollers and embedded design' },
  { courseName: 'BTech Digital Signal Processing', courseCode: 'EC501', department: 'Electronics', semester: 'Semester 5', faculty: 'Dr. Meera Nair', credits: 3, description: 'DSP fundamentals and applications' },
  { courseName: 'BA English Literature', courseCode: 'EL101', department: 'Humanities', semester: 'Semester 1', faculty: 'Dr. Meera Nair', credits: 3, description: 'Classical and modern literature' },
  { courseName: 'BA Psychology', courseCode: 'PS201', department: 'Humanities', semester: 'Semester 2', faculty: 'Dr. Anusha Das', credits: 3, description: 'Introduction to psychology' },
  { courseName: 'BA Sociology', courseCode: 'SO201', department: 'Humanities', semester: 'Semester 2', faculty: 'Prof. Rohan Gupta', credits: 3, description: 'Societal structures and analysis' },
  { courseName: 'BCom Accounting', courseCode: 'CO101', department: 'Commerce', semester: 'Semester 1', faculty: 'Prof. Rohan Gupta', credits: 4, description: 'Financial accounting principles' },
  { courseName: 'BCom Banking and Insurance', courseCode: 'CO202', department: 'Commerce', semester: 'Semester 3', faculty: 'Prof. Nitin Shah', credits: 4, description: 'Banking operations and insurance' },
  { courseName: 'BCom Taxation', courseCode: 'CO301', department: 'Commerce', semester: 'Semester 3', faculty: 'Dr. Sunita Rao', credits: 3, description: 'Direct and indirect taxation' },
];

export async function seedDemoData() {
  // Seed courses
  for (const course of courses) {
    await Course.updateOne({ courseCode: course.courseCode }, { $set: course }, { upsert: true });
  }

  // Seed 50 students
  const students = [];
  for (let i = 1; i <= 50; i++) {
    const fullName = `${firstNames[(i - 1) % firstNames.length]} ${lastNames[Math.floor((i - 1) / firstNames.length)]}`;
    const course = courses[(i - 1) % courses.length];
    const gender = ['Male', 'Female', 'Other'][i % 3];
    const student = await Student.findOneAndUpdate(
      { studentId: `STU-${String(i).padStart(4, '0')}` },
      {
        studentId: `STU-${String(i).padStart(4, '0')}`,
        fullName,
        email: `student${i}@campusflow.local`,
        phone: `98765${String(10000 + i).slice(-5)}`,
        gender,
        dateOfBirth: new Date(2002 + (i % 5), i % 12, (i % 27) + 1),
        address: `${i} Campus Avenue`,
        department: course.department,
        course: course.courseName,
        academicYear: '2026-2027',
        semester: Math.floor((i - 1) / 10) + 1,
        gpa: (2.5 + (i % 15) / 10).toFixed(2),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    students.push(student);
  }

  // Seed attendance for the last 7 days
  const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today.getTime() - dayOffset * 86400000);
    for (const [index, student] of students.entries()) {
      const status = index % 10 === 0 ? 'Absent' : index % 10 === 5 ? 'Late' : 'Present';
      await Attendance.updateOne(
        { student: student._id, date },
        {
          $set: {
            student: student._id,
            date,
            status,
            markedBy: admin?._id || null,
            remarks: status === 'Absent' ? 'Sick leave' : status === 'Late' ? 'Traffic delay' : '',
          },
        },
        { upsert: true }
      );
    }
  }

  const totalAttendance = await Attendance.countDocuments();
  console.log(`Seeded ${students.length} students, ${courses.length} courses, and ${totalAttendance} attendance records.`);
}
