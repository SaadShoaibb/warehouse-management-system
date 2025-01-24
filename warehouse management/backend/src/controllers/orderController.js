const Order = require("../models/order");
exports.addOrder = async (req, res) => {
  const { trn, products, total } = req.body;
  try {
    const order = new Order({ trn, products, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to add order." });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};