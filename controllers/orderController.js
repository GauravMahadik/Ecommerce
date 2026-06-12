const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, discount, finalAmount } = req.body;
    const order = await Order.create({
      userId: req.user._id,
      items, shippingAddress, paymentMethod, totalAmount, discount, finalAmount,
      trackingHistory: [{ status: 'pending', message: 'Order placed successfully' }]
    });
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const messages = {
      confirmed: 'Order confirmed by seller',
      shipped: 'Order has been shipped',
      out_for_delivery: 'Out for delivery',
      delivered: 'Order delivered successfully',
      cancelled: 'Order cancelled',
    };
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { trackingHistory: { status, message: message || messages[status] } }
      },
      { new: true }
    );
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'cancelled';
    order.trackingHistory.push({ status: 'cancelled', message: 'Order cancelled by user' });
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};