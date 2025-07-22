const Product = require("../Models/product-model");

// 🔹 Create Product (with variations)
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    variations
  } = req.body;

  try {
    const sellerId = req.user.id;

    // Basic validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !Array.isArray(variations) ||
      variations.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields or variations" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
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

// 🔹 Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// 🔹 Get Product by ID
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

// 🔹 Update Product
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

// 🔹 Delete Product
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