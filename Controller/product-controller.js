const Product = require("../Models/product-model");

// Create a new product with variations
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    images,
    variations
  } = req.body;

  try {
    const sellerId = req.user.id;

    if (!name || !description || !price || !category || !images || !Array.isArray(variations)) {
      return res.status(400).json({ error: "Missing required product fields or variations" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      variations,
      seller: sellerId
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error("Product creation error:", err.message);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email"); // 🚫 exclude password/role
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Get product by ID error:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.user.role !== "admin" && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: You cannot update this product" });
    }

    Object.assign(product, updates);
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Update product error:", err.message);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.user.role !== "admin" && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: You cannot delete this product" });
    }

    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};