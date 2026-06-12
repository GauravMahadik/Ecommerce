const Review = require('../models/Review');
const Product = require('../models/Product');

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ productId: req.params.productId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });
    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user._id,
      rating, comment
    });
    const reviews = await Review.find({ productId: req.params.productId });
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, { ratings: avg, numReviews: reviews.length });
    const populated = await Review.findById(review._id).populate('userId', 'name');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};