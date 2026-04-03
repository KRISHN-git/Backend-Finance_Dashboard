const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  return successResponse(res, 200, 'Users fetched.', users);
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isActive },
    { new: true, runValidators: true }
  );
  if (!user) return errorResponse(res, 404, 'User not found.');
  return successResponse(res, 200, 'User updated.', user);
});

exports.deactivateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!user) return errorResponse(res, 404, 'User not found.');
  return successResponse(res, 200, 'User deactivated.', user);
});