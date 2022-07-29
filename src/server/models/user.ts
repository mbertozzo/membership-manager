import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// Please note that pre and post save() hooks are not executed on
// update(), findOneAndUpdate(), ...
// https://stackoverflow.com/questions/14588032/mongoose-password-hashing
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(parseFloat(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function (data) {
  return await bcrypt.compare(data, this.password);
};

export default mongoose.model('User', UserSchema);
