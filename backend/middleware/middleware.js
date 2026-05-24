const authMiddleware = (req, res, next) => {
  // Later: verify token/session here
  next();
};

module.exports = authMiddleware;