const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
router.get('/', protect, ctrl.getCart);
router.post('/', protect, ctrl.addToCart);
router.put('/:itemId', protect, ctrl.updateItem);
router.delete('/clear', protect, ctrl.clearCart);
router.delete('/:itemId', protect, ctrl.removeItem);
module.exports = router;