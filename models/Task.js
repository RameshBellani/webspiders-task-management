// File: models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'], default: 'TODO' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }, // For soft delete
});

taskSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

taskSchema.statics.findNotDeleted = function (filter) {
  return this.find({ ...filter, deletedAt: null });
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
