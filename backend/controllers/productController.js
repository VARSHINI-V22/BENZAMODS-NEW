const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const payload = { ...req.body, category: req.body.category.toLowerCase() };
    const product = new Product(payload);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.category) req.body.category = req.body.category.toLowerCase();
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};