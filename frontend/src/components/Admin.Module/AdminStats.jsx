import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components (needed only once globally)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStats = ({ totalUsers, visitCount, postCount, herbCount }) => {
  const chartData = {
    labels: ["Total Users", "Visit Count"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers, visitCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div className="bg-green-600 text-white p-6 rounded-lg text-center">
        <h2 className="text-3xl">Total Users</h2>
        <p className="text-4xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
        <h2 className="text-3xl">Visit Count</h2>
        <p className="text-4xl font-bold">{visitCount}</p>
      </div>
      <div className="bg-purple-600 text-white p-6 rounded-lg text-center">
        <h2 className="text-3xl">Community Posts</h2>
        <p className="text-4xl font-bold">{postCount}</p>
      </div>
      <div className="bg-red-600 text-white p-6 rounded-lg text-center">
        <h2 className="text-3xl">Total Herbs</h2>
        <p className="text-4xl font-bold">{herbCount}</p>
      </div>
      <div className="col-span-1 sm:col-span-2 md:col-span-3">
        <Bar data={chartData} />
      </div>
    </section>
  );
};

export default AdminStats;
