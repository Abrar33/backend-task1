const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../Controller/product-controller');
const { authenticate, isSeller } = require('../middlware/authmiddlware');

const router = express.Router();

router.post('/create', authenticate, isSeller, createProduct);
router.get('/', getAllProducts); // ✅ Get all products
router.get('/:id', getProductById);
router.put('/:id', authenticate, isSeller, async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req, res);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});
router.delete("/:id",authenticate,deleteProduct)
module.exports = router;