import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  parent_todo: { type: String, required: true },
  parent_task: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: false },
  timestamp: { type: Number, required: true },
  status: { type: String, default: 'active' },
  children: { type: [String], default: [] },
});

export default mongoose.model('tasks', taskSchema);
