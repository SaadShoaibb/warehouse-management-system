import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import ProductsTable from "../components/products/ProductsTable";
import axios from "axios";

const ProductsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Failed to fetch products:", error));
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
    setIsEditMode(false);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowAddForm(true);
    setIsEditMode(true);
  };

  const handleDeleteProduct = (productId) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`)
      .then(() => {
        toast.success("Product deleted successfully!");
        fetchProducts();
      })
      .catch(() => toast.error("Failed to delete product."));
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditProduct(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      trn: formData.get("trn"),
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      price: Number(formData.get("price")),
    };

    if (isEditMode) {
      axios
        .put(`http://localhost:5000/api/products/${editProduct._id}`, productData)
        .then(() => {
          toast.success("Product updated successfully!");
          setShowAddForm(false);
          fetchProducts();
        })
        .catch(() => toast.error("Failed to update product."));
    } else {
      axios
        .post("http://localhost:5000/api/products", productData)
        .then(() => {
          toast.success("Product added successfully!");
          setShowAddForm(false);
          fetchProducts();
        })
        .catch(() => toast.error("Failed to add product."));
    }
  };

  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const totalValue = products.reduce((total, product) => total + (product.stock * product.price), 0);

  const highestValueProduct = products.reduce((maxProduct, product) => {
    const productValue = product.stock * product.price;
    return productValue > (maxProduct.stock * maxProduct.price) ? product : maxProduct;
  }, products[0] || {});

  const lowStockProduct = products
    .filter((product) => product.stock < 20)
    .sort((a, b) => a.stock - b.stock)[0];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Toaster />
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Stock"
            icon={Package}
            value={totalStock}
            color="#6366F1"
          />
          <StatCard
            name="Total Value"
            icon={TrendingUp}
            value={`$${totalValue.toFixed(2)}`}
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            icon={AlertTriangle}
            value={lowStockProduct ? `${lowStockProduct.name} (${lowStockProduct.stock})` : "N/A"}
            color="#F59E0B"
          />
          <StatCard
            name="Highest Value Product"
            icon={DollarSign}
            value={highestValueProduct ? `${highestValueProduct.name} ($${(highestValueProduct.stock * highestValueProduct.price).toFixed(2)})` : "N/A"}
            color="#EF4444"
          />
        </motion.div>

        <ProductsTable
          products={products}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />

        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-lg">
              <h3 className="text-2xl font-bold text-white mb-6">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={isEditMode ? editProduct.name : ""}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tracking Number (TRN)</label>
                  <input
                    type="text"
                    name="trn"
                    defaultValue={isEditMode ? editProduct.trn : ""}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={isEditMode ? editProduct.category : "Electronics"}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Home">Home</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={isEditMode ? editProduct.stock : ""}
                      required
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={isEditMode ? editProduct.price : ""}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleFormClose}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {isEditMode ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
