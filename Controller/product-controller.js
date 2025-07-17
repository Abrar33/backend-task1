const Product = require("../Models/product-model");

const createProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;

  try {
    const sellerId = req.user.id;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      seller: sellerId
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Product creation error:', err.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email role');
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email role');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Get product by ID error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};


const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Optional: Only allow seller who created the product or admin to update
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You cannot update this product' });
    }

    Object.assign(product, updates); // Merge updates into product
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Only admin or the seller who owns the product can delete
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this product' });
    }

    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};