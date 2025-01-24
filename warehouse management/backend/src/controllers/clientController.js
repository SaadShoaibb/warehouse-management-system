const Client = require("../models/Client");
const Product = require("../models/product");

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("products");
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients." });
  }
};

// Add a new client
exports.addClient = async (req, res) => {
  try {
    const { name, phoneNumber, products } = req.body;

    const client = new Client({ name, phoneNumber, products });
    await client.save();

    res.status(201).json({ message: "Client added successfully!", client });
  } catch (error) {
    res.status(500).json({ error: "Failed to add client." });
  }
};

// Update an existing client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, products } = req.body;

    const client = await Client.findByIdAndUpdate(
      id,
      { name, phoneNumber, products },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.status(200).json({ message: "Client updated successfully!", client });
  } catch (error) {
    res.status(500).json({ error: "Failed to update client." });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.status(200).json({ message: "Client deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client." });
  }
};


// Remove a product from a client's products list
exports.removeProductFromClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { productId } = req.body;

    // Ensure productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    // Find the client by ID
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    // Check if the product exists in the client's product list
    const productIndex = client.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in client's list." });
    }

    // Remove the product from the client's products array
    client.products.splice(productIndex, 1);

    // Save the updated client
    await client.save();

    res.status(200).json({ message: "Product removed successfully from client." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove product from client." });
  }
};