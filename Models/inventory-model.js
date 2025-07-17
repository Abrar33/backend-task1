const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true
  },
  lastRestockedDate: {
    type: Date,
    default: Date.now
  },
  warehouseLocation: {
    type: String
  },
  minimumStockAlert: {
    type: Number
  }
});

module.exports = mongoose.model('Inventory', InventorySchema);