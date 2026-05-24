const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/response');

/* ─── Get all projects ────────────────────────────────────────── */
exports.getProjects = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const userId = req.user._id;

    // Return mock data for demo mode
    if (userId === 'demo-user-001') {
      return sendSuccess(res, { projects: [], total: 0, page: 1, pages: 1 });
    }

    const query = { owner: userId, isArchived: false };
    if (status && status !== 'all') query.status = status;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    sendSuccess(res, {
      projects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Get single project ──────────────────────────────────────── */
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return sendError(res, 'Project not found.', 404);
    sendSuccess(res, { project });
  } catch (err) {
    next(err);
  }
};

/* ─── Create project ──────────────────────────────────────────── */
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });

    await ActivityLog.create({
      user: req.user._id,
      type: 'project',
      action: 'create',
      description: `Created project "${project.name}"`,
      metadata: { projectId: project._id },
    });

    sendSuccess(res, { project }, 'Project created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/* ─── Update project ──────────────────────────────────────────── */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return sendError(res, 'Project not found.', 404);

    await ActivityLog.create({
      user: req.user._id,
      type: 'project',
      action: 'update',
      description: `Updated project "${project.name}"`,
      metadata: { projectId: project._id },
    });

    sendSuccess(res, { project }, 'Project updated successfully.');
  } catch (err) {
    next(err);
  }
};

/* ─── Delete project ──────────────────────────────────────────── */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return sendError(res, 'Project not found.', 404);

    await ActivityLog.create({
      user: req.user._id,
      type: 'project',
      action: 'delete',
      description: `Deleted project "${project.name}"`,
    });

    sendSuccess(res, {}, 'Project deleted successfully.');
  } catch (err) {
    next(err);
  }
};
