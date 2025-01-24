const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  trn: { type: String, required: true, unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});
module.exports = mongoose.model("Order", orderSchema);