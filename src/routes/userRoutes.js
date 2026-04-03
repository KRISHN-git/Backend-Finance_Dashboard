const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { getAllUsers, updateUserRole } = require('../controllers/userController');

router.get('/',      protect, authorize('admin'), getAllUsers);
router.put('/:id',   protect, authorize('admin'), updateUserRole);

module.exports = router;