import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default mongoose.model('User', UserSchema);