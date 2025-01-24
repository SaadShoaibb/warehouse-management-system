import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/common/Header";
import ClientsTable from "../components/clients/ClientsTable";
import StatCard from "../components/common/StatCard";
import { User } from "lucide-react";

const ClientsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);

  const [showViewProductsModal, setShowViewProductsModal] = useState(false);
  const [viewClientProducts, setViewClientProducts] = useState([]);
  const [viewClientName, setViewClientName] = useState("");




  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.trn.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleAddClient = () => {
    setShowAddForm(true);
    setIsEditMode(false);
    setSelectedProducts([]);
    setEditClient(null);
  };

  const handleEditClient = (client) => {
    setEditClient(client);
    setSelectedProducts(client.products || []);
    setShowAddForm(true);
    setIsEditMode(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditClient(null);
    setSelectedProducts([]);
  };

  const handleViewProducts = (client) => {
    setViewClientProducts(client.products || []);
    setViewClientName(client.name);
    setShowViewProductsModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = {
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      products: selectedProducts,
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/clients/${editClient._id}`, clientData);
        toast.success("Client updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/clients", clientData);
        toast.success("Client added successfully!");
      }
      setShowAddForm(false);
      fetchClients();
    } catch (error) {
      toast.error("Failed to submit client.");
    }
  };

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Remove the product from the client’s list of products in the frontend
      const updatedProducts = viewClientProducts.filter((product) => product._id !== productId);
      setViewClientProducts(updatedProducts);

      // Send a PUT request to remove the product from the database
      await axios.put(`http://localhost:5000/api/clients/${editClient._id}/remove-product`, {
        productId,
      });

      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error(error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      // Send a DELETE request to remove the client from the database
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`);
      toast.success("Client deleted successfully!");

      // After deleting the client, update the client list
      fetchClients(); // Refresh the clients list after deletion
    } catch (error) {
      toast.error("Failed to delete client.");
      console.error(error);
    }
  };


  const openAssignModal = () => {
    setFilteredProducts(allProducts);
    setSearchQuery("");
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
  };

  const confirmProductAssignment = () => {
    toast.success("Products assigned successfully!");
    closeAssignModal();
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Toaster />
      <Header title="Clients" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard name="Total Clients" icon={User} value={clients.length} color="#6366F1" />
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddClient}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Client
          </button>
        </div>

        <ClientsTable clients={clients} onEditClient={handleEditClient} onViewProducts={handleViewProducts} onDeleteClient={handleDeleteClient} // Pass the delete function here

        />

        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-lg">
              <h3 className="text-2xl font-bold text-white mb-6">
                {isEditMode ? "Edit Client" : "Add Client"}
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={isEditMode ? editClient.name : ""}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={isEditMode ? editClient.phoneNumber : ""}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assign Products</label>
                  <button
                    type="button"
                    onClick={openAssignModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Assign Products
                  </button>
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
                    {isEditMode ? "Update Client" : "Add Client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAssignModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Assign Products</h3>
              <input
                type="text"
                placeholder="Search products by name or TRN"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4"
              />
              <div className="max-h-80 overflow-auto bg-gray-700 rounded-lg p-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedProducts.includes(product._id)
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:bg-gray-600"
                      }`}
                    onClick={() => handleProductSelect(product._id)}
                  >
                    <span>{product.name} (TRN: {product.trn})</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={confirmProductAssignment}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Confirm
                </button>
                <button
                  onClick={closeAssignModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showViewProductsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Products for {viewClientName}
              </h3>
              <div className="max-h-80 overflow-auto bg-gray-700 rounded-lg p-4">
                {viewClientProducts.length > 0 ? (
                  viewClientProducts.map((product) => (
                    <div key={product._id} className="p-2 mb-2 bg-gray-800 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-white"><strong>Name:</strong> {product.name}</p>
                        <p className="text-gray-400"><strong>TRN:</strong> {product.trn}</p>
                        <p className="text-gray-400"><strong>Description:</strong> {product.description}</p>
                        <p className="text-gray-400"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                        <p className="text-gray-400"><strong>Stock:</strong> {product.stock}</p> {/* Display product stock */}
                        <p className="text-gray-400">
                          <strong>Total Value:</strong> ${(product.price * product.stock).toFixed(2)} {/* Calculate total value */}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product._id)} // Attach the delete function here
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No products assigned to this client.</p>
                )}
              </div>
              <div className="mt-4 text-white text-lg">
                <strong>Total Value:</strong> $
                {viewClientProducts
                  .reduce((acc, product) => acc + (product.price * product.stock || 0), 0)
                  .toFixed(2)}
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowViewProductsModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
};

export default ClientsPage;
