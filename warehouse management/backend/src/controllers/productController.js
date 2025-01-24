const Product = require("../models/product");
exports.addProduct = async (req, res) => {
  const { name, trn, category, stock, price } = req.body;
  try {
    const product = new Product({ name, trn, category, stock, price });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product." });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, trn, category, stock, price } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, trn, category, stock, price },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product." });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};
