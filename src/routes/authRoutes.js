const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    next();
  }
];

router.post('/register', validateRegister, register);
router.get('/me', protect, getMe);
router.post('/login', login);

module.exports = router;