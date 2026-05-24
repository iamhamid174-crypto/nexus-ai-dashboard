const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'archived'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    tags: [{ type: String, trim: true }],
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    aiToolsUsed: [{ type: String }],
    wordsGenerated: { type: Number, default: 0 },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.index({ owner: 1, status: 1 });
ProjectSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);
