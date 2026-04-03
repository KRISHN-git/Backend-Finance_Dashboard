const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/recordController');

router.get('/',    protect, authorize('viewer', 'analyst', 'admin'), ctrl.getRecords);
router.post('/',   protect, authorize('admin'), ctrl.createRecord);
router.put('/:id', protect, authorize('admin'), ctrl.updateRecord);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteRecord);

module.exports = router;