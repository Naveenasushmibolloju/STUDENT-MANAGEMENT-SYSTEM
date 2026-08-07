import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  description: {
    type: String,
    default: null
  },
  prerequisites: [{
    type: String
  }],
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: {
      type: String,
      default: null
    },
    endTime: {
      type: String,
      default: null
    },
    room: {
      type: String,
      default: null
    }
  },
  maxCapacity: {
    type: Number,
    min: 1,
    default: 50
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.index({ department: 1 });
courseSchema.index({ semester: 1 });
courseSchema.index({ isActive: 1 });

export default mongoose.model('Course', courseSchema);
