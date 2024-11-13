import mongoose from 'mongoose';
import users from './users';

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
    unique: true
  },
  attendance: {
    type: Object,
    default:{}
  }
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
