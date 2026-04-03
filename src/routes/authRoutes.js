const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);

module.exports = router;