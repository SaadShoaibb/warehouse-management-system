const mongoose = require('mongoose');
const { Schema } = mongoose;

const saleSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0']
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'transfer'],
    required: true
  }
});

// Update product stock after sale
saleSchema.pre('save', async function(next) {
  try {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.product);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.stock < this.quantity) {
      throw new Error('Insufficient stock');
    }
    
    product.stock -= this.quantity;
    await product.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Sale', saleSchema);