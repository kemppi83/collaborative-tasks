import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  owned_todos: { type: [String], default: [] },
  joined_todos: { type: [String], default: [] },
});

export default mongoose.model('users', userSchema);
