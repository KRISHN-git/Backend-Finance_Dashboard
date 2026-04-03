const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered.');
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    return successResponse(res, 201, 'User registered successfully.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return errorResponse(res, 401, 'Invalid credentials.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials.');
    }

    const token = generateToken(user._id);
    return successResponse(res, 200, 'Login successful.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.getMe = catchAsync(async (req, res) => {
  return successResponse(res, 200, 'Profile fetched.', req.user);
});