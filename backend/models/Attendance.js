import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  remarks: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ course: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

export default mongoose.model('Attendance', attendanceSchema);
