const express = require('express');
const { createProduct, getAllProducts, getProductById } = require('../Controller/product-controller');
const { authenticate, isSeller } = require('../middlware/authmiddlware');

const router = express.Router();

router.post('/create', authenticate, isSeller, createProduct);
router.get('/', getAllProducts); // ✅ Get all products
router.get('/:id', getProductById);
module.exports = router;