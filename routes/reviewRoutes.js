const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
router.post('/:productId', protect, ctrl.addReview);
router.get('/:productId', ctrl.getReviews);
module.exports = router;