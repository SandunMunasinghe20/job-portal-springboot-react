import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { toast } from "react-toastify";
//import "./JobListing.css";

export default function JobListing() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [expandedJobId, setExpandedJobId] = useState(null);

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

    const toggleExpand = (id) => {
        setExpandedJobId((prev) => (prev === id ? null : id));
    }

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
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-2xl mx-auto">

            <div className="available-jobs">
                <h1 className="flex justify-center items-center co text-blue-600">Job Board</h1>
                <p className="text-center py-4">
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
                <div className="jl-spinner">Loading...</div>
            ) : (
                <div className="text-white">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (

                            <div key={index} className="bg-black rounded-2xl shadow-md p-6 mb-6">

                                <div className=" flex justify-between items-center w-full">
                                    <h3 className="text-4xl">{job.jobTitle}</h3>
                                    <div className="text-green-600 m-1">{job.days}</div>
                                    <div>{job.skillsRequired}</div>
                                </div>

                                <div className="flex justify-between">
                                    <ul className="flex space-x-6 text-gray-700">
                                        <li className="flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.5l1-1h2l1 1H17a2 2 0 012 2v12a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>{job.jobType}</span>
                                        </li>
                                        <li className="flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                            <span>{job.location}</span>
                                        </li>
                                    </ul>
                                </div>


                                <div className=" text-right">
                                    Rs. {job.salary?.toLocaleString()}
                                </div>

                                <button
                                    className="text-blue-600 text-sm underline"
                                    onClick={() => toggleExpand(job.id)}
                                >
                                    {expandedJobId === job.id ? "Hide Details" : "Show Details"}
                                </button>

                                {expandedJobId === job.id && (
                                    <>
                                        <p>
                                            {job.companyName || "Confidential"}
                                        </p>
                                        <p className="jl-job-description">{job.jobDescription}</p>
                                    </>
                                )}



                                {/*Apply or save Job*/}

                                {expandedJobId === job.id
                                    &&
                                    <div className="flex justify-center ">
                                        <div className="flex justify-between items-center w-60 pt-4">
                                            {role === "seeker" && (
                                                <button

                                                    onClick={() => navigate(`/applyJob?id=${job.id}`)}
                                                >
                                                    Apply Now
                                                </button>
                                            )}
                                            {role === "seeker" && (
                                                <button >Save Job</button>
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
                                    </div>
                                }

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
