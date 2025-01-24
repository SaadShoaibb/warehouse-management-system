const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  trn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  barcode: { type: String, unique: true }
});

// Pre-save middleware to generate barcode from trn
productSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('trn')) {
    this.barcode = `BARCODE-${this.trn}`; // Adjust the format as needed
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
