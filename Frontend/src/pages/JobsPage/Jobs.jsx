import React, { useState, useEffect } from "react";
import JobListing from "../../components/JobListing/JobListing";
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth-token");

  const fetchJobs = async () => {
    setError("");
    setLoading(true);

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/jobs/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        setError("Failed to fetch jobs");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError("Error occurred while fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="jl-container">
      <div className="jl-header">
        <h1 className="jl-title">Job Board</h1>
        <p className="jl-subtitle">Discover exceptional career opportunities tailored for you</p>
        <div className="jl-stats">
          <div className="jl-stat-item">
            <span className="jl-stat-number">{jobs.length}</span>
            <span>Total Jobs</span>
          </div>
          <div className="jl-stat-item">
            <span className="jl-stat-number">{new Set(jobs.map((job) => job.companyName)).size}</span>
            <span>Companies</span>
          </div>
          <div className="jl-stat-item">
            <span className="jl-stat-number">{new Set(jobs.map((job) => job.location)).size}</span>
            <span>Locations</span>
          </div>
        </div>
      </div>

      {error && <div className="jl-error-message">{error}</div>}

      {loading ? (
        <div className="jl-loading-spinner">
          <div className="jl-spinner"></div>
        </div>
      ) : (
        <JobListing jobs={jobs} />
      )}
    </div>
  );
}
