const mongoose = require("mongoose");
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product schema
      },
    ],
  },
  { timestamps: true }
);

// Middleware to update client status based on product stock
clientSchema.pre("save", async function (next) {
  if (this.products.length > 0) {
    // Fetch product details to check stock
    const Product = mongoose.model("Product");
    const productDetails = await Product.find({ _id: { $in: this.products } });

    const hasActiveProducts = productDetails.some((product) => product.stock > 0);
    this.status = hasActiveProducts ? "ACTIVE" : "INACTIVE";
  } else {
    this.status = "INACTIVE";
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);
