const { sendError } = require('../utils/response');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden. Insufficient permissions.', 403);
    }
    next();
  };
};

module.exports = authorize;
