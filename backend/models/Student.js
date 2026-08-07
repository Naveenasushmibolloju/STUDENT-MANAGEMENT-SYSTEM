import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
    set: v => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: null
  },
  emergencyContact: {
    name: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    relationship: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true
});

studentSchema.index({ fullName: 'text', studentId: 'text', course: 'text', department: 'text' });
studentSchema.index({ department: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ status: 1 });

export default mongoose.model('Student', studentSchema);
