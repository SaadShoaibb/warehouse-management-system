import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react"; // Ensure Users is included

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [totalClients, setTotalClients] = useState(0); // Added state for total clients
  const [totalProductValue, setTotalProductValue] = useState(0); // Added state for total product value
  const [totalStock, setTotalStock] = useState(0); // Added state for total stock

  useEffect(() => {
    fetchProducts();
    fetchClients(); // Fetch clients count as well
  }, []);

  // Fetch products and calculate total product value and category data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      const products = response.data;

      // Calculate total products, total stock, and total product value
      setTotalProducts(products.length);
      let totalValue = 0;
      let totalStockCount = 0;

      products.forEach((product) => {
        totalValue += (product.price || 0) * (product.stock || 0); // price * stock for total value
        totalStockCount += product.stock || 0; // sum all stocks
      });

      setTotalProductValue(totalValue);
      setTotalStock(totalStockCount);

      // Prepare category data for the pie chart (based on product count in each category)
      const categoryCount = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      // Convert category count object to an array of objects for chart display
      const categoryDataArray = Object.keys(categoryCount).map((category) => ({
        category,
        count: categoryCount[category],
      }));

      setCategoryData(categoryDataArray);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch total clients count
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setTotalClients(response.data.length);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Modify Total Sales to Total Product Value */}
          <StatCard
            name="Total Product Value"
            icon={Zap}
            value={`$${totalProductValue.toFixed(2)}`}
            color="#6366F1"
          />
          
          {/* Modify New Users to Total Clients */}
          <StatCard
            name="Total Clients"
            icon={Users}
            value={totalClients}
            color="#8B5CF6"
          />
          
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={totalProducts}
            color="#EC4899"
          />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart data={categoryData} /> {/* Pass categoryData to CategoryDistributionChart */}
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
