const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', ctrl.getAll);
router.get('/featured', ctrl.getFeatured);
router.get('/:id', ctrl.getOne);
router.post('/', protect, adminOnly, upload.array('images', 5), ctrl.create);
router.put('/:id', protect, adminOnly, upload.array('images', 5), ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;