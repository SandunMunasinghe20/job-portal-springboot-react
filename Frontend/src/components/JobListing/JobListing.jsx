import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { toast } from "react-toastify";
import "./JobListing.css";

export default function JobListing() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");

    const openDeleteModal = (job) => {
        setJobToDelete(job);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        if (jobToDelete) {
            handleDelete(jobToDelete);
        }
        setModalOpen(false);
    };

    const cancelDelete = () => {
        setJobToDelete(null);
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        toast.dismiss();
        setLoading(true);

        if (!token) {
            toast.error("Please login first");
            navigate("/login");
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
                toast.error("Failed to fetch jobs");
                return;
            }

            const data = await response.json();
            setJobs(data);
            toast.success("Jobs loaded successfully");
        } catch (error) {
            toast.error("An error occurred while fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (job) => {
        toast.dismiss();

        try {
            const response = await fetch(
                `http://localhost:8080/api/jobs/delete/${job.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!response.ok) {
                const data = await response.text();
                toast.error(data);
                return;
            }

            setJobs((prev) => prev.filter((j) => j.id !== job.id));
            toast.success("Job deleted successfully");
        } catch (error) {
            toast.error("An error occurred while deleting the job");
        }
    };

    useEffect(() => {
        handleSubmit();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const title = job.jobTitle ?? "";
        const desc = job.jobDescription ?? "";
        const loc = job.location ?? "";
        const company = job.companyName ?? "";

        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="jl-container">
            <div className="jl-header">
                <h1 className="jl-title">Job Board</h1>
                <p className="jl-subtitle">
                    Discover exceptional career opportunities tailored for you
                </p>
                <div className="jl-stats">
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">{jobs.length}</span>
                        <span>Total Jobs</span>
                    </div>
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">
                            {new Set(jobs.map((job) => job.companyName)).size}
                        </span>
                        <span>Companies</span>
                    </div>
                    <div className="jl-stat-item">
                        <span className="jl-stat-number">
                            {new Set(jobs.map((job) => job.location)).size}
                        </span>
                        <span>Locations</span>
                    </div>
                </div>
            </div>

            {!loading && jobs.length > 0 && (
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
                                        <div className="jl-job-detail-icon company"></div>
                                        <span className="jl-job-detail-label">Company:</span>
                                        <span className="jl-job-detail-value jl-company-name">
                                            {job.companyName || "Confidential"}
                                        </span>
                                    </div>
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon"></div>
                                        <span className="jl-job-detail-label">Location:</span>
                                        <span className="jl-job-detail-value">{job.location}</span>
                                    </div>
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon salary"></div>
                                        <span className="jl-job-detail-label">Salary:</span>
                                        <span className="jl-job-detail-value jl-salary-value">
                                            Rs. {job.salary?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="jl-job-detail-item">
                                        <div className="jl-job-detail-icon job-type"></div>
                                        <span className="jl-job-detail-label">Job Type:</span>
                                        <span className="jl-job-detail-value jl-company-name">
                                            {job.jobType}
                                        </span>
                                    </div>
                                </div>

                                <div className="jl-job-actions">
                                    {role === "seeker" && (
                                        <button
                                            className="jl-btn jl-btn-primary"
                                            onClick={() => navigate(`/applyJob?id=${job.id}`)}
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                    {role === "seeker" && (
                                        <button className="jl-btn jl-btn-primary">Save Job</button>
                                    )}
                                    {role === "employer" && (
                                        <button
                                            className="jl-btn jl-btn-secondary"
                                            onClick={() => navigate(`/updateJobs?id=${job.id}`)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {(role === "employer" || role === "admin") && (
                                        <button
                                            className="jl-btn jl-btn-secondary"
                                            onClick={() => openDeleteModal(job)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {modalOpen && jobToDelete?.id === job.id && (
                                    <ConfirmModal
                                        message="Are you sure you want to delete this job?"
                                        onConfirm={confirmDelete}
                                        onCancel={cancelDelete}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="jl-no-jobs-message">
                            {searchTerm
                                ? `No jobs found matching "${searchTerm}"`
                                : "No jobs available at the moment"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
