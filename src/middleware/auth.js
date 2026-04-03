const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      return errorResponse(res, 401, 'User not found or account deactivated.');
    }

    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token.');
  }
};

module.exports = { protect };