module.exports = (allowedRoles) => (req, res, next) => {
  try {
    const userRole = req.user && req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Access denied for this role' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Role check failed' });
  }
};
