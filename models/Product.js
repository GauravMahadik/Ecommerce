const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['Saree', 'Kurti', 'Lehenga', 'Gown', 'Suit', 'Dress', 'Other'] },
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] }],
  colors: [String],
  images: [String],
  stock: { type: Number, default: 0 },
  tags: [String],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);