import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobListing from "../../components/JobListing/JobListing";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const role = localStorage.getItem("role");
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
      console.log("data ", data);
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
    <>
      <NavBar role={role} />

      {error && <div className="jl-err-message">{error}</div>}

      {loading ? (
        <div className="jl-loading-spinner">
          <div className="jl-spinner"></div>
        </div>
      ) : (
        <JobListing jobs={jobs} navigate={navigate} />
      )}
    </>
  );
}
