import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistributionChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: "Category Distribution",
        data: data.map(item => item.count),
        backgroundColor: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Category Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default CategoryDistributionChart;
