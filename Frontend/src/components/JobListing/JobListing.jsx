import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobListing.css";

/*
export default function JobListing() {
    const [error, setError] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("auth-token");
        if (!token) {
            setError("Please Login first");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/jobs/all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) {
                setError("Failed to fetch jobs");
                return;
            }

            const data = await response.json();
            console.log("Job DTOs received: ", data);
            setJobs(data);

        } catch (error) {
            setError("An error occurred while fetching jobs");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleSubmit();
    }, []);

    // Filter jobs based on search term
    const filteredJobs = jobs.filter(job => {
            const title = job.jobTitle ?? "";
            const desc = job.jobDescription ?? "";
            const loc = job.location ?? "";
            const company = job.companyName ?? "";
    
            return(
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        (company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
});


    return (
        <div className="jl-container">
            <div className="jl-header">
                <h1 className="jl-title"> Job Board</h1>
                <p className="jl-subtitle">Discover exceptional career opportunities tailored for you</p>
                <div className="jl-stats">
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">{jobs.length}</span>
                        <span>Total Jobs</span>
                    </div>
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">{new Set(jobs.map(job => job.companyName)).size}</span>
                        <span>Companies</span>
                    </div>
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">{new Set(jobs.map(job => job.location)).size}</span>
                        <span>Locations</span>
                    </div>
                </div>
            </div>

            {!loading && !error && jobs.length > 0 && (
                <div className="jl-filter-bar">
                    <input
                        type="text"
                        placeholder="Search jobs by title, company, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="jl-search-input"
                    />
                </div>
            )}

            {error && <div className="jl-error-message">{error}</div>}

            {loading ? (
                <div className="jl-loading-spinner">
                    <div className="jl-spinner"></div>
                </div>
            ) : (
                <div className="jl-jobs-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <div key={index} className="jl-job-card">
                                <div className="jl-job-header">
                                    <h3 className="jl-job-title">{job.jobTitle}</h3>
                                    <div className="jl-job-badge">Featured</div>
                                </div>
                                
                                <p className="jl-job-description">{job.jobDescription}</p>
                                
                                <div className="jl-job-details">
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon"></div>
                                        <span className="jl-job-detail-label">Location:</span>
                                        <span className="jl-job-detail-value">{job.location}</span>
                                    </div>
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon salary"></div>
                                        <span className="jl-job-detail-label">Salary:</span>
                                        <span className="jl-job-detail-value jl-salary-value">Rs. {job.salary?.toLocaleString()}</span>
                                    </div>
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon company"></div>
                                        <span className="jl-job-detail-label">Company:</span>
                                        <span className="jl-job-detail-value jl-company-name">{job.companyName || "Confidential"}</span>
                                    </div>
                                </div>

                                <div className="jl-job-actions">
                                    <button className="jl-btn jl-btn-primary">Apply Now</button>
                                    <button className="jl-btn jl-btn-secondary">Save Job</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="jl-no-jobs-message">
                            {searchTerm ? `No jobs found matching "${searchTerm}"` : "No jobs available at the moment"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}*/
export default function JobListing({ jobs = [] ,navigate } ) {
  if (jobs.length === 0) {
    return <p className="jl-no-jobs-message">No jobs to display.</p>;
  }

  return (
    <div className="jl-jobs-grid">
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {jobs.map((job, index) => (
          <li key={index} className="jl-job-card">
            <div className="jl-job-header">
              <h3 className="jl-job-title">{job.jobTitle}</h3>
              <div className="jl-job-badge">Featured</div>
            </div>

            <p className="jl-job-description">
              {job.jobDescription
                ? job.jobDescription.length > 100
                  ? job.jobDescription.substring(0, 100) + "..."
                  : job.jobDescription
                : "No description available."}
            </p>

            <div className="jl-job-details">
              <div className="jl-job-detail-item">
                <div className="jl-job-detail-icon"></div>
                <span className="jl-job-detail-label">Location:</span>
                <span className="jl-job-detail-value">{job.location || "Not specified"}</span>
              </div>

              <div className="jl-job-detail-item">
                <div className="jl-job-detail-icon salary"></div>
                <span className="jl-job-detail-label">Salary:</span>
                <span className="jl-job-detail-value jl-salary-value">
                  {job.salary ? `Rs. ${job.salary.toLocaleString()}` : "Not disclosed"}
                </span>
              </div>

              <div className="jl-job-detail-item">
                <div className="jl-job-detail-icon company"></div>
                <span className="jl-job-detail-label">Company:</span>
                <span className="jl-job-detail-value jl-company-name">{job.companyName || "Unknown Company"}</span>
              </div>
            </div>

            <div className="jl-job-actions">
              <button className="jl-btn jl-btn-primary" style={{ marginRight: "10px" }} onClick={()=>navigate(`/applyJob?id=${job.id}`)}>Apply Now</button>
              <button className="jl-btn jl-btn-secondary">Save Job</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
