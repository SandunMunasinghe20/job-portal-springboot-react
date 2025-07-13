import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { toast } from "react-toastify";
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import SubmitButton from "../submitButton/submitbutton";
import Spinner from "../Spinner/Spinner";
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

    const filteredJobs = React.useMemo(() => {
        return jobs.filter(job => {
            const search = searchTerm.toLowerCase();
            return (
                (job.jobTitle ?? "").toLowerCase().includes(search) ||
                (job.jobDescription ?? "").toLowerCase().includes(search) ||
                (job.location ?? "").toLowerCase().includes(search) ||
                (job.companyName ?? "").toLowerCase().includes(search) ||
                (job.jobType ?? "").toLowerCase().includes(search) ||
                (job.skillsRequired ?? "").toLowerCase().includes(search)
            );
        });
    }, [jobs, searchTerm]);


    return (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-2xl mx-auto">

            <div>
                <h1 className="text-center text-3xl items-center font-bold text-blue-600 mb-2">{(role === 'seeker' || role === 'admin') ? "Job Board" : "Your Jobs"}</h1>
                {role === 'seeker'
                    &&
                    <p className="text-center text-gray-500 mb-6">
                        Discover exceptional career opportunities tailored for you
                    </p>}

                {/*only for seekers and admins*/}
                {(role === 'seeker' || role === 'admin')
                    &&
                    <div className="grid grid-cols-3 gap-4 text-center">

                        <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
                            <span className="block text-2xl font-semibold text-blue-600">{jobs.length}</span>
                            <span className="text-sm text-gray-600">Total Jobs</span>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
                            <span className="block text-2xl font-semibold text-blue-600">
                                {new Set(jobs.map((job) => job.companyName)).size}
                            </span>
                            <span className="text-sm text-gray-600">Companies</span>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
                            <span className="block text-2xl font-semibold text-blue-600">
                                {new Set(jobs.map((job) => job.location)).size}
                            </span>
                            <span className="text-sm text-gray-600">Locations</span>
                        </div>

                    </div>
                }
            </div>

            {/*for emp*/}
            {role === 'employer' && (
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-xl shadow-sm">
                        <span className="block text-2xl font-semibold text-green-600">{jobs.length}</span>
                        <span className="text-sm text-gray-600">Your Posted Jobs</span>
                    </div>

                    {/* <div className="p-4 bg-green-50 rounded-xl shadow-sm">
                        <span className="block text-2xl font-semibold text-green-600">{totalApplicants}</span>
                        <span className="text-sm text-gray-600">Total Applicants</span>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl shadow-sm">
                        <span className="block text-2xl font-semibold text-green-600">{positionsFilled}</span>
                        <span className="text-sm text-gray-600">Positions Filled</span>
                    </div>
                    */}
                </div>
            )}


            {/*search bar*/}
            {!loading && jobs.length > 0 && (
                <div className="mt-6 mb-4">
                    <input
                        type="text"
                        placeholder="Search jobs by title, company, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                    />
                </div>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <div className="text-black">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (

                            <div key={job.id} className="bg-white rounded-2xl shadow-lg p-6 mb-6">

                                <div className=" flex justify-between items-center w-full">
                                    <h3 className="text-3xl font-semibold break-words my-4">{job.jobTitle}</h3>

                                    {/*Job posted days + icon*/}
                                    <div className="text-green-600 m-1"><div className="flex items-center space-x-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{job.days}</span>
                                    </div>
                                    </div>

                                </div>

                                <div className="flex justify-between">
                                    <ul className="flex space-x-6 text-gray-700 mt-2">
                                        <li className="flex items-center space-x-1 ">
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


                                <div className="text-right text-gray-700 font-semibold mt-4 text-lg">
                                    Rs. {job.salary?.toLocaleString()}
                                </div>

                                {/*job description*/}
                                {expandedJobId === job.id && (
                                    <div className="gap-6 px-4 py-4">
                                        <p className="my-4 text-left font-semibold text-gray-800">
                                            {job.companyName || "Confidential"}
                                        </p>
                                        <p className=" max-w-xl text-gray-700 leading-relaxed my-4 text-left break-words">{job.jobDescription}</p>
                                    </div>
                                )}


                                {/*skills + hide/view button*/}
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-wrap gap-2 ">
                                        {(job.skillsRequired || "")
                                            .split(',')
                                            .map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-200 text-gray-800 px-2 py-1 mx-1 my-2 rounded-full text-s "
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                    </div>
                                    <button
                                        className="text-blue-600 text-sm underline"
                                        onClick={() => toggleExpand(job.id)}
                                    >
                                        {expandedJobId === job.id ? <FiChevronDown className="text-3xl" /> : <FiChevronRight className="text-3xl" />}
                                    </button>
                                </div>


                                {/*Apply or save Job*/}

                                {expandedJobId === job.id
                                    &&
                                    <div className="flex justify-center ">
                                        <div className="flex justify-between items-center w-60 pt-4">
                                            {role === "seeker" && (
                                                <SubmitButton
                                                    msg="Apply Now"
                                                    onClick={() => navigate(`/applyJob?id=${job.id}`)}
                                                />


                                            )}
                                            {role === "seeker" && (
                                                <SubmitButton msg="Save Job" />
                                            )}
                                            {role === "employer" && (
                                                <SubmitButton
                                                    className="jl-btn jl-btn-secondary"
                                                    msg="Edit"
                                                    onClick={() => navigate(`/updateJobs?id=${job.id}`)}
                                                />


                                            )}
                                            {(role === "employer" || role === "admin") && (
                                                <SubmitButton
                                                    className="jl-btn jl-btn-secondary"
                                                    msg=" Delete"
                                                    onClick={() => openDeleteModal(job)}
                                                />


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
