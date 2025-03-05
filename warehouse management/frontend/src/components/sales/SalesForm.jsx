// components/sales/CreateSaleForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const CreateSaleForm = ({ products, clients }) => {
  const [formData, setFormData] = useState({
    product: '',
    client: '',
    quantity: 1,
    price: 0,
    paymentMethod: 'cash'
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sales', formData);
      setMessage({ type: 'success', text: 'Sale recorded successfully!' });
      setFormData({
        product: '',
        client: '',
        quantity: 1,
        price: 0,
        paymentMethod: 'cash'
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to record sale' });
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product</label>
            <select
              className="w-full bg-gray-700 rounded-md p-2"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Client</label>
            <select
              className="w-full bg-gray-700 rounded-md p-2"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              className="w-full bg-gray-700 rounded-md p-2"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              className="w-full bg-gray-700 rounded-md p-2"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Record Sale
        </button>
      </form>
    </motion.div>
  );
};

export default CreateSaleForm;