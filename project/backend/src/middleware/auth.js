const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError, sendError } = require('../utils/response');

/* ─── protect — require valid JWT ─────────────────────────────── */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fall back to cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Not authorized — no token provided.', 401);
  }

  // Allow demo token for development/testing
  if (token === 'demo-token-001' && process.env.NODE_ENV !== 'production') {
    req.user = {
      _id: 'demo-user-001',
      name: 'Sample User',
      email: 'demo@example.com',
      role: 'user',
      plan: 'pro',
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return sendError(res, 'User not found.', 401);
    if (!user.isActive) return sendError(res, 'Account has been deactivated.', 403);

    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 'Not authorized — invalid token.', 401);
  }
};

/* ─── authorize — role-based access ──────────────────────────── */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Role '${req.user.role}' is not authorized for this resource.`, 403);
    }
    next();
  };
};
