const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['project', 'ai_tool', 'auth', 'billing', 'profile', 'settings'],
      required: true,
    },
    action: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false }
);

ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
