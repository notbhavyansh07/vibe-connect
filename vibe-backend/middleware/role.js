/**
 * Role-based access control – only allow certain roles.
 * Usage: requireRole('admin')(req, res, next)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'Insufficient permissions' });
  }
  next();
};

const requireAdmin = requireRole('admin');

module.exports = { requireRole, requireAdmin };
