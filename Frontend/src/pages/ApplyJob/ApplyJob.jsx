import React, { use, useEffect, useState } from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
//import "./applyjob.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

export default function ApplyJob() {

    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("id");
    const token = localStorage.getItem("auth-token");

    //const [success, setSuccess] = useState("");
    //const [err, setErr] = useState("");
    const [jobData, setJobData] = useState("");
    const [resume, setResume] = useState(null);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    useEffect(() => {

        const fetchJobDetails = async () => {
            //setErr("");
            //setSuccess("");
            try {
                const response = await fetch(`http://localhost:8080/api/jobs/findById/${jobId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                });
                if (!response.ok) {
                    toast.error("Failed to load Job Details");
                    return;
                }
                const data = await response.json();
                console.log("data ", data);
                setJobData(data);

            } catch (e) {
                toast.error("Unable to connect with the server.");
                return;
            }
        };

        if (jobId) {
            fetchJobDetails();
        }

    }, [jobId, token]);

    const handlesubmit = async () => {
        //setErr("");
        //setSuccess("");
        console.log("token when applying to job: ", token);

        if (!resume) {
            toast.error("Please upload a resume.");
            return;
        }

        const maxSize = 10 * 1024 * 1024;

        const allowedTypes = [
            "application/pdf",
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];

        if (!allowedTypes.includes(resume.type)) {
            toast.error("Only PDF, DOC or DOCX files are allowed");
            setResume(null);
            return;
        }

        if (resume.size > maxSize) {
            toast.error("File size must be less than 10MB.");
            setResume(null);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("jobId", jobId);
            formData.append("resume", resume);

            const response = await fetch("http://localhost:8080/api/applyJobs/", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,

            });

            if (!response.ok) {
                const errmsg = await response.text();
                console.log("err ", errmsg);
                toast.error(errmsg);

                setTimeout(() => {
                    navigate('/jobs');
                }, 1000);

                return;
            }
            const data = await response.text();
            toast.success(data);
            console.log("data : ", data);
            setTimeout(() => {
                navigate('/myApplications');
            }, 1000);


        } catch (e) {
            toast.error("Error occured while applying to job");
            return;
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    }

    return (
        <><NavBar role={role} />
            <div className="apply-job-card">

                <h2>{jobData.title}</h2>

                <p>{jobData.description}</p>
                <img src={jobData.image} alt="Company Logo" className="company-image" />
                <p>Job Title: {jobData.jobTitle}</p>
                <p>Company: {jobData.companyName}</p>
                <p>Salary: {jobData.salary}</p>
                <p>Location: {jobData.location}</p>

                <input type="file" onChange={handleFileChange} />
                <SubmitButton msg="Apply" onClick={handlesubmit} />

            </div>
        </>
    );
}