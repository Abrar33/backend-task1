const express = require('express');
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getMyOrders
} = require('../Controller/order-controller');
const { authenticate } = require('../middlware/authMiddlware');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.get('/', authenticate, getAllOrders);
router.put('/:id/status', authenticate, updateOrderStatus);
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;