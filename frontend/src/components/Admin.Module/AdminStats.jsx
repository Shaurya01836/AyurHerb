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
import { Users, Eye, FileText, Leaf, TrendingUp, Activity } from "lucide-react";

// Register Chart.js components (needed only once globally)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStats = ({ totalUsers, visitCount, postCount, herbCount }) => {
  const chartData = {
    labels: ["Users", "Visits", "Posts", "Herbs"],
    datasets: [
      {
        label: "Platform Statistics",
        data: [totalUsers, visitCount, postCount, herbCount],
        backgroundColor: [
          "rgba(34, 197, 94, 0.2)",
          "rgba(59, 130, 246, 0.2)",
          "rgba(168, 85, 247, 0.2)",
          "rgba(239, 68, 68, 0.2)"
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Registered users"
    },
    {
      title: "Visit Count",
      value: visitCount,
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Total visits"
    },
    {
      title: "Community Posts",
      value: postCount,
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "User posts"
    },
    {
      title: "Total Herbs",
      value: herbCount,
      icon: Leaf,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      description: "Herbs in database"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <TrendingUp className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </div>
              
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm text-gray-500">total</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Platform Analytics</h3>
            <p className="text-gray-600">Visual representation of key metrics</p>
          </div>
        </div>
        
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Engagement</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Monitor user activity and engagement patterns across the platform.
          </p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalUsers}</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{visitCount}</div>
              <div className="text-sm text-gray-500">Total Visits</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Content Overview</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Track content creation and community participation metrics.
          </p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{postCount}</div>
              <div className="text-sm text-gray-500">Community Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{herbCount}</div>
              <div className="text-sm text-gray-500">Herbs Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
