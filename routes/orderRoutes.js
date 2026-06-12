const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, ctrl.placeOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.get('/', protect, adminOnly, ctrl.getAllOrders);
router.get('/:id', protect, ctrl.getOrderById);
router.put('/:id/status', protect, adminOnly, ctrl.updateStatus);
router.put('/:id/cancel', protect, ctrl.cancelOrder);

module.exports = router;