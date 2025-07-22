const Order = require('../Models/order-model');
const Inventory = require('../Models/inventory-model');
const Product = require('../Models/product-model');

const createOrder = async (req, res) => {
  const buyer = req.user.id;
  const { items } = req.body;

  try {
    let totalAmount = 0;

    // Validate products and check inventory
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: `Product ${item.product} not found` });

      const inventory = await Inventory.findOne({ productId: item.product });
      if (!inventory || inventory.quantityAvailable < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
    }

    // Deduct inventory
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { productId: item.product },
        {
          $inc: { quantityAvailable: -item.quantity },
          $set: { lastRestockedDate: new Date() }
        }
      );
    }

    const order = new Order({
      buyer,
      items,
      totalAmount, // ✅ Auto-calculated
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Order placement failed' });
  }
};


const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('items.product', 'name price');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

const getAllOrders = async (req, res) => {
  const role = req.user.role;

  let filter = {};
  if (role === 'buyer') filter.buyer = req.user.id;
  if (role === 'seller') filter['items.product'] = { $exists: true }; // You can customize seller filter

  const orders = await Order.find(filter).populate('buyer','-role -password').populate('items.product');
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!['admin', 'seller'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized to update status' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const isOwner = order.buyer.toString() === req.user.id;
  const canDelete = req.user.role === 'admin' || isOwner;

  if (!canDelete) return res.status(403).json({ error: 'Forbidden' });

  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('items.product', 'name price')
      .populate('buyer', 'name email');
    res.json(orders);
  } catch (err) {
    console.error('Order history error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve order history' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getMyOrders
};