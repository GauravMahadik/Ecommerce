const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });

    const idx = cart.items.findIndex(i =>
      i.productId.toString() === productId && i.size === size && i.color === color
    );
    if (idx > -1) cart.items[idx].quantity += quantity;
    else cart.items.push({ productId, quantity, size, color });

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (quantity <= 0) cart.items.pull(req.params.itemId);
    else item.quantity = quantity;
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ message: 'Item removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};