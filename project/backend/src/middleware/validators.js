const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/* ─── Run validator and return errors ─────────────────────────── */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join('. ');
    return sendError(res, messages, 422);
  }
  next();
};

/* ─── Auth validators ─────────────────────────────────────────── */
exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 80 }).withMessage('Name too long.'),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

exports.forgotPasswordRules = [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
];

/* ─── Project validators ──────────────────────────────────────── */
exports.projectRules = [
  body('name').trim().notEmpty().withMessage('Project name is required.').isLength({ max: 100 }).withMessage('Name too long.'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long.'),
  body('status').optional().isIn(['active', 'completed', 'paused', 'archived']).withMessage('Invalid status.'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority.'),
];

/* ─── Profile validators ──────────────────────────────────────── */
exports.updateProfileRules = [
  body('name').optional().trim().isLength({ max: 80 }).withMessage('Name too long.'),
  body('email').optional().isEmail().withMessage('Valid email required.').normalizeEmail(),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio too long.'),
];

exports.changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
];
