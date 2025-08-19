import React, { useEffect, useState } from "react";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import {  useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiMessageSquare,
  FiUserCheck,
  //FiBuilding,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

import { FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminHome() {
  const navigate = useNavigate();

  // role and auth token
  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  //for user counts
  const [stats, setStats] = useState([]);

  // monthly users
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userTypeData, setUserTypeData] = useState([]);

  const [jobApplicationData, setJobApplicationData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/analytics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errmsg = await res.text();
          toast.error(errmsg);
          return;
        }

        const data = await res.json();

        if (data) {
          setStats(data);

          //job application data
          if (data.skillBasedData) {
            const { skillJobCounts, skillApplicationCounts } =
              data.skillBasedData;
            const categories = Object.keys(skillJobCounts || {});
            const barData = categories.map((skill) => ({
              category: skill,
              jobs: skillJobCounts[skill] || 0,
              applications: skillApplicationCounts[skill] || 0,
            }));
            setJobApplicationData(barData);
          }

          // role based data
          const userChartData = [
            { name: "Job Seekers", value: data.jobSeekers, color: "#3B82F6" },
            { name: "Employers", value: data.employers, color: "#10B981" },
            { name: "Admins", value: data.admins, color: "#F59E0B" },
          ];
          setUserTypeData(userChartData);

          // userGrowthData map into array for chart
          if (data.userGrowthData) {
            const growthArray = Object.entries(data.userGrowthData).map(
              ([month, users]) => ({ month, users }),
            );
            setUserGrowthData(growthArray);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAnalytics();
  }, [token]);

  const StatCard = ({ title, count, icon: Icon, color, trend }) => (
    <div className="p-6 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>
            {count?.toLocaleString()}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                +{trend}%
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-xl ${
            color === "text-blue-600"
              ? "bg-blue-50"
              : color === "text-green-600"
                ? "bg-green-50"
                : color === "text-yellow-600"
                  ? "bg-yellow-50"
                  : "bg-gray-50"
          }`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <h3 className="mb-4 text-xl font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role={role} />

      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of your job portal analytics
          </p>
        </div>

        {stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                count={stats.totalUsers}
                icon={FiUsers}
                color="text-blue-600"
                trend={12.5}
              />
              <StatCard
                title="Job Seekers"
                count={stats.jobSeekers}
                icon={FiUserCheck}
                color="text-green-600"
                trend={8.3}
              />
              <StatCard
                title="Employers"
                count={stats.employers}
                icon={FaBuilding}
                color="text-yellow-600"
                trend={15.7}
              />
              <StatCard
                title="Admins"
                count={stats.admins}
                icon={FiShield}
                color="text-gray-600"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
              <StatCard
                title="Total Jobs"
                count={stats.totalJobs}
                icon={FiBriefcase}
                color="text-blue-600"
                trend={22.1}
              />
              <StatCard
                title="Applications"
                count={stats.totalApplications}
                icon={FiFileText}
                color="text-green-600"
                trend={18.9}
              />
              <StatCard
                title="Messages"
                count={stats.totalMessages}
                icon={FiMessageSquare}
                color="text-yellow-600"
                trend={7.4}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              {/* User Growth Chart */}
              <ChartCard title="User Growth Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* User Distribution Pie Chart */}
              <ChartCard title="User Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-4 space-x-6">
                  {userTypeData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Jobs and Applications Chart */}
            <ChartCard title="Jobs & Applications by Category" className="mb-8">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={jobApplicationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="jobs"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Jobs Posted"
                  />
                  <Bar
                    dataKey="applications"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Applications"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Quick Actions */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => navigate("/users?role=seeker")}
                  className="p-4 text-center transition-colors duration-200 bg-blue-50 hover:bg-blue-100 rounded-xl"
                >
                  <FiUsers className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Manage Seekers
                  </span>
                </button>
                <button
                  onClick={() => navigate("/users?role=employer")}
                  className="p-4 text-center transition-colors duration-200 bg-green-50 hover:bg-green-100 rounded-xl"
                >
                  <FiBriefcase className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Manage Employers
                  </span>
                </button>
                <button
                  onClick={() => navigate("/jobs")}
                  className="p-4 text-center transition-colors duration-200 bg-yellow-50 hover:bg-yellow-100 rounded-xl"
                >
                  <FiFileText className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">
                    View Jobs
                  </span>
                </button>
                <button
                  onClick={() => navigate("/conversation")}
                  className="p-4 text-center transition-colors duration-200 bg-gray-50 hover:bg-gray-100 rounded-xl"
                >
                  <FiMessageSquare className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Messages
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
