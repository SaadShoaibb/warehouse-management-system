import Sale from '../models/sale.js';
import Product from '../models/product.js';
import Client from '../models/client.js';

// Create new sale
export const createSale = async (req, res) => {
  try {
    const { product, client, quantity, price, paymentMethod } = req.body;
    
    const newSale = new Sale({
      product,
      client,
      quantity,
      price,
      paymentMethod
    });

    const savedSale = await newSale.save();
    
    // Update client status if needed
    await updateClientStatus(client);
    
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get sales statistics
export const getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          averageOrderValue: { $avg: { $multiply: ['$quantity', '$price'] } },
          totalSales: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $gt: ['$totalSales', 0] },
              { $multiply: [{ $divide: ['$totalSales', { $size: '$productDetails' }] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    res.json({
      totalRevenue: stats[0]?.totalRevenue || 0,
      averageOrderValue: stats[0]?.averageOrderValue || 0,
      conversionRate: `${(stats[0]?.conversionRate || 0).toFixed(2)}%`,
      totalSales: stats[0]?.totalSales || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update client status based on associated products
const updateClientStatus = async (clientId) => {
  const client = await Client.findById(clientId).populate('products');
  const activeProducts = client.products.filter(product => product.stock > 0);
  client.status = activeProducts.length > 0 ? 'ACTIVE' : 'INACTIVE';
  await client.save();
};

// Get sales by category
export const getSalesByCategory = async (req, res) => {
    try {
      const categorySales = await Sale.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            totalSales: { 
              $sum: { 
                $multiply: ['$quantity', '$price'] 
              } 
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalSales: -1 } }
      ]);
  
      res.json(categorySales.map(item => ({
        category: item._id,
        totalSales: item.totalSales,
        count: item.count
      })));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Generate random sales
export const generateRandomSales = async (req, res) => {
  try {
    const { count = 10 } = req.body;
    
    // Get available products and clients
    const products = await Product.find({ stock: { $gt: 0 } });
    const clients = await Client.find({ status: 'ACTIVE' });

    if (products.length === 0 || clients.length === 0) {
      return res.status(400).json({
        message: 'Need at least 1 product (with stock) and 1 active client to generate sales'
      });
    }

    const sales = [];
    
    for (let i = 0; i < count; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const maxQuantity = Math.min(product.stock, 5); // Max 5 items per sale
      const quantity = Math.floor(Math.random() * maxQuantity) + 1;

      sales.push({
        product: product._id,
        client: clients[Math.floor(Math.random() * clients.length)]._id,
        quantity,
        price: product.price,
        paymentMethod: ['cash', 'credit', 'transfer'][Math.floor(Math.random() * 3)]
      });
    }

    const createdSales = await Sale.insertMany(sales);
    res.json({ message: `Created ${createdSales.length} random sales` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};