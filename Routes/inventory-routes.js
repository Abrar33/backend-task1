const express = require('express');
const { upsertInventory, getInventoryByProduct } = require('../Controller/inventory-controller');
const { authenticate, isSeller } = require('../middlware/authMiddlware');
const router = express.Router();

router.post('/upsert', authenticate, isSeller, upsertInventory);
router.get('/:productId', authenticate, getInventoryByProduct);

module.exports = router;