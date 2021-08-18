import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  timestamp: { type: Number, required: true },
  collaborators: { type: [String], default: [] },
  status: { type: String, default: 'active' },
  tasks: { type: [String], default: [] },
});

export default mongoose.model('todos', todoSchema);
