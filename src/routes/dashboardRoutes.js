const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/dashboardController');

router.get('/summary',        protect, authorize('analyst', 'admin'), ctrl.getSummary);
router.get('/category-totals', protect, authorize('analyst', 'admin'), ctrl.getCategoryTotals);
router.get('/monthly-trends',  protect, authorize('analyst', 'admin'), ctrl.getMonthlyTrends);
router.get('/recent', protect, authorize('analyst','admin'), ctrl.getRecentActivity);

module.exports = router;