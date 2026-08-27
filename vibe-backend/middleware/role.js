const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

const requireAdmin = role('admin');

module.exports = role;
module.exports.role = role;
module.exports.requireAdmin = requireAdmin;
