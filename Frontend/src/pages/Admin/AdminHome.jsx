import { useEffect, useState } from "react";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

export default function AdminHome() {
  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await res.json();
        console.log(data);
        setStats(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAnalytics();
  }, [token]);

  return (
    <>
      <NavBar role={role} />

      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
        {stats ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnalyticsCard title="Total Users" count={stats.totalUsers} />
            <AnalyticsCard title="Job Seekers" count={stats.jobSeekers} />
            <AnalyticsCard title="Employers" count={stats.employers} />
            <AnalyticsCard title="Admins" count={stats.admins} />
            <AnalyticsCard title="Total Jobs" count={stats.totalJobs} />
            <AnalyticsCard
              title="Applications"
              count={stats.totalApplications}
            />
            <AnalyticsCard title="Messages" count={stats.totalMessages} />
          </div>
        ) : (
          <p>Loading analytics...</p>
        )}
      </div>
    </>
  );
}

function AnalyticsCard({ title, count }) {
  return (
    <div className="p-4 bg-white border shadow rounded-xl">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold text-blue-600">{count}</p>
    </div>
  );
}
