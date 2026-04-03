const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return successResponse(res, 200, 'Users fetched.', users);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return errorResponse(res, 404, 'User not found.');
    return successResponse(res, 200, 'User updated.', user);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};