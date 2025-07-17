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
module.exports = {
  createProduct,
  getAllProducts,
  getProductById};